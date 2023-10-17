import * as THREE from 'three';
import GameObject from './GameObject';

class Scene {
    constructor(sceneData = {}) {
        this.name = sceneData.name || 'unnamed-scene';
        this.threeJSScene = new THREE.Scene();
        this.threeJSScene.name = this.name;
        this.threeJSScene.background = sceneData.background || new THREE.Color('lightblue');

        this.gameObjects = [];
        (sceneData.gameObjects || []).forEach(g => this._createGameObject(this, g));
    }

    _createGameObject(parent, gameObjectData) {
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
        for(let i = 0; i<this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];
            await gameObject.load()
        }
    }

    addGameObject(gameObject) {
        if (!this.gameObjects.some(g => g === gameObject)) {
            gameObject.parent = this;
            this.gameObjects.push(gameObject);
            this.threeJSScene.add(gameObject.threeJSGroup);
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

    afterLoaded(args) {
        // Optional: override and handle this event
    }

    beforeRender(args) {
        // Optional: override and handle this event
    }

    // Called on the scene and all its GameObjects just before
    // a new scene is loaded. Use this to do teardown operations.
    beforeUnloaded(args) {
        // Optional: override and handle this event   
    }
}

export default Scene