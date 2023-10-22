import RAPIER from '@dimforge/rapier3d-compat';
import GameObject from '../GameObject';
import { ColliderData, RigidBodyData } from '../types';

let rapierInitialized = false;

// Initialize RAPIER physics library, if not already done
export const initRAPIER = async () => {
    // init the rapier library, only needs to be done once ever.
    if (!rapierInitialized) {
        console.log('Game: initializing RAPIER physics library...');
        await RAPIER.init();
        rapierInitialized = true;
    }
};

export const createRapierWorld = (gravity: { x: number, y: number, z: number }) => {
    if (['x', 'y', 'z'].some(prop => typeof gravity[prop] !== 'number')) {
        // This check is here is because elsewise funky thing start happening inside Rapier,
        // when given bad values such as undefined x/y/z values. This include behavior
        // such as colliders consistently adopting NaN translation() values.
        throw new Error(`createRapierWorld: a rapier world must be initialized with a gravity vector, containing a numer x, y, and z value. given: ${gravity}`);
    }

    return new RAPIER.World(gravity);
};

// Creates the RigidBody and its colliders for a GameObject, and attaches it: gameObject.rigidBody
export const setupGameObjectPhysics = (gameObject: GameObject) => {
    if (!gameObject.rigidBodyData) {
        throw new Error('setupPhysicsForGameObject: GameObject must have .rigidBodyData');
    }
    const rigidBodyData: RigidBodyData = gameObject.rigidBodyData;

    // Physics:  Create RigidBody and its Colliders for this GameObject
    if (rigidBodyData) {
        const scene = gameObject.getScene();
        if (!scene) {
            throw new Error('setupPhysicsForGameObject: must be called on a GameObject that is attached to a scene, with a Rapier world associated with it');
        }

        const rigidBodyDesc: RAPIER.RigidBodyDesc = createRigidBodyDesc(gameObject.rigidBodyData);

        gameObject.rapierRigidBody = scene.rapierWorld.createRigidBody(rigidBodyDesc);

        // Position the RigidBody within the Physics World, at the (world) position
        // it should be based on the world position of the threeJS group representing the GameObject
        const x = gameObject.threeJSGroup.position.x;
        const y = gameObject.threeJSGroup.position.y;
        const z = gameObject.threeJSGroup.position.z;
        const rigidBodyTranslation = new RAPIER.Vector3(x, y, z);
        gameObject.rapierRigidBody.setTranslation(rigidBodyTranslation, true);

        const worldRotation = gameObject.threeJSGroup.quaternion.clone();
        gameObject.rapierRigidBody.setRotation(worldRotation as RAPIER.Quaternion, true);

        (rigidBodyData.colliders || []).forEach(colliderData => {
            const colliderDesc = createColliderDesc(colliderData);
            scene.rapierWorld.createCollider(colliderDesc, gameObject.rapierRigidBody);
        });
    }
}

export const createRigidBodyDesc = (rigidBodyData: RigidBodyData): RAPIER.RigidBodyDesc => {
    switch (rigidBodyData.type) {
        case 'fixed':
            return RAPIER.RigidBodyDesc.fixed();
        case 'dynamic':
            return RAPIER.RigidBodyDesc.dynamic();
        case 'kinematicPositionBased':
            return RAPIER.RigidBodyDesc.kinematicPositionBased();
        case 'kinematicVelocityBased':
            return RAPIER.RigidBodyDesc.kinematicVelocityBased();
        default:
            throw new Error(`GameObject: load(): invalid rigidBody.type: ${rigidBodyData.type}`);
    }
};

export const createColliderDesc = (colliderData: ColliderData): RAPIER.ColliderDesc => {
    const propsByColliderType = {
        ball: ['radius'],
        capsule: ['halfHeight', 'radius'],
        cone: ['halfHeight', 'radius'],
        convexHull: ['points'],
        convexMesh: ['vertices', 'indices'],
        cuboid: ['hx', 'hy', 'hz'],
        cylinder: ['halfHeight', 'radius'],
        polyline: ['vertices', 'indices'],
        roundCone: ['halfHeight', 'radius', 'borderRadius'],
        roundConvexHull: ['points', 'borderRadius'],
        roundConvexMesh: ['vertices', 'indices', 'borderRadius'],
        roundCuboid: ['hx', 'hy', 'hz', 'borderRadius'],
        roundCylinder: ['halfHeight', 'radius', 'borderRadius'],
        roundTriangle: ['a', 'b', 'c', 'borderRadius'],
        trimesh: ['vertices', 'indices'],
        heightfield: ['nrows', 'ncols', 'heights', 'scale']
    };

    const requiredProps = propsByColliderType[colliderData.type];
    
    if (typeof requiredProps === 'undefined') {
        throw new Error(`PhysicsHelpers.createColliderDesc(): invalid collider type: ${colliderData.type}`);
    }

    const missingProps = requiredProps.filter(prop => typeof colliderData[prop] == 'undefined');
    if (missingProps.length) {
        throw new Error(`PhysicsHelpers.createColliderDesc(): the following require props are missing: ${missingProps} for a collider of type ${colliderData.type}`);
    }

    switch(colliderData.type) {
        case 'ball':
            return RAPIER.ColliderDesc.ball(colliderData.radius);
        case 'capsule':
            return RAPIER.ColliderDesc.capsule(colliderData.halfHeight, colliderData.radius);
        case 'cone':
            return RAPIER.ColliderDesc.cone(colliderData.halfHeight, colliderData.radius);
        case 'convexHull':
            return RAPIER.ColliderDesc.convexHull(colliderData.points);
        case 'convexMesh':
            return RAPIER.ColliderDesc.convexMesh(colliderData.vertices, colliderData.indices);
        case 'cuboid':
            return RAPIER.ColliderDesc.cuboid(colliderData.hx, colliderData.hy, colliderData.hz);
        case 'cylinder':
            return RAPIER.ColliderDesc.cylinder(colliderData.halfHeight, colliderData.radius);
        case 'polyline':
            return RAPIER.ColliderDesc.polyline(colliderData.vertices, colliderData.indices);
        case 'roundCone':
            return RAPIER.ColliderDesc.roundCone(colliderData.halfHeight, colliderData.radius, colliderData.borderRadius);
        case 'roundConvexHull':
            return RAPIER.ColliderDesc.roundConvexHull(colliderData.points, colliderData.borderRadius);
        case 'roundConvexMesh':
            return RAPIER.ColliderDesc.roundConvexMesh(colliderData.vertices, colliderData.indices, colliderData.borderRadius);
        case 'roundCuboid':
            return RAPIER.ColliderDesc.roundCuboid(colliderData.hx, colliderData.hy, colliderData.hz, colliderData.borderRadius);
        case 'roundCylinder':
            return RAPIER.ColliderDesc.roundCylinder(colliderData.halfHeight, colliderData.radius, colliderData.borderRadius);
        case 'roundTriangle':
            return RAPIER.ColliderDesc.roundTriangle(colliderData.a, colliderData.b, colliderData.c, colliderData.borderRadius);
        case 'trimesh':
            return RAPIER.ColliderDesc.trimesh(colliderData.vertices, colliderData.indices);
        case 'heightfield':
            return RAPIER.ColliderDesc.heightfield(colliderData.nrows, colliderData.ncols, colliderData.heights, colliderData.scale);
        default:
            throw new Error(`GameObject: load(): invalid collider type: ${colliderData.type}`);
    }
}