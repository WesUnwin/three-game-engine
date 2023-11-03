import { GameObject } from "../../../dist";

class Platform2_2_1 extends GameObject {
    constructor(parent, options) {
      super(parent, {
          models: [
              { assetPath: 'models/platform_2_2_1.glb' }
          ],
          rigidBody: {
            type: 'fixed',
            colliders: [
                { type: 'cuboid', hx: 1, hy: 0.5, hz: 1 }
            ]
          },
          ...options
      })
    }
}

export default Platform2_2_1;
