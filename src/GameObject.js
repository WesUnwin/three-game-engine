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

        this.models = options.models || [];
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

        const setObject3DProps = (object3D, props) => {
            for (const prop in props) {
                const value = props[prop];
                switch (prop) {
                    case 'position':
                        // Allow specifying the .position of things like models/lights/etc. by THREE.Vector3 or an object like: { x: _, y: _, z: _ }
                        if (value instanceof THREE.Vector3) {
                            object3D.position = value;
                        } else if (['x', 'y', 'z'].some(subprop => typeof value[subprop] === 'number')) {
                            object3D.position.set(value.x || 0, value.y || 0, value.z || 0);
                        } else {
                            throw new Error('GameObject: object3D position must be either a THREE.Vector3 or an object with x/y/z properties as numbers');
                        }
                        break;
                    case 'rotation':
                        // Allow specifying the .rotation of things like models/lights/etc. by THREE.Euler or an object like: { x: _, y: _, z: _ }
                        if (value instanceof THREE.Euler) {
                            object3D.rotation = value;
                        } else if (['x', 'y', 'z'].some(subprop => typeof value[subprop] === 'number')) {
                            object3D.rotation.set(value.x || 0, value.y || 0, value.z || 0, value.order);
                        } else {
                            throw new Error('GameObject: object3D rotation must be either a THREE.Euler or an object with properties: x/y/z/order');
                        }
                        break;
                    case 'scale':
                        // Allow specifying the .scale of things like models/lights/etc. by THREE.Vector3 or an object like: { x: _, y: _, z: _ }
                        if (value instanceof THREE.Vector3) {
                            object3D.scale = value;
                        } else if (['x', 'y', 'z'].some(subprop => typeof value[subprop] === 'number')) {
                            object3D.scale.set(value.x || 0, value.y || 0, value.z || 0);
                        } else {
                            throw new Error('GameObject: object3D scale must be either a THREE.Vector3 or an object with x/y/z properties as numbers');
                        }
                        break;
                    default:
                        object3D[prop] = value; 
                }
            }
        };

        this.models.forEach(modelData => {
            // Instantiate a copy of the model asset, and attach the clone as child of this GameObject's threeJSGroup
            const assetStore = this.getScene().game.assetStore;
            const asset = assetStore.get(modelData.assetPath);
            if (!(asset instanceof GLTFAsset)) {
                throw new Error(`GameObject: asset found at ${modelData.assetPath} in AssetStore should be a GLTFAsset`);
            }
            const scene = clone(asset.data.scene);
            scene.children.forEach(object3D => {
                const objectProps = { ...modelData };
                delete objectProps.assetPath;
                setObject3DProps(object3D, objectProps);
                this.threeJSGroup.add(object3D);
            });
        });

        this.lights.forEach(lightData => {
            let light = null;
            const lightTypes = {
                AmbientLight: THREE.AmbientLight,
                DirectionalLight: THREE.DirectionalLight,
                HemisphereLight: THREE.HemisphereLight,
                PointLight: THREE.PointLight,
                RectAreaLight: THREE.RectAreaLight,
                SpotLight: THREE.SpotLight
            };
            const LightClass = lightTypes[lightData.type];
            if (LightClass) {
                light = new LightClass();
                light.name = lightData.type.toLowerCase();
            } else {
                throw new Error(`GameObject: error creating ThreeJS light: unknown light type: ${lightData.type}`);
            }

            const objectProps = { ...lightData };
            delete objectProps.type;
            setObject3DProps(light, objectProps);

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