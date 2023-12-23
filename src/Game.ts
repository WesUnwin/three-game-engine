import Renderer from './Renderer';
import Scene from './Scene';
import AssetStore from './assets/AssetStore';
import InputManager from './input/InputManager';
import { GameJSON, GameOptions } from './types';

class Game {
    gameOptions: GameOptions;

    initialized: boolean;

    baseURL: null | string;
    dirHandle: null | FileSystemDirectoryHandle;

    gameJSON: null | GameJSON;
    renderer: Renderer;
    scene: Scene | null;
    assetStore: AssetStore | null;
    inputManager: InputManager;
    gameObjectTypes: Object;
    gameObjectClasses: Object;

    loadingScene: boolean;

    constructor(baseURLorDirHandle: string | FileSystemDirectoryHandle, gameOptions?: GameOptions) {
        this.initialized = false;
        this.gameJSON = null;

        this.gameOptions = gameOptions || {};

        if ((typeof baseURLorDirHandle !== 'string') && !(baseURLorDirHandle instanceof FileSystemDirectoryHandle)) {
            throw new Error('Game: first argument to Game constructor must be either a string or a FileSystemDirectoryHandle');
        }

        if (typeof baseURLorDirHandle === 'string') {
            this.baseURL = baseURLorDirHandle;
            if (this.baseURL.endsWith('/')) {
                this.baseURL = this.baseURL.slice(0, this.baseURL.length - 1);
            }
            this.dirHandle = null;
        } else {
            this.baseURL = null;
            this.dirHandle = baseURLorDirHandle;
        }

        this.loadingScene = false;
        this.scene = null;
        this.gameObjectTypes = {}; // keys a strings, each value is the JSON for the given GameObject type
        this.gameObjectClasses = {}; // key-values map game object types to GameObject sub-classes
    }

    _init = async () => {
        if (this.initialized) {
            throw new Error('Game already initialized');
        }
        console.log('Game: reading game.json file to initialize game...');

        this.assetStore = new AssetStore(this.baseURL || this.dirHandle);

        const gameJSONAsset = await this.assetStore.load('game.json');
        this.gameJSON = gameJSONAsset.data;

        // Read all GameObject type JSON files referenced by the game.json file
        const gameObjectTypes = this.gameJSON.gameObjectTypes || [];
        for (const gameObjectType in gameObjectTypes) {
            const gameObjectTypeAsset = await this.assetStore.load(gameObjectTypes[gameObjectType]);
            this.gameObjectTypes[gameObjectType] = gameObjectTypeAsset.data;
        }

        this.renderer = new Renderer(this, this.gameOptions.rendererOptions);
        this.inputManager = new InputManager(this.renderer.getCanvas(), this.gameOptions.inputOptions);

        this.initialized = true;
    };

    registerGameObjectClasses(types: Object) {
        for (const type in types) {
            this.gameObjectClasses[type] = types[type];
        }
    }

    getGameObjectTypeJSON(type: string) {
        return this.gameObjectTypes[type];
    }

    getGameObjectClass(type: string) {
        const klass = this.gameObjectClasses[type];
        return klass || null;
    }

    async loadScene(sceneName: string) {
        if (this.loadingScene) {
            throw new Error('loadScene(): error: game is currently working on loading a scene, you can only perform one loadScene() operation at a time');
        }
        this.loadingScene = true;

        if (typeof sceneName !== 'string') {
            throw new Error('loadScene(): sceneName must be a string, refering to a scene name defined in your game.json file');
        }

        if (!this.initialized) {
            await this._init();
        }

        console.debug(`Game: loading scene: ${sceneName}`);

        if (this.scene) {
            console.debug(`Game: unloading scene: ${sceneName}`);
            this.scene.beforeUnloaded();
            this.scene.forEachGameObject(gameObject => {
                gameObject.beforeUnloaded();
            });
            this.scene.game = null; // Signals that the scene is no longer active
            this.scene = null;
        }

        if (!this.gameOptions.assetOptions?.retainAssetsBetweenScene) {
            console.debug(`Game: clearing all assets as gameJSON.assetOptions.retainAssetsBetweenScene was not set`);
            this.assetStore.unloadAll();
        }

        const sceneJSONassetPath = this.gameJSON.scenes[sceneName];
        if (!sceneJSONassetPath) {
            throw new Error(`Game: no scene with name ${sceneName} defined in game.json`);
        }

        const scene = new Scene(sceneJSONassetPath)
        this.scene = scene;
        await this.scene.load(this);

        this.loadingScene = false;

        console.debug(`Game: successfully loaded scene: ${scene.name}`);

        // Invoke afterLoaded() callback on scene and all its children,
        // AFTER the scene and all its game objects are loaded.
        this.scene.afterLoaded();
        this.scene.forEachGameObject(gameObject => {
            gameObject.afterLoaded();
        });
    }

    async loadAsset(assetPath: string) {
        if (!this.initialized) {
            await this._init();
        }

        return await this.assetStore.load(assetPath);
    }

    async play() {
        if (!this.initialized) {
            await this._init();
        }
        if (!this.scene) {
            const sceneNames = Object.keys(this.gameJSON.scenes || {});
            if (!sceneNames.length) {
                throw new Error('game.json has no scenes');
            }
            const initialScene = this.gameJSON.initialScene || sceneNames[0];
            await this.loadScene(initialScene);
        }
        this.renderer.play();
    }

    pause() {
        if (this.renderer) {
            this.renderer.pause();
        }
    }
}

export default Game