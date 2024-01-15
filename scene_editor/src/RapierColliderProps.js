// TODO move this file into the game engine, and maybe re-use it so the list of
// properties required for a given type of collider is defined just once.
const colliderProperties = {
  ball: [
    { name: 'radius', type: 'number', default: 1.0 },
  ],
  capsule: [
    { name: 'halfHeight', type: 'number', default: 1.0 },
    { name: 'radius', type: 'number', default: 1.0 }
  ],
  cone: [
    { name: 'halfHeight', type: 'number', default: 1.0 },
    { name: 'radius', type: 'number', default: 1.0 }
  ],
  cuboid: [
    { name: 'hx', type: 'number', default: 1.0 },
    { name: 'hy', type: 'number', default: 1.0 },
    { name: 'hz', type: 'number', default: 1.0 }
  ],
  cylinder: [
    { name: 'halfHeight', type: 'number', default: 1.0 },
    { name: 'radius', type: 'number', default: 1.0 }
  ],
  roundCone: [
    { name: 'halfHeight', type: 'number', default: 1.0 },
    { name: 'radius', type: 'number', default: 1.0 },
    { name: 'borderRadius', type: 'number', default: 0.1 }
  ],
  roundCylinder: [
    { name: 'halfHeight', type: 'number', default: 1.0 },
    { name: 'radius', type: 'number', default: 1.0 },
    { name: 'borderRadius', type: 'number', default: 0.1 }
  ]
};

export default colliderProperties;