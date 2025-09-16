import RAPIER from "@dimforge/rapier3d-compat";
import { UserInterfaceJSON } from "./ui/UIHelpers";
import { ComponentJSON } from "./Component";

// JSON Files

interface GameJSON {
    initialScene?: string;
    scenes?: Object;
    gameObjectTypes?: Object;
}

interface SceneJSON {
    background?: null;
    fog?: null | FogJSON;
    lights?: LightData[];
    sounds?: SceneSoundJSON[];
    gameObjects?: GameObjectJSON[];
    gravity?: Vector3Data;
}

interface FogJSON {
    color: string;
    near: number;
    far: number;
}

interface SceneSoundJSON {
    assetPath: string;
    name: string;
    loop?: boolean;
    autoplay?: boolean;
    volume?: number;
    playbackRate?: number;
}

interface GameObjectJSON extends GameObjectOptions {
    type?: string;
    children?: GameObjectJSON[];
}

// Options structures

interface GameOptions {
    rendererOptions?: RendererOptions;
    assetOptions?: AssetOptions;
    inputOptions?: InputOptions;
    disablePhysics?: boolean;
}

interface RendererOptions {
    width?: number;
    height?: number;
    enableVR?: boolean;
    pixelRatio?: number;
    cameraOptions?: CameraOptions;
    setupFullScreenCanvas?: boolean;
    canvas?: HTMLCanvasElement;
    beforeRender?: (args: { deltaTimeInSec: number, time: number}) => void;
}

interface CameraOptions {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
}

interface AssetOptions {
    baseURL?: string;
}

interface InputOptions {
    wsadMovement?: boolean; // use WSAD keyboard keys to move around, just like arrow keys
    mouseOptions?: MouseOptions;
}

interface MouseOptions {
    usePointerLock?: boolean;
}

interface GameObjectOptions {
    type?: string;
    name?: string;
    tags?: string[];

    userData?: Object;

    components?: ComponentJSON[];

    position?: Vector3Data;
    scale?: Vector3Data;
    rotation?: EulerValues;
}

interface EulerValues {
    x?: number;
    y?: number;
    z?: number;
    order?: string;
}

interface Vector3Data {
    x?: number;
    y?: number;
    z?: number;
}

interface CharacterControllerOptions {
    walkingSpeed?: number;
    runningSpeed?: number;
    jumpCooldown?: number;

    capsule?: ColliderData
}