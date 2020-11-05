import _each from 'lodash/each';
import _tail from 'lodash/tail';
import log from 'js-logger';
import _throttle from 'lodash/throttle';
import colornames from 'colornames';
import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import {
    IMPERIAL_UNITS,
    METRIC_UNITS
} from 'app/constants';
import CombinedCamera from 'app/lib/three/CombinedCamera';
import TrackballControls from 'app/lib/three/TrackballControls';
import * as WebGL from 'app/lib/three/WebGL';
import Workspaces from 'app/lib/workspaces';
import { getBoundingBox, loadSTL, loadTexture } from './helpers';
import Viewport from './Viewport';
import CoordinateAxes from './CoordinateAxes';
import Cuboid from './Cuboid';
import CuttingPointer from './CuttingPointer';
import GridLine from './GridLine';
import TextSprite from './TextSprite';
import GCodeVisualizer from './GCodeVisualizer';
import {
    CAMERA_MODE_PAN,
    CAMERA_MODE_ROTATE
} from './constants';

const PERSPECTIVE_FOV = 70;
const PERSPECTIVE_NEAR = 0.001;
const PERSPECTIVE_FAR = 2000;
const ORTHOGRAPHIC_FOV = 35;
const ORTHOGRAPHIC_NEAR = 0.001;
const ORTHOGRAPHIC_FAR = 2000;
const CAMERA_DISTANCE = 200; // Move the camera out a bit from the origin (0, 0, 0)
const TRACKBALL_CONTROLS_MIN_DISTANCE = 1;
const TRACKBALL_CONTROLS_MAX_DISTANCE = 2000;

const VizBox = React.forwardRef((props, ref) => (
    <div
        style={{
            visibility: props.show ? 'visible' : 'hidden',
        }}
        ref={ref}
    />
));

class Visualizer extends Component {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        show: PropTypes.bool,
        cameraPosition: PropTypes.oneOf(['top', '3d', 'front', 'left', 'right']),
        state: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    pubsubTokens = [];

    isAgitated = false;

    machinePosition = {
        x: 0,
        y: 0,
        z: 0
    };

    workPosition = {
        x: 0,
        y: 0,
        z: 0
    };

    group = new THREE.Group();

    node = React.createRef();

    throttledResize = _throttle(() => {
        this.resizeRenderer();
    }, 32); // 60hz

    renderAnimationLoop = () => {
        if (this.isAgitated) {
            // Call the render() function up to 60 times per second (i.e. 60fps)
            requestAnimationFrame(this.renderAnimationLoop);

            const rpm = 600;
            this.rotateCuttingTool(rpm);
        } else {
            const rpm = 0;
            this.rotateCuttingTool(rpm);
        }

        // Update the scene
        this.updateScene();
    };

    constructor(props) {
        super(props);

        // Three.js
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.viewport = null;
        this.cuttingTool = null;
        this.cuttingPointer = null;
        this.limits = null;
        this.visualizer = null;
    }

    componentDidMount() {
        this.subscribe();
        this.addResizeEventListener();
        if (this.node.current) {
            const el = ReactDOM.findDOMNode(this.node.current);
            this.createScene(el);
            this.resizeRenderer();
        }
    }

