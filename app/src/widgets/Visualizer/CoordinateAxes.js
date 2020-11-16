import * as THREE from 'three';

const buildAxis = (src, dst, color, dashed) => {
    let geometry = new THREE.Geometry();
    let material;

    if (dashed) {
        material = new THREE.LineDashedMaterial({
            linewidth: 1,
            color: color,
            dashSize: 1,
            gapSize: 1,
            opacity: 0.8,
            transparent: true
        });
    } else {
        material = new THREE.LineBasicMaterial({
            linewidth: 1,
            color: color,
            opacity: 0.8,
            transparent: true
        });
    }

    geometry.vertices.push(src.clone());
    geometry.vertices.push(dst.clone());

    const axisLine = new THREE.Line(geometry, material);

    if (dashed) {
        // Computes an array of distance values which are necessary for LineDashedMaterial.
        axisLine.computeLineDistances();
    }

    return axisLine;
};

// CoordinateAxes
// An axis object to visualize the the 3 axes in a simple way.
// The X axis is red. The Y axis is green. The Z axis is blue.
class CoordinateAxes {
    group = new THREE.Object3D();

    // Creates an axisHelper with lines of length size.
    // @param {number} size Define the size of the line representing the axes.
    // @see [Drawing the Coordinate Axes]{@http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/}
    constructor(axes) {
        const xcol = axes.x.color;
        const ycol = axes.y.color;
        const zcol = axes.z.color;

        this.group.add(
            buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(axes.x.max, 0, 0), xcol, false), // +X
            buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(axes.x.min, 0, 0), xcol, true), // -X
            buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axes.y.max, 0), ycol, false), // +Y
            buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axes.y.min, 0), ycol, true), // -Y
            buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axes.z.max), zcol, false), // +Z
            buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axes.z.min), zcol, true) // -Z
        );

        return this.group;
    }
}

export default CoordinateAxes;
