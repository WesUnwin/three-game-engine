import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import Game from './Game';
import GameObject from './GameObject';
import * as PhysicsHelpers from './physics/PhysicsHelpers';
import { SceneData } from './types';

class Scene {
    name: string;
    threeJSScene: THREE.Scene;
    gameObjects: GameObject[];
    game: Game | null;
    sceneData: SceneData;
    initialGravity: { x: number, y: number, z: number };
    rapierWorld: RAPIER.World;

    constructor(sceneData: SceneData = {}) {
        this.name = sceneData.name || 'unnamed-scene';
        this.sceneData = sceneData;
        this.reset();
    }

    // Resets the state of the scene to what it was when it was constructed,
    // this will wipe out all GameObjects and re-create them based on the initial SceneData.
    reset() {
        this.threeJSScene = new THREE.Scene();
        this.threeJSScene.name = this.name;
        this.threeJSScene.background = this.sceneData.background || new THREE.Color('lightblue');

        this.initialGravity = {
            x: this.sceneData.gravity?.x || 0,
            y: this.sceneData.gravity?.y || -9.8,
            z: this.sceneData.gravity?.z || 0,
        };

        this.gameObjects = [];
        (this.sceneData.gameObjects || []).forEach(g => this._createGameObject(this, g));
    }

    _createGameObject(parent: Scene | GameObject, gameObjectData) {
        const options = { ...gameObjectData };
        delete options.children;
        const GameObjectClass = gameObjectData.klass || GameObject;
        const gameObject = new GameObjectClass(parent, options);
        parent.addGameObject(gameObject);
        this.threeJSScene.add(gameObject.threeJSGroup);
        (gameObjectData.gameObjects || []).forEach(childData => {
            this._createGameObject(gameObject, childData);
        });
    }

    async load(game) {
        this.game = game;

        await PhysicsHelpers.initRAPIER();

        this.rapierWorld = PhysicsHelpers.createRapierWorld(this.initialGravity);

        for(let i = 0; i<this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];
            await gameObject.load()
        }
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
        if (!this.gameObjects.some(g => g === gameObject)) {
            gameObject.parent = this;
            this.gameObjects.push(gameObject);
            this.threeJSScene.add(gameObject.threeJSGroup);

            if (this.isActive()) {
                gameObject.load(); // asynchronous
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