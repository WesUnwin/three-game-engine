import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import Game from './Game';
import GameObject from './GameObject';
import * as PhysicsHelpers from './physics/PhysicsHelpers';
import { FogJSON, GameObjectJSON, LightData, SceneSoundJSON } from './types';
import JSONAsset from './assets/JSONAsset';
import { createAudio, createLight } from './util/ThreeJSHelpers';
import SoundAsset from './assets/SoundAsset';

class Scene {
    name: string;
    threeJSScene: THREE.Scene;
    gameObjects: GameObject[];
    game: Game;
    active: boolean;
    jsonAssetPath: string; // (optional) assetPath to the a .json file containing scene json
    sceneJSONAsset: null | JSONAsset;
    initialGravity: { x: number, y: number, z: number };
    rapierWorld: RAPIER.World;
    lights: LightData[];

    constructor(game, jsonAssetPath?: string) {
        this.game = game;
        this.jsonAssetPath = jsonAssetPath;

        this.sceneJSONAsset = null;

        this.name = 'unnamed-scene';

        this.lights = [];
        this.gameObjects = [];
        this.threeJSScene = null;

        this.active = false;
    }

    getGameObjectClass(type) {
        return this.game.getGameObjectClass(type);
    }

    async load() {
        if (this.jsonAssetPath) {
            this.sceneJSONAsset = await this.game.loadAsset(this.jsonAssetPath);
        }

        this.threeJSScene = new THREE.Scene();
        this.threeJSScene.name = this.name;
        this.threeJSScene.background = this.sceneJSONAsset?.data?.background || new THREE.Color('lightblue');

        this.setFog(this.sceneJSONAsset?.data?.fog || null);

        this.setLights(this.sceneJSONAsset?.data?.lights || []);

        await this.loadSounds(this.sceneJSONAsset?.data?.sounds || []);

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

    setFog(fog: FogJSON | THREE.Fog) {
        if (!this.threeJSScene) {
            throw new Error('Cant set/change fog, this scene has not finished loading, thus no .threeJSScene exists yet');
        }

        if (fog instanceof THREE.Fog) {
            this.threeJSScene.fog = fog;
        } else if (typeof fog === 'object') {
            const fogDefaults = {
                color: '#00000',
                near: 1.0,
                far: 1000.0
            };
            const fogSettings = Object.assign({}, fogDefaults, fog);
            this.threeJSScene.fog = new THREE.Fog(fogSettings.color, fogSettings.near, fogSettings.far);
        } else if (fog === null) {
            this.threeJSScene.fog = null;
        } else {
            throw new Error(`scene.setFog(): invalid value ${fog}`);
        }
    }

    setLights(lights: LightData[]) {
        const existingLights = this.threeJSScene.children.filter(child => child instanceof THREE.Light);
        existingLights.forEach(existingLight => this.threeJSScene.remove(existingLight));

        lights.forEach((lightData: LightData) => {
            const light = createLight(lightData);
            this.threeJSScene.add(light);
        });
    }

    async loadSounds(sounds: SceneSoundJSON[]) {
        const existingSounds = this.threeJSScene.children.filter(child => child instanceof THREE.Audio);
        existingSounds.forEach(sound => this.threeJSScene.remove(sound));

        for (let i = 0; i < sounds.length; i++) {
            const soundData = sounds[i];
            const asset = await this.game.loadAsset(soundData.assetPath);
            if (!(asset instanceof SoundAsset)) {
                throw new Error(`Scene: asset found at ${soundData.assetPath} in AssetStore should be a SoundAsset`);
            }
            const audioBuffer = asset.getData() as AudioBuffer;
            const audioListener = this.game.renderer.getCameraAudioListener();
            const name = soundData.name || `sound_${i}`;
            const audio = createAudio(soundData, audioBuffer, audioListener, name);
            this.threeJSScene.add(audio);
        }
    }

    playSound(soundName: string, delayInSec: number = 0, detune: number | null = null) {
        const audio = this.threeJSScene.children.find(c => c.name === soundName && c instanceof THREE.Audio);
        if (audio) {
            if (audio.isPlaying) {
                audio.pause(); // elsewise nothing will happen
            }
            audio.play(delayInSec);
            if (detune !== null) {
                audio.setDetune(detune); // set this here, rather than when creating the audio as setDetune can't be called till playback (where audio.source is set)
            }
        } else {
            throw new Error(`scene.playSound(): scene: ${this.name} has no sound with name: ${soundName}`);
        }
    }

    _createGameObject(parent: Scene | GameObject, gameObjectJSON: GameObjectJSON, indices: number[]) {
        const options = { ...gameObjectJSON };
        delete options.children;

        options.userData = {
            indices
        };

        let gameObject = null;

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
    }

    isActive(): boolean {
        return this.active;
    }

    addGameObject(gameObject) {
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

    getRapierWorld() {
        return this.rapierWorld;
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

    getGameObject(fn) {
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                return obj;
            }
            const child = obj.getGameObject(fn);
            if (child) {
                return child;
            }
        }
        return null;
    }

    getGameObjects(fn) {
        let results = [];
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                results.push(obj);
            }
            const childResults = obj.getGameObjects(fn);
            results = results.concat(childResults);
        }
        return results;
    }

    getGameObjectWithName(name) {
        return this.getGameObject(g => g.name === name);
    }

    getGameObjectsWithTag(tag) {
        return this.getGameObjects(g => g.hasTag(tag));
    }

    getGameObjectWithID(id) {
        return this.getGameObject(g => g.id === id);
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

    getGameObjectWithThreeJSObject(object3D) {
        if (object3D instanceof THREE.Group) {
            const { gameObjectID } = object3D.userData;
            if (gameObjectID) {
                return this.getGameObjectWithID(gameObjectID);
            } else {
                return this.getGameObjectWithThreeJSObject(object3D.parent);
            }
        } else if (object3D.parent) {
            return this.getGameObjectWithThreeJSObject(object3D.parent);
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
        const physicsRenderingLines = this.threeJSScene?.getObjectByName('PhysicsRenderingLines');
        if (physicsRenderingLines) {
            const buffers = this.rapierWorld.debugRender();
            physicsRenderingLines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3));
            physicsRenderingLines.geometry.setAttribute('color', new THREE.BufferAttribute(buffers.colors, 4));
        }
    }
}

export default Scene