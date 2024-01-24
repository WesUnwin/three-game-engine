import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import Game from './Game';
import GameObject from './GameObject';
import * as PhysicsHelpers from './physics/PhysicsHelpers';
import { GameObjectJSON } from './types';
import JSONAsset from './assets/JSONAsset';

class Scene {
    name: string;
    threeJSScene: THREE.Scene;
    gameObjects: GameObject[];
    game: Game | null;
    active: boolean;
    jsonAssetPath: string; // (optional) assetPath to the a .json file containing scene json
    sceneJSONAsset: null | JSONAsset;
    initialGravity: { x: number, y: number, z: number };
    rapierWorld: RAPIER.World;

    constructor(jsonAssetPath?: string) {
        this.jsonAssetPath = jsonAssetPath;
        this.sceneJSONAsset = null;

        this.name = 'unnamed-scene';

        this.gameObjects = [];
        this.threeJSScene = null;

        this.active = false;
    }

    getGameObjectClass(type) {
        return this.game.getGameObjectClass(type);
    }

    async load(game) {
        this.game = game;

        if (this.jsonAssetPath) {
            this.sceneJSONAsset = await this.game.loadAsset(this.jsonAssetPath);
        }

        this.threeJSScene = new THREE.Scene();
        this.threeJSScene.name = this.name;
        this.threeJSScene.background = this.sceneJSONAsset?.data?.background || new THREE.Color('lightblue');

        await PhysicsHelpers.initRAPIER();

        this.initialGravity = {
            x: this.sceneJSONAsset?.data?.gravity?.x || 0,
            y: this.sceneJSONAsset?.data?.gravity?.y || -9.8,
            z: this.sceneJSONAsset?.data?.gravity?.z || 0,
        };
        this.rapierWorld = PhysicsHelpers.createRapierWorld(this.initialGravity);

        this.gameObjects = [];
        (this.sceneJSONAsset?.data?.gameObjects || []).forEach((g, index) => this._createGameObject(this, g, [index]));

        for(let i = 0; i<this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];
            await gameObject.load()
        }
    }

    _createGameObject(parent: Scene | GameObject, gameObjectJSON: GameObjectJSON, indices: number[]) {
        const options = { ...gameObjectJSON };
        delete options.children;

        options.userData = {
            indices
        };

        let gameObject = null;

        let GameObjectClass = GameObject;
        if (gameObjectJSON.type) {
            const type = gameObjectJSON.type;

            if (!this.game.getGameObjectTypeJSON(type)) {
                throw new Error(`Scene: error creating game object: unknown game object type: ${type}. You must define this type in your game.json file`);
            }

            const RegisteredGameObjectClass = this.getGameObjectClass(type);
            if (RegisteredGameObjectClass) {
                // @ts-ignore
                gameObject = new RegisteredGameObjectClass(parent, options);
            } else {
                gameObject = new GameObject(parent, options);
            }
        } else {
            gameObject = new GameObject(parent, options);
        }

        if (!(gameObject instanceof GameObject)) {
            throw new Error(`Error: GameObject class must be a sub-class of GameObject. Invalid class registered for type ${gameObjectJSON.type}`);
        }

        parent.addGameObject(gameObject);

        this.threeJSScene.add(gameObject.threeJSGroup);
        (gameObjectJSON.children || []).forEach((childData, index) => {
            this._createGameObject(gameObject, childData, indices.concat(index));
        });
    }

    advancePhysics() {
        this.rapierWorld.step();
        this.forEachGameObject(gameObject => {
            gameObject.afterPhysicsUpdate();
        });
    }

    isActive(): boolean {
        return Boolean(this.game) && this.active;
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

    getGameObjectByID(id) {
        return this.find(g => g.id === id);
    }

    getGameObjectIndices(gameObject: GameObject) {
        return this._getGameObjectIndices(gameObject, this, []);
    }

    _getGameObjectIndices(gameObject: GameObject, parent: Scene | GameObject, indices: number[]) {
        const currentIndices = [...indices];
        currentIndices.push(0);
        for (let i = 0; i < parent.gameObjects.length; i++) {
            currentIndices[currentIndices.length - 1] = i;
            const currentGameObject = parent.gameObjects[i];
            if (currentGameObject === gameObject) {
                return currentIndices;
            }

            // Now check all the children of this game object (recursively)
            const result = this._getGameObjectIndices(gameObject, currentGameObject, currentIndices);
            if (result) {
                return result;
            }
        }
        return null;
    }

    getGameObjectByIndices(indices: number[]) {
        let parent: Scene | GameObject = this;
        for (let i = 0; i<indices.length; i++) {
            const index = indices[i];
            if (i == indices.length - 1) {
                return parent.gameObjects[index];
            } else {
                parent = parent.gameObjects[index];
            }
            if (!parent) {
                return null;
            }
        }
    }

    getGameObjectByThreeJSObject(object3D) {
        if (object3D instanceof THREE.Group) {
            const { gameObjectID } = object3D.userData;
            if (gameObjectID) {
                return this.getGameObjectByID(gameObjectID);
            } else {
                return this.getGameObjectByThreeJSObject(object3D.parent);
            }
        } else if (object3D.parent) {
            return this.getGameObjectByThreeJSObject(object3D.parent);
        } else {
            return null;
        }
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

    showGrid(size: number = 100, divisions: number = 100, colorCenterLine: THREE.Color = new THREE.Color(0x444444), colorGrid: THREE.Color = new THREE.Color(0x888888)) {
        this.hideGrid();
        const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
        gridHelper.name = 'GridHelper';
        this.threeJSScene.add(gridHelper);
    }

    hideGrid() {
        const gridHelper = this.threeJSScene.getObjectByName('GridHelper');
        if (gridHelper) {
            this.threeJSScene.remove(gridHelper);
        }
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