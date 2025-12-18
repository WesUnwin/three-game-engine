import Component, { ComponentJSON } from "../Component";
import RAPIER from "@dimforge/rapier3d-compat";

export interface RigidBodyComponentJSON extends ComponentJSON {
  rigidBodyType: 'dynamic' | 'fixed' | 'kinematicPositionBased' | 'kinematicVelocityBased';
  enabledTranslations?: {
      x: boolean,
      y: boolean,
      z: boolean,  
  },
  enabledRotations?: {
      x: boolean,
      y: boolean,
      z: boolean,
  },
  colliders: ColliderData[];
}

export interface ColliderData {
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

  density?: number; // default 1.0
  friction?: number; // default 0.5
  sensor?: boolean; // if true this is a sensor collider (for detecting things that enter its 3D volume) not a solid collider.

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

class RigidBodyComponent extends Component {
  rapierRigidBody: RAPIER.RigidBody;

  constructor(gameObject, jsonData) {
    super(gameObject, jsonData);
    this.rapierRigidBody = null;
  }

  load() {
    const scene = this.gameObject.getScene();
    if (!scene) {
      throw new Error('setupPhysicsForGameObject: must be called on a GameObject that is attached to a scene, with a Rapier world associated with it');
    }

    const rigidBodyDesc: RAPIER.RigidBodyDesc = this._createRigidBodyDesc(this.jsonData.rigidBodyType);
  
    this.rapierRigidBody = scene.rapierWorld.createRigidBody(rigidBodyDesc);

    // Position the RigidBody within the Physics World, at the (world) position
    // it should be based on the world position of the threeJS group representing the GameObject
    // TODO: get world position of threeJSGroup not local
    const x = this.gameObject.threeJSGroup.position.x;
    const y = this.gameObject.threeJSGroup.position.y;
    const z = this.gameObject.threeJSGroup.position.z;
    const rigidBodyTranslation = new RAPIER.Vector3(x, y, z);
    this.rapierRigidBody.setTranslation(rigidBodyTranslation, true);

    const worldRotation = this.gameObject.threeJSGroup.quaternion.clone();
    this.rapierRigidBody.setRotation(worldRotation as RAPIER.Quaternion, true);

    if (this.jsonData.enabledTranslations) {
      const enabledTrans = Object.assign({ x: true, y: true, z: true }, this.jsonData.enabledTranslations);
      this.rapierRigidBody.setEnabledTranslations(enabledTrans.x, enabledTrans.y, enabledTrans.z, true);
    }

    if (this.jsonData.enabledRotations) {
      const enabledRots = Object.assign({ x: true, y: true, z: true }, this.jsonData.enabledRotations);
      this.rapierRigidBody.setEnabledRotations(enabledRots.x, enabledRots.y, enabledRots.z, true);
    }

    (this.jsonData.colliders || []).forEach(colliderData => {
      const colliderDesc = this._createColliderDesc(colliderData);
      const collider = scene.rapierWorld.createCollider(colliderDesc, this.rapierRigidBody);

      if (typeof colliderData.density !== 'undefined') {
        collider.setDensity(colliderData.density);
      }

      if (typeof colliderData.friction !== 'undefined') {
        collider.setFriction(colliderData.friction);
      }

      if (typeof colliderData.sensor !== 'undefined') {
        collider.setSensor(colliderData.sensor);
      }
    });
  }

  _createRigidBodyDesc(type): RAPIER.RigidBodyDesc {
    switch (type) {
      case 'fixed':
        return RAPIER.RigidBodyDesc.fixed();
      case 'dynamic':
        return RAPIER.RigidBodyDesc.dynamic();
      case 'kinematicPositionBased':
        return RAPIER.RigidBodyDesc.kinematicPositionBased();
      case 'kinematicVelocityBased':
        return RAPIER.RigidBodyDesc.kinematicVelocityBased();
      default:
        throw new Error(`GameObject: load(): invalid rigidBody.type: ${type}`);
    }
  }

  _createColliderDesc(colliderData): RAPIER.ColliderDesc {
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

  beforeRender() {
    // console.log('==> syncing gameObjec with rigid body position')
    // const threeJSGroup = this.gameObject.threeJSGroup;
    // // TODO: set world position of threeJSGroup, not local
    // threeJSGroup.position.copy(this.rapierRigidBody.translation() as THREE.Vector3);
    // threeJSGroup.quaternion.copy(this.rapierRigidBody.rotation() as THREE.Quaternion);
  }

  getRapierRigidBody() {
    return this.rapierRigidBody;
  }
}

export default RigidBodyComponent;
