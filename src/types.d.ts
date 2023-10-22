import RAPIER from "@dimforge/rapier3d-compat";



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
    rigidBody?: RigidBodyData;
}

interface ModelData {
    assetPath: string;
    position?: Vector3Data;
}

interface RigidBodyData {
    type: 'dynamic' | 'fixed' | 'kinematicPositionBased' | 'kinematicVelocityBased';
    colliders: ColliderData[];
}

interface ColliderData {
    type: 
        'ball' | 
        'capsule' | 
        'cone' | 
        'convexHull' |
        'convexMesh' |
        'cuboid' | 
        'cylinder' |
        'polyline' |
        'roundCone' |
        'roundConvexHull' |
        'roundConvexMesh' |
        'roundCuboid' |
        'roundCylinder' |
        'roundTriangle' |
        'trimesh' | 
        'heightfield';

    // For a cuboid
    hx: number; // half length along x-axis
    hy: number; // half length along y-axis
    hz: number; // half length along z-axis

    halfHeight: number; // for a capsule
    radius: number; // for a ball or capsule

    borderRadius: number; // for a roundCone

    vertices: Float32Array; // for a trimesh
    indices: Uint32Array; // for a trimesh

    points: Float32Array;

    // For a heightfield
    nrows: number;
    ncols: number;
    heights: Float32Array;
    scale: RAPIER.Vector;

    // For a roundTriangle
    a: RAPIER.Vector;
    b: RAPIER.Vector;
    c: RAPIER.Vector;
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
    gravity?: Vector3Data;
}