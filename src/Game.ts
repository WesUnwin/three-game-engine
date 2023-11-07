import Renderer from './Renderer';
import Scene from './Scene';
import AssetStore from './assets/AssetStore';
import InputManager from './input/InputManager';
import { GameOptions } from './types';

class Game {
    options: GameOptions;
    renderer: Renderer;
    scene: Scene | null;
    assetStore: AssetStore | null;
    inputManager: InputManager;
    gameObjectClasses: Object;

    constructor(options: GameOptions = {}) {
        this.options = options;
        this.scene = null;
        this.renderer = new Renderer(this, this.options.rendererOptions);
        this.inputManager = new InputManager(this.renderer.getCanvas(), this.options.inputOptions);
        this.gameObjectClasses = {}; // key-values map game object types to GameObject sub-classes
    }

    registerGameObjectClasses(types: Object) {
        for (const type in types) {
            this.gameObjectClasses[type] = types[type];
        }
    }

    getGameObjectClass(type) {
        const klass = this.gameObjectClasses[type];
        return klass || null;
    }

    getAssetStore(): AssetStore {
        if (!this.assetStore) {
            console.debug('Game: creating a new, empty AssetStore...');
            this.assetStore = new AssetStore(this.options.assetOptions);
        }
        return this.assetStore;
    }

    async loadScene(scene: Scene) {
        console.debug(`Game: loading scene: ${scene.name}`);

        if (this.scene) {
            console.debug(`Game: unloading scene: ${scene.name}`);
            this.scene.beforeUnloaded();
            this.scene.forEachGameObject(gameObject => {
                gameObject.beforeUnloaded();
            });
            this.scene.game = null; // Signals that the scene is no longer active
            this.scene = null;
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

    async loadAsset(assetPath: string) {
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