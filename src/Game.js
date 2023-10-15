import Renderer from './Renderer';
import AssetStore from './assets/AssetStore';

class Game {
    constructor(options = {}) {
        this.options = options;
        this.renderer = null;
        this.scene = null;
        this.renderer = new Renderer(this, this.options.rendererOptions);
    }

    async getAssetStore() {
        if (!this.assetStore) {
            console.debug('Game: creating a new, empty AssetStore...');
            this.assetStore = new AssetStore(this.options.assetOptions);
            await this.assetStore.init();
        }
        return this.assetStore;
    }

    async loadScene(scene) {
        console.debug(`Game: loading scene: ${scene.name}`);
        const assetStore = await this.getAssetStore();

        if (!this.options.assetOptions?.retainAssetsBetweenScene) {
            console.debug(`Game: clearing all assets as options.assetOptions.retainAssetsBetweenScene was not set`);
            assetStore.unloadAll();
        }

        this.scene = scene;
        await this.scene.load(this);

        console.debug(`Game: successfully loaded scene: ${scene.name}`);
    }

    async loadAsset(assetPath) {
        const assetStore = await this.getAssetStore();
        await assetStore.load(assetPath);
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