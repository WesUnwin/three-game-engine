


interface GameOptions {
    rendererOptions?: RendererOptions;
    assetOptions?: AssetOptions;
}

interface RendererOptions {
    width?: number;
    height?: number;
    enableVR?: boolean;
    pixelRatio?: number;
    cameraOptions?: CameraOptions;
}

interface CameraOptions {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
}

interface AssetOptions {
    baseURL?: string;
    retainAssetsBetweenScene?: boolean;
}

interface GameObjectOptions {
    name?: string;
    tags?: string[];
    models?: ModelData[];
    lights?: LightData[];
    position?: Vector3Data;
    scale?: Vector3Data;
    rotation?: EulerValues;
}

interface ModelData {
    assetPath: string;
    position?: Vector3Data;
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

interface LightData {
    type?: string;
    position?: Vector3Data;
}

interface SceneData {
    name?: string;
    background?: null;
    gameObjects?: GameObjectOptions[];
}