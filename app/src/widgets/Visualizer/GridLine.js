import * as THREE from 'three';

class GridLine {
    group = new THREE.Object3D();

    colorMajor = new THREE.Color(0x444444);

    colorMinor = new THREE.Color(0x888888);

    constructor(isImperial, axes) {
        const colorMajor = this.colorMajor;
        const colorMinor = this.colorMinor;

        axes.x.eachGridLine((xPos, isMajor) => {
            const geometry = new THREE.Geometry();
            const material = new THREE.LineBasicMaterial({
                vertexColors: THREE.VertexColors
            });
            material.opacity = isMajor ? 0.5 : 0.15;
            const colorGrid = isMajor ? colorMajor : colorMinor;

            geometry.vertices.push(
                new THREE.Vector3(xPos, axes.y.min, 0),
                new THREE.Vector3(xPos, axes.y.max, 0),
            );
            geometry.colors.push(colorGrid, colorGrid);

            this.group.add(new THREE.Line(geometry, material));
        }, isImperial);

        axes.y.eachGridLine((yPos, isMajor) => {
            const geometry = new THREE.Geometry();
            const material = new THREE.LineBasicMaterial({
                vertexColors: THREE.VertexColors
            });
            material.opacity = isMajor ? 0.5 : 0.15;
            const colorGrid = isMajor ? colorMajor : colorMinor;

            geometry.vertices.push(
                new THREE.Vector3(axes.x.min, yPos, 0),
                new THREE.Vector3(axes.x.max, yPos, 0),
            );
            geometry.colors.push(colorGrid, colorGrid);

            this.group.add(new THREE.Line(geometry, material));
        }, isImperial);

        return this.group;
    }
}

export default GridLine;
