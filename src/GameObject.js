import * as THREE from 'three';
import Scene from './Scene';

class GameObject {
    constructor(parent, options = {}) {
        if (!(parent instanceof Scene || parent instanceof GameObject)) {
            throw new Error('When creating a GameObject, the parent must be a Scene or another GameObject')
        }

        this.name = options.name || '';
        this.tags = options.tags || [];

        this.threeJSGroup = new THREE.Group();
        this.threeJSGroup.name = `gameObject-${this.name}`;

        parent.addGameObject(this);
        this.parent = parent;

        // Make this GameObject's threeJSGroup a child of the parent's threeJSGroup/threeJSScene
        if (this.parent instanceof Scene) {
            this.parent.threeJSScene.add(this.threeJSGroup)
        } else {
            this.parent.threeJSGroup.add(this.threeJSGroup);
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
            this.threeJSGroup.add(gameObject.threeJSGroup);
        }
    }

    removeGameObject(gameObject) {
        if (this.gameObjects.some(g => g === gameObject)) {
            // gameObject is indeed a child of this GameObject
            this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
            gameObject.parent = null;
            this.threeJSGroup.remove(gameObject.threeJSGroup);
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