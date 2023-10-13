import * as THREE from 'three';
import Scene from './Scene';

class GameObject {
    constructor(parent, options = {}) {
        if (!(parent instanceof Scene || parent instanceof GameObject)) {
            throw new Error('When creating a GameObject, the parent must be a Scene or another GameObject')
        }

        this.threeJSObject3D = options.threeJSObject3D || new THREE.Group();

        parent.addGameObject(this);
        this.parent = parent;

        this.name = options.name || '';
        this.tags = options.tags || [];

        // Make this GameObject's Object3D a child of the parent's Object3D/Scene
        if (this.parent instanceof Scene) {
            this.parent.threeJSScene.add(this.threeJSObject3D)
        } else {
            this.parent.threeJSObject3D.add(this.threeJSObject3D);
        }
        this.gameObjects = [];
    }

    getInitialAssetList() {
        return this.options.initialAssetList || [];
    }

    getInitialAssetListRecursively() {
        let initialAssets = this.getInitialAssetList();
        this.gameObjects.forEach(gameObject => {
            const objAssets = gameObject.getInitialAssetListRecursively();
            initialAssets = initialAssets.concat(objAssets);
        });
        return initialAssets;
    }

    hasTag(tag) {
        return this.tags.some(t => t === tag);
    }

    addGameObject(gameObject) {
        if (!this.gameObjects.some(g => g === gameObject)) {
            gameObject.parent = this;
            this.gameObjects.push(gameObject);
            this.threeJSObject3D.add(gameObject.threeJSObject3D);
        }
    }

    removeGameObject(gameObject) {
        if (this.gameObjects.some(g => g === gameObject)) {
            // gameObject is indeed a child of this GameObject
            this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
            gameObject.parent = null;
            this.threeJSObject3D.remove(gameObject.threeJSObject3D);
        }
    }

    getRootGameObjects() {
        return this.gameObjects;
    }

    find(fn) {
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                return obj
            }
            const child = obj.find(fn)
            if (child) {
                return child
            }
        }
        return null
    }

    findAll(fn) {
        let results = []
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                results.push(obj);
            }
            const childResults = obj.findAll(fn)
            results = results.concat(childResults)
        }
        return results
    }

    findByName(name) {
        return this.find(g => g.name === name);
    }

    findAllByTag(tag) {
        return this.findAll(g => g.hasTag(tag));
    }

    destroy() {
        if (this.parent) {
            this.parent.removeGameObject(this);
            this.parent = null;
        }
    }
}

export default GameObject