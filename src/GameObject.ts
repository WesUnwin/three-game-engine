import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import Scene from './Scene';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import GLTFAsset from './assets/GLTFAsset';
import * as PhysicsHelpers from './physics/PhysicsHelpers';
import * as UIHelpers from './ui/UIHelpers';
import { GameObjectJSON, GameObjectOptions, LightData, ModelData, RigidBodyData } from './types';
import { UserInterfaceJSON } from './ui/UIHelpers';
import Util from './Util';

class GameObject {
    id: string;
    type: string | null;
    name: string;
    tags: string[];
    threeJSGroup: THREE.Group;
    parent: Scene | GameObject;
    gameObjects: GameObject[];
    models: ModelData[];
    lights: LightData[];
    loaded: boolean;
    loadPromise: Promise<void>;
    rigidBodyData: RigidBodyData | null;
    rapierRigidBody: RAPIER.RigidBody | null;
    userInterfacesData: UserInterfaceJSON[];
    options: GameObjectOptions;

    constructor(parent: Scene | GameObject, options: GameObjectOptions = {}) {
        if (!(parent instanceof Scene || parent instanceof GameObject)) {
            throw new Error('When creating a GameObject, the parent must be a Scene or another GameObject')
        }
        this.id = Util.getUUID();
        this.parent = parent;
        this.options = options;
        this.loadPromise = Promise.resolve();
        this.reset();
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

    getRapierWorld() {
        const scene = this.getScene();
        return scene?.rapierWorld;
    }

    onGameObjectTypeChange = () => {
        this.reset();

        const scene = this.getScene();
        if (scene) {
            this.load(); // asynchonous
        }
    };

    // Resets/sets the state of this gameObject to the GameObjectOptions and it's type's options
    reset() {
        const scene = this.getScene();

        let allOptions;
        if (this.options.type) {
            // Merge the base set of options defined in the the game object
            // type json, with any options for this individual object.
            const gameObjectTypeJSONAsset = scene.game.getGameObjectTypeJSON(this.options.type);
            gameObjectTypeJSONAsset.once('change', this.onGameObjectTypeChange);

            allOptions = Object.assign({}, gameObjectTypeJSONAsset.data, this.options);
        } else {
            allOptions = { ...this.options };
        }

        this.type = allOptions.type || null;

        const typeCount = scene.gameObjects.filter(g => g.type === this.type).length;

        this.name = allOptions.name || `${this.type}${typeCount + 1}` || '';
        this.tags = allOptions.tags || [];

        this.gameObjects = [];

        this.models = allOptions.models || [];
        this.lights = allOptions.lights || [];

        this.loaded = false;

        if (!this.threeJSGroup) {
            this.threeJSGroup = new THREE.Group();
        }
        this.threeJSGroup.clear();

        Object.assign(this.threeJSGroup.userData, {
            ...(this.options.userData || {}),
            gameObjectID: this.id
        });
        this.threeJSGroup.name = `gameObject-${this.name}`;

        const x = allOptions.position?.x || 0;
        const y = allOptions.position?.y || 0;
        const z = allOptions.position?.z || 0;
        this.setPosition(x, y, z);

        const scaleX = allOptions.scale?.x || 1;
        const scaleY = allOptions.scale?.y || 1;
        const scaleZ = allOptions.scale?.z || 1;
        this.setScale(scaleX, scaleY, scaleZ);

        const rotX = allOptions.rotation?.x || 0;
        const rotY = allOptions.rotation?.y || 0;
        const rotZ = allOptions.rotation?.z || 0;
        const rotOrder = allOptions.rotation?.order || 'XYZ';
        this.setRotation(rotX, rotY, rotZ, rotOrder);

        this.rigidBodyData = allOptions.rigidBody || null;

        this.userInterfacesData = allOptions.userInterfaces || [];
        
        this.parent.addGameObject(this);
    }

    // Constructs this GameObject's child ThreeJS Object3Ds as specified by the options passed to the constructor.
    // The GameObject must be part of a scene that is loaded into a game.
    // This will dynamically fetch any asset that is not already loaded into the game's asset store along the way.
    async load() {
        this.loadPromise = this.loadPromise.then(() => this._load());
        await this.loadPromise;
    }

    async _load() {
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

        for (let uiData of this.userInterfacesData) {
            await UIHelpers.createUIComponent(uiData, this.threeJSGroup, scene.game.assetStore);
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

        if (this.rigidBodyData) {
            PhysicsHelpers.setupGameObjectPhysics(this);
        }

        for(let i = 0; i<this.gameObjects.length; i++) {
            const childGameObject = this.gameObjects[i];
            await childGameObject.load()
        }

        this.loaded = true;
    }

    isLoaded(): boolean {
        return this.loaded;
    }

    hasTag(tag: string) {
        return this.tags.some(t => t === tag);
    }

    addGameObject(gameObject: GameObject) {
        if (!this.gameObjects.some(g => g === gameObject)) {
            gameObject.parent = this;
            this.gameObjects.push(gameObject);
            this.threeJSGroup.add(gameObject.threeJSGroup);

            const scene = this.getScene();
            if (scene?.isActive()) {
                gameObject.load(); // asynchronous
            }
        }
    }

    removeGameObject(gameObject: GameObject) {
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

    forEachGameObject(fn: (gameObject: GameObject) => {}) {
        fn(this);
        this.gameObjects.forEach(child => {
            child.forEachGameObject(fn);
        });
    }

    find(fn: (gameObject: GameObject) => {}): GameObject | null {
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

    findAll(fn: (gameObject: GameObject) => {}): GameObject[] {
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

    findByName(name: string): GameObject | null {
        return this.find(g => g.name === name);
    }

    findAllByTag(tag: string): GameObject[] {
        return this.findAll(g => g.hasTag(tag));
    }

    destroy() {
        if (this.parent) {
            this.parent.removeGameObject(this);
            this.parent = null;
        }
    }

    afterPhysicsUpdate() {
        if (this.rapierRigidBody) {
            // TODO: set world position of threeJSGroup, not local
            this.threeJSGroup.position.copy(this.rapierRigidBody.translation() as THREE.Vector3);
            this.threeJSGroup.quaternion.copy(this.rapierRigidBody.rotation() as THREE.Quaternion);
        }
        // Optional: override and handle this event
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

    setPosition(x: number, y: number, z: number) {
        this.threeJSGroup.position.set(x, y, z);
    }

    rotateOnAxis(axis: THREE.Vector3, angle: number) {
        this.threeJSGroup.rotateOnAxis(axis, angle);
    }

    rotateOnWorldAxis(axis: THREE.Vector3, angle: number) {
        this.threeJSGroup.rotateOnWorldAxis(axis, angle);
    }

    rotateX(degrees: number) {
        this.threeJSGroup.rotateX(degrees);
    }

    rotateY(degrees: number) {
        this.threeJSGroup.rotateY(degrees);
    }

    rotateZ(degrees: number) {
        this.threeJSGroup.rotateZ(degrees);
    }

    setRotationFromAxisAngle(axis: THREE.Vector3, angle: number) {
        this.threeJSGroup.setRotationFromAxisAngle(axis, angle);
    }

    setRotationFromEuler(euler: THREE.Euler) {
        this.threeJSGroup.setRotationFromEuler(euler);
    }

    setRotationFromMatrix(m: THREE.Matrix4) {
        this.threeJSGroup.setRotationFromMatrix(m);
    }

    setRotationFromQuaternion(q: THREE.Quaternion) {
        this.threeJSGroup.setRotationFromQuaternion(q);
    }

    setRotation(x: number, y: number, z: number, order: string = undefined) {
        this.threeJSGroup.rotation.set(x, y, z, order);
    }

    setScale(x: number, y: number, z: number) {
        this.threeJSGroup.scale.set(x, y, z);
    }

    translateOnAxis(axis: THREE.Vector3, distance: number) {
        this.threeJSGroup.translateOnAxis(axis, distance);
    }

    translateX(distance: number) {
        this.threeJSGroup.translateX(distance);
    }

    translateY(distance: number) {
        this.threeJSGroup.translateY(distance);
    }

    translateZ(distance: number) {
        this.threeJSGroup.translateZ(distance);
    }

    traverse(callback: (obj: THREE.Object3D) => {}) {
        this.threeJSGroup.traverse(callback);
    }

    traverseVisible(callback: (obj: THREE.Object3D) => {}) {
        this.threeJSGroup.traverseVisible(callback);
    }

    traverseAncestors(callback: (obj: THREE.Object3D) => {}) {
        this.threeJSGroup.traverseAncestors(callback);
    }

    resetForces(wakeUp: boolean) {
        this.rapierRigidBody.resetForces(wakeUp);
    }

    resetTorques(wakeUp: boolean) {
        this.rapierRigidBody.resetTorques(wakeUp);
    }

    addForce(vector: RAPIER.Vector, wakeUp: boolean) {
        this.rapierRigidBody.addForce(vector, wakeUp);
    }

    addForceAtPoint(force: RAPIER.Vector, point: RAPIER.Vector, wakeUp: boolean) {
        this.rapierRigidBody.addForceAtPoint(force, point, wakeUp);
    }

    addTorque(vector: RAPIER.Vector, wakeUp: boolean) {
        this.rapierRigidBody.addTorque(vector, wakeUp);
    }

    applyImpulse(impulse: RAPIER.Vector, wakeUp: boolean) {
        this.rapierRigidBody.applyImpulse(impulse, wakeUp);
    }

    applyImpulseAtPoint(impulse: RAPIER.Vector, point: RAPIER.Vector, wakeUp: boolean) {
        this.rapierRigidBody.applyImpulseAtPoint(impulse, point, wakeUp);
    }

    lockTranslations(locked: boolean, wakeUp: boolean) {
        this.rapierRigidBody.lockTranslations(locked, wakeUp);
    }

    lockRotations(locked: boolean, wakeUp: boolean) {
        this.rapierRigidBody.lockRotations(locked, wakeUp);
    }

    setEnabledRotations(enableX: boolean, enableY: boolean, enableZ: boolean, wakeUp: boolean) {
        this.rapierRigidBody.setEnabledRotations(enableX, enableY, enableZ, wakeUp);
    }

    setLinearDamping(factor: number) {
        this.rapierRigidBody.setLinearDamping(factor);
    }

    setAngularDamping(factor: number) {
        this.rapierRigidBody.setAngularDamping(factor);
    }

    setDominanceGroup(group: number) {
        this.rapierRigidBody.setDominanceGroup(group);
    }

    enableCcd(enabled: boolean) {
        this.rapierRigidBody.enableCcd(enabled);
    }
}

export default GameObject