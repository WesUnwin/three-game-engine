import * as THREE from 'three';
import Scene from './Scene';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import GLTFAsset from './assets/GLTFAsset';

class GameObject {
    name: string;
    tags: string[];
    threeJSGroup: THREE.Group;
    parent: Scene | GameObject;
    gameObjects: GameObject[];
    models: ModelData[];
    lights: LightData[];
    loaded: boolean;

    constructor(parent: Scene | GameObject, options: GameObjectOptions = {}) {
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

        this.loaded = false;
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

    // Constructs this GameObject's child ThreeJS Object3Ds as specified by the options passed to the constructor.
    // The GameObject must be part of a scene that is loaded into a game.
    // This will dynamically fetch any asset that is not already loaded into the game's asset store along the way.
    async load() {
        const scene = this.getScene();
        if (!scene) {
            throw new Error('GameObject: load() this GameObject must be attached to a scene (directly or through its ancestor GameObjects) to be loaded');
        }
        if (!scene?.game) {
            throw new Error('GameObject: load(): the scene containing this GameObject must be loaded into a game object first');
        }

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
                    case 'color':
                        if (value instanceof THREE.Color) {
                            object3D.color = value;
                        } else if (['number', 'string'].some(t => typeof value === t)) {
                            object3D.color = new THREE.Color(value);
                        } else {
                            throw new Error('GameObject: object3D color must be set to either a THREE.Color instance or a string (which will be passed to the THREE.Color() constructor)');
                        }
                        break;
                    default:
                        object3D[prop] = value; 
                }
            }
        };

        for (let i = 0; i<this.models.length; i++) {
            const modelData = this.models[i];
            const asset = await scene.game.loadAsset(modelData.assetPath);
            if (!(asset instanceof GLTFAsset)) {
                throw new Error(`GameObject: asset found at ${modelData.assetPath} in AssetStore should be a GLTFAsset`);
            }
            const clonedModel = clone(asset.data.scene);
            clonedModel.children.forEach(object3D => {
                const objectProps = { ...modelData };
                delete objectProps.assetPath;
                setObject3DProps(object3D, objectProps);
                this.threeJSGroup.add(object3D);
            });
        }

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

        for(let i = 0; i<this.gameObjects.length; i++) {
            const childGameObject = this.gameObjects[i];
            await childGameObject.load()
        }

        this.loaded = true;
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

    forEachGameObject(fn) {
        fn(this);
        this.gameObjects.forEach(child => {
            child.forEachGameObject(fn);
        });
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

    // Called after the scene and all its GameObjects have
    // been succesfully loaded.
    afterLoaded() {
        // Optional: override and handle this event
    }

    // Called on the scene and all its GameObjecte immediately
    // before threeJS renders everything.
    beforeRender({ deltaTimeInSec }) {
        // Optional: override and handle this event
    }

    // Called on the scene and all its GameObjects just before
    // a new scene is loaded. Use this to do teardown operations.
    beforeUnloaded() {
        // Optional: override and handle this event   
    }
}

export default GameObject