import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import Scene from './Scene';
import { GameObjectOptions } from './types';
import Util from './Util';
import Component from './Component';
import RigidBodyComponent from './components/RigidBodyComponent';
import ModelComponent from './components/ModelComponent';
import LightComponent from './components/LightComponent';
import SoundComponent from './components/SoundComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';

class GameObject {
    id: string;
    type: string | null;
    name: string;
    tags: string[];
    threeJSGroup: THREE.Group;
    parent: Scene | GameObject;

    loaded: boolean;
    loadPromise: Promise<void>;

    options: GameObjectOptions;

    components: Component[];

    gameObjects: GameObject[];

    static componentClassForType = {
        model: ModelComponent,
        rigidBody: RigidBodyComponent,
        light: LightComponent,
        sound: SoundComponent,
        userInterface: UserInterfaceComponent
    };

    static registerClassForComponentType(type: string, klass) {
        GameObject.componentClassForType[type] = klass;
    }

    constructor(parent: Scene | GameObject, options: GameObjectOptions = {}) {
        if (!(parent instanceof Scene || parent instanceof GameObject)) {
            throw new Error('When creating a GameObject, the parent must be a Scene or another GameObject')
        }
        this.id = Util.getUUID();
        this.parent = parent;
        this.loadPromise = Promise.resolve();

        this.reset(options);
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

    onGameObjectTypeChange = () => {
        this.reset();
        this.load(); // asnychronous
    };

    // Resets/sets the state of this gameObject to the GameObjectOptions and it's type's options
    reset(json = null) {
        if (json) {
            this.options = json;
        }

        this.components = [];

        const scene = this.getScene();

        let allOptions;
        if (this.options.type) {
            // Merge the base set of options defined in the the game object
            // type json, with any options for this individual object.
            const gameObjectTypeJSONAsset = scene.game.getGameObjectTypeJSON(this.options.type);
            gameObjectTypeJSONAsset.once('change', this.onGameObjectTypeChange);

            allOptions = Object.assign({}, gameObjectTypeJSONAsset.data, this.options);
            allOptions.components = [...(gameObjectTypeJSONAsset.data.components || []), ...(this.options.components || [])]
        } else {
            allOptions = { ...this.options };
        }

        this.type = allOptions.type || null;

        const typeCount = scene.gameObjects.filter(g => g.type === this.type).length;

        this.name = allOptions.name || `${this.type}${typeCount + 1}` || '';
        this.tags = allOptions.tags || [];

        this.gameObjects = [];

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

        (allOptions.components || []).forEach(json => {
            const ComponentClass = GameObject.componentClassForType[json.type];
            const component = new ComponentClass(this, json);
            this.components.push(component);
        });

        this.parent.addGameObject(this);
    }

    setName(name: string) {
        this.threeJSGroup.name = name;
    }

    // Constructs this GameObject's child ThreeJS Object3Ds as specified by the options passed to the constructor.
    // The GameObject must be part of a scene that is loaded into a game.
    // This will dynamically fetch any asset that is not already loaded into the game's asset store along the way.
    async load() {
        this.loadPromise = this.loadPromise.then(() => this._load());
        await this.loadPromise;
    }

    async _load() {
        // Load components seriallly (TODO: determine if components can be loaded in parralel)
        for (let c of this.components) {
            await c.load();
        }

        for(let i = 0; i<this.gameObjects.length; i++) {
            const childGameObject = this.gameObjects[i];
            await childGameObject.load();
        }

        this.loaded = true;
    }

    isLoaded(): boolean {
        return this.loaded;
    }

    hasTag(tag: string) {
        return this.tags.some(t => t === tag);
    }

    getComponent(componentClass) {
        return this.components.find(c => c instanceof componentClass);
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

    // Called after the scene and all its GameObjects have
    // been succesfully loaded.
    afterLoaded() {
        // Optional: override and handle this event
    }

    // Called on the scene and all its GameObjects immediately
    // before threeJS renders everything.
    beforeRender({ deltaTimeInSec }) {
        this.components.forEach(c => c.beforeRender({ deltaTimeInSec }));
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

    getRapierRigidBody() {
        const rigidBodyComponent = this.getComponent(RigidBodyComponent) as RigidBodyComponent;
        return rigidBodyComponent?.getRapierRigidBody();
    }

    syncWithRigidBody() {
        const rapierRigidBody = this.getRapierRigidBody();
        if (rapierRigidBody) {
            // TODO: set world position of threeJSGroup, not local
            this.threeJSGroup.position.copy(rapierRigidBody.translation() as THREE.Vector3);
            this.threeJSGroup.quaternion.copy(rapierRigidBody.rotation() as THREE.Quaternion);
        }
    }

    resetForces(wakeUp: boolean) {
        this.getRapierRigidBody().resetForces(wakeUp);
    }

    resetTorques(wakeUp: boolean) {
        this.getRapierRigidBody().resetTorques(wakeUp);
    }

    addForce(vector: RAPIER.Vector, wakeUp: boolean) {
        this.getRapierRigidBody().addForce(vector, wakeUp);
    }

    addForceAtPoint(force: RAPIER.Vector, point: RAPIER.Vector, wakeUp: boolean) {
        this.getRapierRigidBody().addForceAtPoint(force, point, wakeUp);
    }

    addTorque(vector: RAPIER.Vector, wakeUp: boolean) {
        this.getRapierRigidBody().addTorque(vector, wakeUp);
    }

    applyImpulse(impulse: RAPIER.Vector, wakeUp: boolean) {
        this.getRapierRigidBody().applyImpulse(impulse, wakeUp);
    }

    applyImpulseAtPoint(impulse: RAPIER.Vector, point: RAPIER.Vector, wakeUp: boolean) {
        this.getRapierRigidBody().applyImpulseAtPoint(impulse, point, wakeUp);
    }

    lockTranslations(locked: boolean, wakeUp: boolean) {
        this.getRapierRigidBody().lockTranslations(locked, wakeUp);
    }

    lockRotations(locked: boolean, wakeUp: boolean) {
        this.getRapierRigidBody().lockRotations(locked, wakeUp);
    }

    setEnabledRotations(enableX: boolean, enableY: boolean, enableZ: boolean, wakeUp: boolean) {
        this.getRapierRigidBody().setEnabledRotations(enableX, enableY, enableZ, wakeUp);
    }

    setLinearDamping(factor: number) {
        this.getRapierRigidBody().setLinearDamping(factor);
    }

    setAngularDamping(factor: number) {
        this.getRapierRigidBody().setAngularDamping(factor);
    }

    setDominanceGroup(group: number) {
        this.getRapierRigidBody().setDominanceGroup(group);
    }

    enableCcd(enabled: boolean) {
        this.getRapierRigidBody().enableCcd(enabled);
    }

    playSound(name: string, delayInSec: number = 0, detune: number | null = null) {
        const component = this.components.find(c => c instanceof SoundComponent && c.jsonData.name === name);
        if (component) {
            const soundComponent = component as SoundComponent;
            soundComponent.playSound(delayInSec, detune);
        } else {
            throw new Error(`gameObject.playSound(): game object ${this.name || this.id} has no sound with name: ${name}`);
        }
    }
}

export default GameObject