    componentDidUpdate(prevProps) {
        let forceUpdate = false;
        let needUpdateScene = false;
        const prevState = prevProps.state;
        const state = this.props.state;

        // Enable or disable 3D view
        if ((prevProps.show !== this.props.show) && (this.props.show === true)) {
            this.viewport.update();

            // Set forceUpdate to true when enabling or disabling 3D view
            forceUpdate = true;
            needUpdateScene = true;
        }

        // Update visualizer's frame index
        if (this.visualizer) {
            const frameIndex = state.gcode.sent;
            this.visualizer.setFrameIndex(frameIndex);
        }

        // Projection
        if (prevState.projection !== state.projection) {
            if (state.projection === 'orthographic') {
                this.camera.toOrthographic();
                this.camera.setZoom(1);
                this.camera.setFov(ORTHOGRAPHIC_FOV);
            } else {
                this.camera.toPerspective();
                this.camera.setZoom(1);
                this.camera.setFov(PERSPECTIVE_FOV);
            }
            if (this.viewport) {
                this.viewport.update();
            }
            needUpdateScene = true;
        }

        // Camera Mode
        if (prevState.cameraMode !== state.cameraMode) {
            this.setCameraMode(state.cameraMode);
            needUpdateScene = true;
        }

        // Whether to show coordinate system
        if ((prevState.units !== state.units) ||
            (prevState.objects.coordinateSystem.visible !== state.objects.coordinateSystem.visible)) {
            const visible = state.objects.coordinateSystem.visible;

            // Imperial
            const imperialCoordinateSystem = this.group.getObjectByName('ImperialCoordinateSystem');
            if (imperialCoordinateSystem) {
                imperialCoordinateSystem.visible = visible && (state.units === IMPERIAL_UNITS);
            }

            // Metric
            const metricCoordinateSystem = this.group.getObjectByName('MetricCoordinateSystem');
            if (metricCoordinateSystem) {
                metricCoordinateSystem.visible = visible && (state.units === METRIC_UNITS);
            }

            needUpdateScene = true;
        }

        // Whether to show grid line numbers
        if ((prevState.units !== state.units) ||
            (prevState.objects.gridLineNumbers.visible !== state.objects.gridLineNumbers.visible)) {
            const visible = state.objects.gridLineNumbers.visible;

            // Imperial
            const imperialGridLineNumbers = this.group.getObjectByName('ImperialGridLineNumbers');
            if (imperialGridLineNumbers) {
                imperialGridLineNumbers.visible = visible && (state.units === IMPERIAL_UNITS);
            }

            // Metric
            const metricGridLineNumbers = this.group.getObjectByName('MetricGridLineNumbers');
            if (metricGridLineNumbers) {
                metricGridLineNumbers.visible = visible && (state.units === METRIC_UNITS);
            }

            needUpdateScene = true;
        }

        // Whether to show limits
        if (this.limits && (this.limits.visible !== state.objects.limits.visible)) {
            this.limits.visible = state.objects.limits.visible;
            needUpdateScene = true;
        }

        // Whether to show cutting tool or cutting pointer
        if (this.cuttingTool && this.cuttingPointer && (this.cuttingTool.visible !== state.objects.cuttingTool.visible)) {
            this.cuttingTool.visible = state.objects.cuttingTool.visible;
            this.cuttingPointer.visible = !state.objects.cuttingTool.visible;
            needUpdateScene = true;
        }

        { // Update position
            let needUpdatePosition = false;

            // Machine position
            const { x: mpox0, y: mpoy0, z: mpoz0 } = this.machinePosition;
            const { x: mpox1, y: mpoy1, z: mpoz1 } = state.machinePosition;
            if (mpox0 !== mpox1 || mpoy0 !== mpoy1 || mpoz0 !== mpoz1) {
                this.machinePosition = state.machinePosition;
                needUpdatePosition = true;
                needUpdateScene = true;
            }

            // Work position
            const { x: wpox0, y: wpoy0, z: wpoz0 } = this.workPosition;
            const { x: wpox1, y: wpoy1, z: wpoz1 } = state.workPosition;
            if (wpox0 !== wpox1 || wpoy0 !== wpoy1 || wpoz0 !== wpoz1) {
                this.workPosition = state.workPosition;
                needUpdatePosition = true;
                needUpdateScene = true;
            }

            if (needUpdatePosition) {
                this.updateCuttingToolPosition();
                this.updateCuttingPointerPosition();
                this.updateVisualizerPosition();
            }
        }

        if (needUpdateScene) {
            this.updateScene({ forceUpdate: forceUpdate });
        }

        if (this.isAgitated !== state.isAgitated) {
            this.isAgitated = state.isAgitated;

            if (this.isAgitated) {
                // Call renderAnimationLoop when the state changes and isAgitated is true
                requestAnimationFrame(this.renderAnimationLoop);
            }
        }

        if (prevProps.cameraPosition !== this.props.cameraPosition) {
            if (this.props.cameraPosition === 'top') {
                this.toTopView();
            }
            if (this.props.cameraPosition === '3d') {
                this.to3DView();
            }
            if (this.props.cameraPosition === 'front') {
                this.toFrontView();
            }
            if (this.props.cameraPosition === 'left') {
                this.toLeftSideView();
            }
            if (this.props.cameraPosition === 'right') {
                this.toRightSideView();
            }
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.removeResizeEventListener();
        this.clearScene();
    }

    subscribe() {
        const tokens = [
            pubsub.subscribe('resize', (msg) => {
                this.resizeRenderer();
            })
        ];
        this.pubsubTokens = this.pubsubTokens.concat(tokens);
    }

    unsubscribe() {
        this.pubsubTokens.forEach((token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }

    // https://tylercipriani.com/blog/2014/07/12/crossbrowser-javascript-scrollbar-detection/
    hasVerticalScrollbar() {
        return window.innerWidth > document.documentElement.clientWidth;
    }

    hasHorizontalScrollbar() {
        return window.innerHeight > document.documentElement.clientHeight;
    }

    // http://www.alexandre-gomes.com/?p=115
    getScrollbarWidth() {
        const inner = document.createElement('p');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '0px';
        outer.style.left = '0px';
        outer.style.visibility = 'hidden';
        outer.style.width = '200px';
        outer.style.height = '150px';
        outer.style.overflow = 'hidden';
        outer.appendChild(inner);

        document.body.appendChild(outer);
        const w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        const w2 = (w1 === inner.offsetWidth) ? outer.clientWidth : inner.offsetWidth;
        document.body.removeChild(outer);

        return (w1 - w2);
    }

    getVisibleWidth() {
        const el = ReactDOM.findDOMNode(this.node.current);
        const visibleWidth = Math.max(
            Number(el && el.parentNode && el.parentNode.clientWidth) || 0,
            360
        );

        return visibleWidth;
    }

    getVisibleHeight() {
        const clientHeight = document.documentElement.clientHeight;
        const navbarHeight = 50;
        const widgetHeaderHeight = 38;
        const widgetFooterHeight = 38;
        const visibleHeight = (
            clientHeight - navbarHeight - widgetHeaderHeight - widgetFooterHeight - 1
        );

        return visibleHeight;
    }

    addResizeEventListener() {
        window.addEventListener('resize', this.throttledResize);
    }

    removeResizeEventListener() {
        window.removeEventListener('resize', this.throttledResize);
    }

    resizeRenderer() {
        if (!(this.camera && this.renderer)) {
            return;
        }

        const width = this.getVisibleWidth();
        const height = this.getVisibleHeight();

        if (width === 0 || height === 0) {
            log.warn(`The width (${width}) and height (${height}) cannot be a zero value`);
        }

        // https://github.com/mrdoob/three.js/blob/dev/examples/js/cameras/CombinedCamera.js#L156
        // THREE.CombinedCamera.prototype.setSize = function(width, height) {
        //     this.cameraP.aspect = width / height;
        //     this.left = - width / 2;
        //     this.right = width / 2;
        //     this.top = height / 2;
        //     this.bottom = - height / 2;
        // }
        this.camera.setSize(width, height);
        this.camera.aspect = width / height; // Update camera aspect as well
        this.camera.updateProjectionMatrix();

        // Initialize viewport at the first time of resizing renderer
        if (!this.viewport) {
            // Defaults to 300x300mm
            const viewportDimensions = {
                x: this.workspace.axes.x.range || 300,
                y: this.workspace.axes.y.range || 300,
            };
            this.viewport = new Viewport(this.camera, viewportDimensions.x, viewportDimensions.y);
        }

        this.controls.handleResize();

        this.renderer.setSize(width, height);

        // Update the scene
        this.updateScene();
    }

    createLimitsCuboid() {
        const color = colornames('indianred');
        const opacity = 0.5;
        const transparent = true;
        const dashed = true;
        const dashSize = 3; // The size of the dash.
        const gapSize = 1; // The size of the gap.
        const linewidth = 1; // Controls line thickness.
        const scale = 1; // The scale of the dashed part of a line.
        const ranges = {
            dx: this.workspace.axes.x.range,
            dy: this.workspace.axes.y.range,
            dz: this.workspace.axes.z.range,
        };
        const cb = {
            ...ranges,
            color,
            opacity,
            transparent,
            linewidth,
            dashed,
            dashSize,
            gapSize,
            scale,
        };
        const cuboid = new Cuboid(cb);
        cuboid.position.set(
            this.workspace.axes.x.middle,
            this.workspace.axes.y.middle,
            this.workspace.axes.z.middle
        );
        return cuboid;
    }

    _axisLabels = [];

    axisLabel(axis, positive = true) {
        const pos = positive ? (axis.max + axis.pad) : (axis.min - axis.pad);
        return new TextSprite({
            x: axis.key === 'x' ? pos : 0,
            y: axis.key === 'y' ? pos : 0,
            z: axis.key === 'z' ? pos : 0,
            size: 20,
            text: axis.name,
            color: axis.color,
        });
    }

    createCoordinateSystem(units) {
        const isImperial = units === IMPERIAL_UNITS;
        const axes = this.workspace.axes;

        const group = new THREE.Group();
        { // Coordinate Grid
            const gridLine = new GridLine(isImperial, axes);
            _each(gridLine.children, (o) => {
                // o.material.opacity = 0.15;
                o.material.transparent = true;
                o.material.depthWrite = false;
            });
            gridLine.name = 'GridLine';
            group.add(gridLine);
        }

        { // Coordinate Axes
            const coordinateAxes = new CoordinateAxes(axes);
            coordinateAxes.name = 'CoordinateAxes';
            group.add(coordinateAxes);
        }

        { // Axis Labels
            this._axisLabels = this.workspace.mapAxes((axis) => {
                const label = this.axisLabel(axis);
                group.add(label);
                return label;
            });
        }

        return group;
    }

    _gridTextLabels = [];

    createGridLineNumbers(group, axisKey, units) {
        const isImperial = units === IMPERIAL_UNITS;
        const axis = this.workspace.axes[axisKey];

        const textSize = 10;
        const textOffset = isImperial ? (25.4 / 5) : (10 / 5);

        axis.eachGridLine((i, majorStep) => {
            if (Math.abs(i) <= 1 || !majorStep) {
                // Skip center line and non-major steps to keep UI clean.
                return;
            }
            const coords = { x: 0, y: 0, z: 0 };
            if (axisKey === 'x') {
                coords.x = i;
                coords.y = textOffset;
            } else if (axisKey === 'y') {
                coords.x = -textOffset;
                coords.y = i;
            } else if (axisKey === 'z') {
                coords.z = i;
            }
            const v = isImperial ? (i / 25.4) : i;
            const textLabel = new TextSprite({
                ...coords,
                size: textSize,
                text: axis.getAxisValueString(v, isImperial) + units,
                textAlign: 'center',
                textBaseline: 'bottom',
                color: axis.color,
                opacity: 0.5
            });
            group.add(textLabel);
            this._gridTextLabels.push(textLabel);
        }, isImperial);

        return group;
    }

    //
    // Creating a scene
    // http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
    //
    createScene(el) {
        if (!el) {
            return;
        }

        const { state } = this.props;
        const { units, objects } = state;
        const width = this.getVisibleWidth();
        const height = this.getVisibleHeight();

        // WebGLRenderer
        this.renderer = new THREE.WebGLRenderer({
            autoClearColor: true,
            antialias: true,
            alpha: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.setClearColor(new THREE.Color(colornames('white')), 1);
        // this.renderer.setClearColorHex(this.workspace.hexColor, 0.15);
        this.renderer.setSize(width, height);
        this.renderer.clear();

        el.appendChild(this.renderer.domElement);

        // To actually be able to display anything with Three.js, we need three things:
        // A scene, a camera, and a renderer so we can render the scene with the camera.
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.workspace.bkColor);

        this.camera = this.createCombinedCamera(width, height);
        this.controls = this.createTrackballControls(this.camera, this.renderer.domElement);

        this.setCameraMode(state.cameraMode);

        // Projection
        if (state.projection === 'orthographic') {
            this.camera.toOrthographic();
            this.camera.setZoom(1);
            this.camera.setFov(ORTHOGRAPHIC_FOV);
        } else {
            this.camera.toPerspective();
            this.camera.setZoom(1);
            this.camera.setFov(PERSPECTIVE_FOV);
        }

        { // Directional Light
            const color = 0xffffff;
            const intensity = 1;
            let light;

            light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, -1, 1);
            this.scene.add(light);

            light = new THREE.DirectionalLight(color, intensity);
            light.position.set(1, -1, 1);
            this.scene.add(light);
        }

        { // Ambient Light
            const light = new THREE.AmbientLight(colornames('gray 25')); // soft white light
            this.scene.add(light);
        }

        { // Imperial Coordinate System
            const visible = objects.coordinateSystem.visible;
            const imperialCoordinateSystem = this.createCoordinateSystem(IMPERIAL_UNITS);
            imperialCoordinateSystem.name = 'ImperialCoordinateSystem';
            imperialCoordinateSystem.visible = visible && (units === IMPERIAL_UNITS);
            this.group.add(imperialCoordinateSystem);
        }

        { // Metric Coordinate System
            const visible = objects.coordinateSystem.visible;
            const metricCoordinateSystem = this.createCoordinateSystem(METRIC_UNITS);
            metricCoordinateSystem.name = 'MetricCoordinateSystem';
            metricCoordinateSystem.visible = visible && (units === METRIC_UNITS);
            this.group.add(metricCoordinateSystem);
        }

        this._gridTextLabels = [];
        { // Imperial Grid Line Numbers
            const visible = objects.gridLineNumbers.visible;
            const imperialGridLineNumbers = new THREE.Group();
            this.createGridLineNumbers(imperialGridLineNumbers, 'x', IMPERIAL_UNITS);
            this.createGridLineNumbers(imperialGridLineNumbers, 'y', IMPERIAL_UNITS);
            imperialGridLineNumbers.name = 'ImperialGridLineNumbers';
            imperialGridLineNumbers.visible = visible && (units === IMPERIAL_UNITS);
            this.group.add(imperialGridLineNumbers);
        }

        { // Metric Grid Line Numbers
            const visible = objects.gridLineNumbers.visible;
            const metricGridLineNumbers = new THREE.Group();
            this.createGridLineNumbers(metricGridLineNumbers, 'x', METRIC_UNITS);
            this.createGridLineNumbers(metricGridLineNumbers, 'y', METRIC_UNITS);
            metricGridLineNumbers.name = 'MetricGridLineNumbers';
            metricGridLineNumbers.visible = visible && (units === METRIC_UNITS);
            this.group.add(metricGridLineNumbers);
        }

        { // Cutting Tool
            Promise.all([
                loadSTL('assets/models/stl/bit.stl').then(geometry => geometry),
                loadTexture('assets/textures/brushed-steel-texture.jpg').then(texture => texture),
            ]).then(result => {
                const [geometry, texture] = result;

                // Rotate the geometry 90 degrees about the X axis.
                geometry.rotateX(-Math.PI / 2);

                // Scale the geometry data.
                geometry.scale(1, 1, 1);

                // Compute the bounding box.
                geometry.computeBoundingBox();

                // Set the desired position from the origin rather than its center.
                const height = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
                geometry.translate(0, 0, (height / 2));

                let material;
                if (geometry.hasColors) {
                    material = new THREE.MeshLambertMaterial({
                        map: texture,
                        opacity: 0.9,
                        transparent: false
                    });
                }

                const object = new THREE.Object3D();
                object.add(new THREE.Mesh(geometry, material));

                this.cuttingTool = object;
                this.cuttingTool.name = 'CuttingTool';
                this.cuttingTool.visible = objects.cuttingTool.visible;

                this.group.add(this.cuttingTool);
                this.updateCuttingToolPosition();
                // Update the scene
                this.updateScene();
            });
        }

        { // Cutting Pointer
            this.cuttingPointer = new CuttingPointer({
                color: colornames('indianred'),
                diameter: 2
            });
            this.cuttingPointer.name = 'CuttingPointer';
            this.cuttingPointer.visible = !objects.cuttingTool.visible;
            this.group.add(this.cuttingPointer);
            this.updateCuttingPointerPosition();
        }

        { // Limits
            this.limits = this.createLimitsCuboid();
            this.limits.name = 'Limits';
            this.limits.visible = objects.limits.visible;
            this.group.add(this.limits);
        }

        this.scene.add(this.group);

        this.updateUIScale();
    }

    // @param [options] The options object.
    // @param [options.forceUpdate] Force rendering
    updateScene(options) {
        const { forceUpdate = false } = { ...options };
        const needUpdateScene = this.props.show || forceUpdate;

        const zoom = this.camera.zoom;
        if (zoom !== this._lastZoom) {
            this.updateUIScale(1 / zoom);
            this._lastZoom = zoom;
        }

        if (this.renderer && needUpdateScene) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    clearScene() {
        // to iterrate over all children (except the first) in a scene
        const objsToRemove = _tail(this.scene.children);
        _each(objsToRemove, (obj) => {
            this.scene.remove(obj);
        });

        if (this.controls) {
            this.controls.dispose();
        }

        // Update the scene
        this.updateScene();
    }

    createCombinedCamera(width, height) {
        const frustumWidth = width / 2;
        const frustumHeight = (height || width) / 2; // same to width if height is 0
        const fov = PERSPECTIVE_FOV;
        const near = PERSPECTIVE_NEAR;
        const far = PERSPECTIVE_FAR;
        const orthoNear = ORTHOGRAPHIC_NEAR;
        const orthoFar = ORTHOGRAPHIC_FAR;

        const camera = new CombinedCamera(
            frustumWidth,
            frustumHeight,
            fov,
            near,
            far,
            orthoNear,
            orthoFar
        );

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = CAMERA_DISTANCE;

        return camera;
    }

    createPerspectiveCamera(width, height) {
        const fov = PERSPECTIVE_FOV;
        const aspect = (width > 0 && height > 0) ? Number(width) / Number(height) : 1;
        const near = PERSPECTIVE_NEAR;
        const far = PERSPECTIVE_FAR;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = CAMERA_DISTANCE;

        return camera;
    }

    createOrthographicCamera(width, height) {
        const left = -width / 2;
        const right = width / 2;
        const top = height / 2;
        const bottom = -height / 2;
        const near = ORTHOGRAPHIC_NEAR;
        const far = ORTHOGRAPHIC_FAR;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

        return camera;
    }

    createTrackballControls(object, domElement) {
        const controls = new TrackballControls(object, domElement);

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.minDistance = TRACKBALL_CONTROLS_MIN_DISTANCE;
        controls.maxDistance = TRACKBALL_CONTROLS_MAX_DISTANCE;

        let shouldAnimate = false;
        const animate = () => {
            controls.update();

            // Update the scene
            this.updateScene();

            if (shouldAnimate) {
                requestAnimationFrame(animate);
            }
        };

        controls.addEventListener('start', () => {
            shouldAnimate = true;
            animate();
        });
        controls.addEventListener('end', () => {
            shouldAnimate = false;
            this.updateScene();
        });
        controls.addEventListener('change', () => {
            // Update the scene
            this.updateScene();
        });

        return controls;
    }

    // Rotates the cutting tool around the z axis with a given rpm and an optional fps
    // @param {number} rpm The rounds per minutes
    // @param {number} [fps] The frame rate (Defaults to 60 frames per second)
    rotateCuttingTool(rpm = 0, fps = 60) {
        if (!this.cuttingTool) {
            return;
        }

        const delta = 1 / fps;
        const degrees = 360 * (delta * Math.PI / 180); // Rotates 360 degrees per second
        this.cuttingTool.rotateZ(-(rpm / 60 * degrees)); // rotate in clockwise direction
    }

    // Update cutting tool position
    updateCuttingToolPosition() {
        if (!this.cuttingTool) {
            return;
        }
        const mpos = this.machinePosition; // this.mposToLocalPoint(this.machinePosition);
        this.cuttingTool.position.set(mpos.x, mpos.y, mpos.z);
    }

    // Update cutting pointer position
    updateCuttingPointerPosition() {
        if (!this.cuttingPointer) {
            return;
        }
        const mpos = this.machinePosition; // this.mposToLocalPoint(this.machinePosition);
        this.cuttingPointer.position.set(mpos.x, mpos.y, mpos.z);
    }

    get wco() {
        const mpos = this.machinePosition;
        const wpos = this.workPosition;
        return {
            x: mpos.x - wpos.x,
            y: mpos.y - wpos.y,
            z: mpos.z - wpos.z,
        };
    }

    // Move the visualizer to the work position
    updateVisualizerPosition() {
        const wco = this.wco;
        if (!this.rendered || !wco) {
            return;
        }
        this.rendered.position.set(wco.x, wco.y, wco.z);
    }

    updateObjectScale(obj, scale) {
        if (!obj) {
            return;
        }
        obj.scale.x = scale;
        obj.scale.y = scale;
        obj.scale.z = scale;
    }

    updateUIScale(scale) {
        this.updateObjectScale(this.cuttingTool, scale);
        this.updateObjectScale(this.cuttingPointer, scale);
        Object.keys(this._axisLabels).forEach((axisKey) => {
            this.updateObjectScale(this._axisLabels[axisKey], scale);
        });
        this._gridTextLabels.forEach((label) => {
            this.updateObjectScale(label, scale);
        });
    }

    // Make the controls look at the specified position
    lookAt(x, y, z) {
        this.controls.target.x = x;
        this.controls.target.y = y;
        this.controls.target.z = z;
        this.controls.update();
    }

    // Make the controls look at the center position
    lookAtCenter() {
        if (this.viewport) {
            this.viewport.update();
        }
        if (this.controls) {
            this.controls.reset();
        }
        this.updateScene();
    }

    updateLookAt() {

    }

    load(name, gcode, callback) {
        // Remove previous G-code object
        this.unload();

        this.visualizer = new GCodeVisualizer();
        this.rendered = this.visualizer.render(gcode);
        this.rendered.name = 'Visualizer';
        this.group.add(this.rendered);

        const bbox = getBoundingBox(this.rendered);
        // // const axes = this.workspace.axes;
        // const dX = bbox.max.x - bbox.min.x;
        // const dY = bbox.max.y - bbox.min.y;
        // const dZ = bbox.max.z - bbox.min.z;
        // const center = new THREE.Vector3(
        //     bbox.min.x + (dX / 2),
        //     bbox.min.y + (dY / 2),
        //     bbox.min.z + (dZ / 2)
        // );

        // Set the pivot point to the center of the loaded object
        // this.pivotPoint.set(center.x, center.y, center.z);

        // Update position
        this.updateCuttingToolPosition();
        this.updateCuttingPointerPosition();
        this.updateVisualizerPosition();

        // if (this.viewport && dX > 0 && dY > 0) {
        //     // The minimum viewport is 50x50mm
        //     const width = Math.max(dX + axes.x.pad * 2, 50);
        //     const height = Math.max(dY + axes.y.pad * 2, 50);
        //     const target = new THREE.Vector3(0, 0, bbox.max.z);
        //     this.viewport.set(width, height, target);
        // }

        // Update the scene
        this.updateScene();

        (typeof callback === 'function') && callback({ bbox: bbox });
    }

    unload() {
        if (this.rendered) {
            this.group.remove(this.rendered);
            this.rendered = null;
        }

        if (this.visualizer) {
            this.visualizer = null;
        }

        if (this.controls) {
            this.controls.reset();
        }

        // if (this.viewport) {
        //     this.viewport.reset();
        // }

        // Update the scene
        this.updateScene();
    }

    setCameraMode(mode) {
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        // A number representing a given button:
        // 0: main button pressed, usually the left button or the un-initialized state
        const MAIN_BUTTON = 0;
        const ROTATE = 0;
        const PAN = 2;

        if (mode === CAMERA_MODE_ROTATE) {
            this.controls && this.controls.setMouseButtonState(MAIN_BUTTON, ROTATE);
        }
        if (mode === CAMERA_MODE_PAN) {
            this.controls && this.controls.setMouseButtonState(MAIN_BUTTON, PAN);
        }
    }

    toTopView() {
        if (this.controls) {
            this.controls.reset();
        }

        this.camera.up.set(0, 1, 0);
        this.camera.position.set(0, 0, CAMERA_DISTANCE);

        if (this.viewport) {
            this.viewport.update();
        }
        if (this.controls) {
            this.controls.update();
        }
        this.updateScene();
    }

    to3DView() {
        if (this.controls) {
            this.controls.reset();
        }

        this.camera.up.set(0, 0, 1);
        this.camera.position.set(CAMERA_DISTANCE, -CAMERA_DISTANCE, CAMERA_DISTANCE);

        if (this.viewport) {
            this.viewport.update();
        }
        if (this.controls) {
            this.controls.update();
        }
        this.updateScene();
    }

    toFrontView() {
        if (this.controls) {
            this.controls.reset();
        }

        this.camera.up.set(0, 0, 1);
        this.camera.position.set(0, -CAMERA_DISTANCE, 0);

        if (this.viewport) {
            this.viewport.update();
        }
        if (this.controls) {
            this.controls.update();
        }
        this.updateScene();
    }

    toLeftSideView() {
        if (this.controls) {
            this.controls.reset();
        }

        this.camera.up.set(0, 0, 1);
        this.camera.position.set(CAMERA_DISTANCE, 0, 0);

        if (this.viewport) {
            this.viewport.update();
        }
        if (this.controls) {
            this.controls.update();
        }
    }

    toRightSideView() {
        if (this.controls) {
            this.controls.reset();
        }

        this.camera.up.set(0, 0, 1);
        this.camera.position.set(-CAMERA_DISTANCE, 0, 0);

        if (this.viewport) {
            this.viewport.update();
        }
        if (this.controls) {
            this.controls.update();
        }
        this.updateScene();
    }

    zoomFit() {
        if (this.viewport) {
            this.viewport.update();
        }
        this.updateScene();
    }

    zoomIn(delta = 0.1) {
        const { noZoom } = this.controls;
        if (noZoom) {
            return;
        }

        this.controls.zoomIn(delta);
        this.controls.update();

        // Update the scene
        this.updateScene();
    }

    zoomOut(delta = 0.1) {
        const { noZoom } = this.controls;
        if (noZoom) {
            return;
        }

        this.controls.zoomOut(delta);
        this.controls.update();

        // Update the scene
        this.updateScene();
    }

    // deltaX and deltaY are in pixels; right and down are positive
    pan(deltaX, deltaY) {
        const eye = new THREE.Vector3();
        const pan = new THREE.Vector3();
        const objectUp = new THREE.Vector3();

        eye.subVectors(this.controls.object.position, this.controls.target);
        objectUp.copy(this.controls.object.up);

        pan.copy(eye).cross(objectUp.clone()).setLength(deltaX);
        pan.add(objectUp.clone().setLength(deltaY));

        this.controls.object.position.add(pan);
        this.controls.target.add(pan);
        this.controls.update();
    }

    // http://stackoverflow.com/questions/18581225/orbitcontrol-or-trackballcontrol
    panUp() {
        const { noPan, panSpeed } = this.controls;
        !noPan && this.pan(0, 1 * panSpeed);
    }

    panDown() {
        const { noPan, panSpeed } = this.controls;
        !noPan && this.pan(0, -1 * panSpeed);
    }

    panLeft() {
        const { noPan, panSpeed } = this.controls;
        !noPan && this.pan(1 * panSpeed, 0);
    }

    panRight() {
        const { noPan, panSpeed } = this.controls;
        !noPan && this.pan(-1 * panSpeed, 0);
    }

    render() {
        if (!WebGL.isWebGLAvailable()) {
            return null;
        }

        return <VizBox ref={this.node} show={this.props.show} />;
    }
}

export default Visualizer;
