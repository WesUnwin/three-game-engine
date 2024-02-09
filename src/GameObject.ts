import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

import Scene from './Scene';
import GLTFAsset from './assets/GLTFAsset';
import * as PhysicsHelpers from './physics/PhysicsHelpers';
import * as UIHelpers from './ui/UIHelpers';
import { GameObjectOptions, LightData, ModelData, RigidBodyData } from './types';
import { UserInterfaceJSON } from './ui/UIHelpers';
import Util from './Util';
import { createLight, setObject3DProps } from './util/ThreeJSHelpers';

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

    getScene(): Scene {
        let currentParent = this.parent;
        // go up the hierachy untill you hit something that is not a GameObject
        while(currentParent && currentParent instanceof GameObject) {
            currentParent = currentParent.parent;
        }
        if (currentParent instanceof Scene) {
            return currentParent
        } else  {
            throw new Error(`getScene(): unable to locate scene for game object`);
        }
    }

    getRapierWorld() {
        const scene = this.getScene();
        return scene.rapierWorld;
    }

    onGameObjectTypeChange = () => {
        this.reset();
        this.load(); // asnychronous
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

    async updateLights(updatedLights: LightData[]) {
        this.lights = updatedLights;
        await this.loadLights();
    }

    async updateUserInterfaces(updatedUserInterfances: UserInterfaceJSON[]) {
        this.userInterfacesData = updatedUserInterfances;
        await this.loadUserInterfaces();
    }

    async updateRigidBody(rigidBodyData: RigidBodyData | null) {
        this.rigidBodyData = rigidBodyData;
        await this.loadRigidBody();
    }

    async updateModels(updatedModels: ModelData[]) {
        this.models = updatedModels;
        await this.loadModels();
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

        await this.loadLights();
        await this.loadUserInterfaces();
        await this.loadRigidBody();
        await this.loadModels();

        for(let i = 0; i<this.gameObjects.length; i++) {
            const childGameObject = this.gameObjects[i];
            await childGameObject.load();
        }

        this.loaded = true;
    }

    async loadLights() {
        const existingLights = this.threeJSGroup.children.filter(child => child instanceof THREE.Light);
        existingLights.forEach(existingLight => this.threeJSGroup.remove(existingLight));

        this.lights.forEach(lightData => {
            const light = createLight(lightData);
            this.threeJSGroup.add(light);
        });
    }

    async loadUserInterfaces() {
        const existingUI = this.threeJSGroup.children.filter(child => {
            // TODO fill in logic here to detect children that are UI related
        });
        existingUI.forEach(ui => ui.remove());

        const scene = this.getScene();
        for (let uiData of this.userInterfacesData) {
            await UIHelpers.createUIComponent(uiData, this.threeJSGroup, scene.game.assetStore);
        }
    }

    async loadRigidBody() {
        PhysicsHelpers.setupGameObjectPhysics(this);
    }

    async loadModels() {
        // Remove existing model related objects (objects with userData.model = true)
        const modelRelatedObjects = this.threeJSGroup.children.filter(child => child.userData.model);
        modelRelatedObjects.forEach(m => this.threeJSGroup.remove(m));

        const scene = this.getScene();
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
                object3D.userData.model = true;
                this.threeJSGroup.add(object3D);
            });
        }
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
            if (scene.isActive()) {
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

    getGameObject(fn: (gameObject: GameObject) => {}): GameObject | null {
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                return obj
            }
            const child = obj.getGameObject(fn)
            if (child) {
                return child
            }
        }
        return null
    }

    getGameObjects(fn: (gameObject: GameObject) => {}): GameObject[] {
        let results = []
        for (let i = 0; i<this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (fn(obj)) {
                results.push(obj);
            }
            const childResults = obj.getGameObjects(fn)
            results = results.concat(childResults)
        }
        return results
    }

    getGameObjectWithName(name: string): GameObject | null {
        return this.getGameObject(g => g.name === name);
    }

    getGameObjectsWithTag(tag: string): GameObject[] {
        return this.getGameObjects(g => g.hasTag(tag));
    }

    destroy() {
        this.parent.removeGameObject(this);
        this.parent = null;
    }

    syncWithRigidBody() {
        if (this.rapierRigidBody) {
            // TODO: set world position of threeJSGroup, not local
            this.threeJSGroup.position.copy(this.rapierRigidBody.translation() as THREE.Vector3);
            this.threeJSGroup.quaternion.copy(this.rapierRigidBody.rotation() as THREE.Quaternion);
        }
    }

    afterPhysicsUpdate() {
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