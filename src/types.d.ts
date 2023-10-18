


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
}

interface ModelData {
    assetPath: string;
}

interface LightData {
    type: string;
}

interface SceneData {
    name?: string;
    background?: null;
    gameObjects?: GameObjectOptions[];
}