import Three from 'three'

class Scene {
    constructor() {
        this.threeJSScene = new Three.Scene();
        this.threeJSScene.background = new Three.Color('lightblue');
    }
}

export default Scene