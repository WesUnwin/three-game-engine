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

        this.models = options.models || [];;
        this.lights = options.lights || [];
    }

    getInitialAssetList() {
        const assetPaths = [];

        this.models.forEach(modelData => {
            const { assetPath } = modelData;
            if (!(typeof assetPath === 'string')) {
                throw new Error('GameObject has a model, but no model.assetPath assigned, this is required to load the model data');
            }
            if (!assetPath.endsWith('.glb')) {
                throw new Error('GameObject model.assetPath must end with .glb');
            }
            assetPaths.push(assetPath);
        });

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
        this.threeJSGroup.clear() // Remove any existing child objects.

        this.models.forEach(modelData => {
            // Instantiate a copy of the model asset, and attach the clone as child of this GameObject's threeJSGroup
            const assetStore = this.getScene().game.assetStore;
            const asset = assetStore.get(modelData.assetPath);
            if (!(asset instanceof GLTFAsset)) {
                throw new Error(`GameObject: asset found at ${modelData.assetPath} in AssetStore should be a GLTFAsset`);
            }
            const scene = clone(asset.data.scene);
            scene.children.forEach(object3D => {
                this.threeJSGroup.add(object3D);
            });
        });

        this.lights.forEach(lightData => {
            let light = null;
            const lightTypes = {
                PointLight: THREE.PointLight
            }
            const LightClass = lightTypes[lightData.type];
            if (LightClass) {
                light = new LightClass();
            } else {
                throw new Error(`GameObject: error creating ThreeJS light: unknown light type: ${lightData.type}`);
            }

            for (const prop in lightData) {
                const value = lightData[prop];
                switch (prop) {
                    case 'type':
                        // Used above to identify which ThreeJS Light Class to use
                        break;
                    case 'position':
                        light.position.set(value.x || 0, value.y || 0, value.z || 0);
                        break;
                    default:
                        throw new Error(`GameObject: error configuring ThreeJS light, unknown property for light: ${prop}`);
                }
            }

            this.threeJSGroup.add(light);
        });
        
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