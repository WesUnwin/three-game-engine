import * as THREE from 'three';

class Scene {
    constructor() {
        this.threeJSScene = new THREE.Scene();
        this.threeJSScene.background = new THREE.Color('lightblue');
    }
}

export default Scene