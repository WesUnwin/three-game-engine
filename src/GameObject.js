import * as THREE from 'three';
import Scene from './Scene';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import GLTFAsset from './assets/GLTFAsset';

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

        if (options.model) {
            if (!(typeof options.model.assetPath === 'string')) {
                throw new Error('GameObject has a model, but no model.assetPath assigned, this is required to load the model data');
            }
            if (!options.model.assetPath.endsWith('.glb')) {
                throw new Error('GameObject model.assetPath must end with .glb');
            }
            this.modelAssetPath = options.model.assetPath;
        }

        const lights = options.lights || [];
        lights.forEach(lightData => {
            let light = null;
            const lightTypes = {
                PointLight: THREE.PointLight
            }
            const LightClass = lightTypes[lightData.type];
            if (LightClass) {
                light = new LightClass();
            } else {
                throw new Error(`GameObject unknown light type: ${lightData.type}`);
            }
            this.threeJSGroup.add(light);
            if (lightData.position) {
                light.position.set(lightData.position.x || 0, lightData.position.y || 0, lightData.position.z || 0);
            }
        });
    }

    getInitialAssetList() {
        const assetPaths = [];
        if (this.modelAssetPath) {
            assetPaths.push(this.modelAssetPath)
        }
        return assetPaths;
    }

    getInitialAssetListRecursively() {
        let initialAssets = this.getInitialAssetList();
        this.gameObjects.forEach(gameObject => {
            const objAssets = gameObject.getInitialAssetListRecursively();
            initialAssets = initialAssets.concat(objAssets);
        });
        return initialAssets;
    }

    getScene() {
        let currentParent = this.parent;
        // go up the hierachy untill you hit something that is not a GameObject
        while(currentParent && currentParent instanceof GameObject) {
            currentParent = currentParent.parent;
        }
        if (currentParent instanceof Scene) {
            return currentParent
        } else  {
            return null;
        }
    }

    load() {
        if (this.modelAssetPath) {
            // Instantiate a copy of the model asset, and attach the clone as child of this GameObject's threeJSGroup
            const assetStore = this.getScene().game.assetStore;
            const asset = assetStore.get(this.modelAssetPath);
            if (asset) {
                if (!(asset instanceof GLTFAsset)) {
                    throw new Error(`GameObject: asset found at ${this.modelAssetPath} in AssetStore should be a GLTFAsset`);
                }
                const scene = clone(asset.data.scene);
                scene.children.forEach(object3D => {
                    this.threeJSGroup.add(object3D);
                });
            } else {
                console.warn(`GameObject ${this.name} was unable to create its model as the required asset (${this.modelAssetPath}) was not found (or loaded) in the AssetStore`)
            }
        }
        
        this.gameObjects.forEach(childGameObject => {
            childGameObject.load()
        });
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