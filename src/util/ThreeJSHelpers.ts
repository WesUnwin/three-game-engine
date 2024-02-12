import * as THREE from 'three';
import { GameObjectSoundData, LightData } from "../types";

export const setObject3DProps = (object3D, props) => {
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

export const createLight = (lightData: LightData) => {
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

    return light;
}

export const createPositionalAudio = (soundData: GameObjectSoundData, audioBuffer: AudioBuffer, audioListener: THREE.AudioListener, name: string) => {
    const positionalAudio = new THREE.PositionalAudio(audioListener);
    positionalAudio.name = name;
    positionalAudio.setBuffer(audioBuffer);

    if (typeof soundData.loop === 'boolean') {
        positionalAudio.setLoop(soundData.loop);
    }
    if (typeof soundData.autoplay === 'boolean') {
        positionalAudio.autoplay = soundData.autoplay;
    }
    if (typeof soundData.playbackRate === 'number') {
        positionalAudio.setPlaybackRate(soundData.playbackRate);
    }
    if (typeof soundData.detune === 'number') {
        positionalAudio.setDetune(soundData.detune);
    }

    if (typeof soundData.refDistance === 'number') {
        positionalAudio.setRefDistance(soundData.refDistance);
    }
    if (typeof soundData.rolloffFactor === 'number') {
        positionalAudio.setRefDistance(soundData.rolloffFactor);
    }
    if (typeof soundData.distanceModel === 'string') {
        positionalAudio.setRefDistance(soundData.distanceModel);
    }
    if (typeof soundData.maxDistance === 'number') {
        positionalAudio.setRefDistance(soundData.maxDistance);
    }
    if (typeof soundData.directionalCone === 'object') {
        positionalAudio.setDirectionalCone(
            soundData.directionalCone.coneInnerAngle,
            soundData.directionalCone.coneOuterAngle,
            soundData.directionalCone.coneOuterGain
        );
    }

    return positionalAudio;
}