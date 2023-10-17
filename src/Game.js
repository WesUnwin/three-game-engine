import Renderer from './Renderer';
import AssetStore from './assets/AssetStore';

class Game {
    constructor(options = {}) {
        this.options = options;
        this.renderer = null;
        this.scene = null;
        this.renderer = new Renderer(this, this.options.rendererOptions);
    }

    getAssetStore() {
        if (!this.assetStore) {
            console.debug('Game: creating a new, empty AssetStore...');
            this.assetStore = new AssetStore(this.options.assetOptions);
        }
        return this.assetStore;
    }

    async loadScene(scene) {
        console.debug(`Game: loading scene: ${scene.name}`);

        if (this.scene) {
            console.debug(`Game: unloading scene: ${scene.name}`);
            this.scene.beforeUnloaded();
            this.scene.forEachGameObject(gameObject => {
                gameObject.beforeUnloaded();
            });
        }

        const assetStore = this.getAssetStore();

        if (!this.options.assetOptions?.retainAssetsBetweenScene) {
            console.debug(`Game: clearing all assets as options.assetOptions.retainAssetsBetweenScene was not set`);
            assetStore.unloadAll();
        }

        this.scene = scene;
        await this.scene.load(this);

        console.debug(`Game: successfully loaded scene: ${scene.name}`);

        // Invoke afterLoaded() callback on scene and all its children,
        // AFTER the scene and all its game objects are loaded.
        this.scene.afterLoaded();
        this.scene.forEachGameObject(gameObject => {
            gameObject.afterLoaded();
        });
    }

    async loadAsset(assetPath) {
        const assetStore = this.getAssetStore();
        return await assetStore.load(assetPath);
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