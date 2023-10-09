import Renderer from './Renderer';

class Game {
    constructor(options) {
        this.options = options;
        this.renderer = null;
        this.scene = null;
        this.initialized = false;
    }

    _initialize() {
        this.renderer = new Renderer(this, this.options.rendererOptions);

        if (this.options.enableVR) {
            this._initVR();
        }

        this.initialized = true;
    }

    async loadScene(scene) {
        if (!this.initialized) {
            this._initialize();
        }
        this.scene = scene;
    }

    async play() {
        if (!this.scene) {
            throw new Error('Game: you must call loadScene() before calling play()')
        }
        return this.renderer.play();
    }

    async pause() {
        return this.renderer.pause();
    }
}

export default Game