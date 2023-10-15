import Renderer from './Renderer';
import AssetStore from './assets/AssetStore';

class Game {
    constructor(options = {}) {
        this.options = options;
        this.renderer = null;
        this.scene = null;
        this.renderer = new Renderer(this, this.options.rendererOptions);
    }

    async loadScene(scene) {
        console.debug(`Game: loading scene: ${scene.name}`);
        if (!this.assetStore || !this.options.assetOptions?.retainAssetsBetweenScenes) {
            console.debug('Game: creating a new, empty AssetStore...');
            this.assetStore = new AssetStore(this.options.assetOptions);
            await this.assetStore.init();
        }

        console.debug(`Game: loading initial assets for scene: ${scene.name}`);
        const initialAssetList = scene.getInitialAssetList();
        for (let i = 0; i<initialAssetList.length; i++) {
            await this.assetStore.load(initialAssetList[i])
        }

        this.scene = scene;
        this.scene.onLoaded(game);

        console.debug(`Game: successfully loaded scene: ${scene.name}`);
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