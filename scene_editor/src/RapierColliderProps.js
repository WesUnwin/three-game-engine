// TODO move this file into the game engine, and maybe re-use it so the list of
// properties required for a given type of collider is defined just once.

export const commonProperties = [
  { name: 'density', type: 'number', default: 1.0, unit: 'kg / m^3' },
  { name: 'friction', type: 'number', default: 0.5 },
  { name: 'sensor', type: 'boolean', default: false }
];

export const colliderProperties = {
  ball: [
    { name: 'radius', type: 'number', default: 1.0, unit: 'meters' },
  ],
  capsule: [
    { name: 'halfHeight', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'radius', type: 'number', default: 1.0, unit: 'meters' }
  ],
  cone: [
    { name: 'halfHeight', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'radius', type: 'number', default: 1.0, unit: 'meters' }
  ],
  cuboid: [
    { name: 'hx', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'hy', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'hz', type: 'number', default: 1.0, unit: 'meters' }
  ],
  cylinder: [
    { name: 'halfHeight', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'radius', type: 'number', default: 1.0, unit: 'meters' }
  ],
  roundCone: [
    { name: 'halfHeight', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'radius', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'borderRadius', type: 'number', default: 0.1, unit: 'meters' }
  ],
  roundCylinder: [
    { name: 'halfHeight', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'radius', type: 'number', default: 1.0, unit: 'meters' },
    { name: 'borderRadius', type: 'number', default: 0.1, unit: 'meters' }
  ]
};
