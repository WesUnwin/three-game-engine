import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import Game from './Game';
import GameObject from './GameObject';
import * as PhysicsHelpers from './physics/PhysicsHelpers';
import { GameObjectJSON, SceneJSON } from './types';

class Scene {
    name: string;
    threeJSScene: THREE.Scene;
    gameObjects: GameObject[];
    game: Game | null;
    jsonAssetPath: string; // (optional) assetPath to the a .json file containing scene json
    sceneJSON: SceneJSON;
    initialGravity: { x: number, y: number, z: number };
    rapierWorld: RAPIER.World;
    gameObjectClasses: Object;
    gameObjectTypes: Object;

    constructor(jsonAssetPath?: string) {
        this.jsonAssetPath = jsonAssetPath;

        this.name = 'unnamed-scene';

        this.gameObjects = [];
        this.threeJSScene = null;
        this.gameObjectClasses = {};

        this.gameObjectTypes = {};
    }

    registerGameObjectClasses(types: Object) {
        for (const type in types) {
            this.gameObjectClasses[type] = types[type];
        }
    }

    getGameObjectClass(type) {
        const klass = this.gameObjectClasses[type];
        if (klass) {
            return klass;
        } else {
            return this.game.getGameObjectClass(type);
        }
    }

    async load(game) {
        this.game = game;

        if (this.jsonAssetPath) {
            const jsonAsset = await this.game.loadAsset(this.jsonAssetPath);
            this.sceneJSON = jsonAsset.data;

            if (this.sceneJSON?.gameObjectTypes) {
                for (const gameObjectType in this.sceneJSON.gameObjectTypes) {
                    const assetPath = this.sceneJSON.gameObjectTypes[gameObjectType];
                    const gameObjectTypeJSON = await this.game.loadAsset(assetPath);
                    this.gameObjectTypes[gameObjectType] = gameObjectTypeJSON.data;
                }
            }
        }

        this.threeJSScene = new THREE.Scene();
        this.threeJSScene.name = this.name;
        this.threeJSScene.background = this.sceneJSON?.background || new THREE.Color('lightblue');

        await PhysicsHelpers.initRAPIER();

        this.initialGravity = {
            x: this.sceneJSON?.gravity?.x || 0,
            y: this.sceneJSON?.gravity?.y || -9.8,
            z: this.sceneJSON?.gravity?.z || 0,
        };
        this.rapierWorld = PhysicsHelpers.createRapierWorld(this.initialGravity);

        this.gameObjects = [];
        (this.sceneJSON?.gameObjects || []).forEach(g => this._createGameObject(this, g));

        for(let i = 0; i<this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];
            await gameObject.load()
        }
    }

    _createGameObject(parent: Scene | GameObject, gameObjectJSON: GameObjectJSON) {
        const options = { ...gameObjectJSON };
        delete options.children;

        let gameObject = null;

        let GameObjectClass = GameObject;
        if (gameObjectJSON.type) {
            const type = gameObjectJSON.type;

            const gameObjectTypeJSON = this.gameObjectTypes[type];
            if (!gameObjectTypeJSON) {
                throw new Error(`Scene: error creating game object: unknown game object type: ${type}. You must define this type in the scene JSON .gameObjectTypes field`);
            }

            // Merge the base set of options defined in the the game object type json, with any options for this individual object
            // from the scene JSON.
            const allOptions = Object.assign({}, gameObjectTypeJSON, options);

            const RegisteredGameObjectClass = this.gameObjectClasses[type];
            if (RegisteredGameObjectClass) {
                // @ts-ignore
                gameObject = new RegisteredGameObjectClass(parent, allOptions);
            } else {
                gameObject = new GameObject(parent, allOptions);
            }
        } else {
            gameObject = new GameObject(parent, options);
        }

        if (!GameObjectClass) {
            throw new Error(`Error: no GameObject sub-class registered for game object type: ${gameObjectJSON.type}`);
        }

        if (!(gameObject instanceof GameObject)) {
            throw new Error(`Error: GameObject class must be a sub-class of GameObject. Invalid class registered for type ${gameObjectJSON.type}`);
        }

        parent.addGameObject(gameObject);
        this.threeJSScene.add(gameObject.threeJSGroup);
        (gameObjectJSON.children || []).forEach(childData => {
            this._createGameObject(gameObject, childData);
        });
    }

    advancePhysics() {
        this.rapierWorld.step();
        this.forEachGameObject(gameObject => {
            gameObject.afterPhysicsUpdate();
        });
    }

    isActive(): boolean {
        return Boolean(this.game);
    }

    addGameObject(gameObject) {
        if (!this.game) {
            throw new Error('Scene: cannot add additional GameObjects until scene is loaded, initial game objects should be created by passing sceneJSON into the Scene constructor.');
        }
        if (!this.gameObjects.some(g => g === gameObject)) {
            gameObject.parent = this;
            this.gameObjects.push(gameObject);
            this.threeJSScene.add(gameObject.threeJSGroup);

            if (this.isActive()) {
                gameObject.load().then(() => gameObject.afterLoaded()); // asynchronous
            }
        }
    }

    removeGameObject(gameObject) {
        if (this.gameObjects.some(g => g === gameObject)) {
            // gameObject is indeed a child of this scene
            this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
            gameObject.parent = null;
            this.threeJSScene.remove(gameObject.threeJSGroup);
        }
    }

    getRootGameObjects() {
        return this.gameObjects;
    }

    forEachGameObject(fn) {
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            fn(obj);
            obj.gameObjects.forEach(child => {
                child.forEachGameObject(fn);
            });
        }
    }

    find(fn) {
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                return obj;
            }
            const child = obj.find(fn);
            if (child) {
                return child;
            }
        }
        return null;
    }

    findAll(fn) {
        let results = [];
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                results.push(obj);
            }
            const childResults = obj.findAll(fn);
            results = results.concat(childResults);
        }
        return results;
    }

    findByName(name) {
        return this.find(g => g.name === name);
    }

    findAllByTag(tag) {
        return this.findAll(g => g.hasTag(tag));
    }

    afterLoaded() {
        // Optional: override and handle this event
    }

    beforeRender({ deltaTimeInSec }) {
        // Optional: override and handle this event
    }

    // Called on the scene and all its GameObjects just before
    // a new scene is loaded. Use this to do teardown operations.
    beforeUnloaded() {
        // Optional: override and handle this event   
    }

    showPhysics() {
        if (!this.game) {
            throw new Error('showPhysics() must be called after the scene is loaded');
        }

        let physicsRenderingLines = this.threeJSScene.getObjectByName('PhysicsRenderingLines');
        if (!physicsRenderingLines) {
            let material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                vertexColors: true
            });

            let geometry =  new THREE.BufferGeometry();

            physicsRenderingLines = new THREE.LineSegments(geometry, material);
            physicsRenderingLines.name = 'PhysicsRenderingLines';

            this.threeJSScene.add(physicsRenderingLines);
        }
    }

    hidePhysics() {
        const physicsRenderingLines = this.threeJSScene.getObjectByName('PhysicsRenderingLines');
        if (physicsRenderingLines) {
            this.threeJSScene.remove(physicsRenderingLines);
        }
    }

    updatePhysicsGraphics() {
        const physicsRenderingLines = this.threeJSScene.getObjectByName('PhysicsRenderingLines');
        if (physicsRenderingLines) {
            const buffers = this.rapierWorld.debugRender();
            physicsRenderingLines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3));
            physicsRenderingLines.geometry.setAttribute('color', new THREE.BufferAttribute(buffers.colors, 4));
        }
    }
}

export default Scene