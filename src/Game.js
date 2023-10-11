import Renderer from './Renderer';

class Game {
    constructor(options = {}) {
        this.options = options;
        this.renderer = null;
        this.scene = null;
        this.renderer = new Renderer(this, this.options.rendererOptions);
    }

    async loadScene(scene) {
        // TODO tell the scene to load all its resources, and await on it
        this.scene = scene;
    }

    play() {
        if (!this.scene) {
            throw new Error('Game: you must call loadScene() before calling play()')
        }
        return this.renderer.play();
    }

    pause() {
        return this.renderer.pause();
    }
}

export default Game