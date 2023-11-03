import { GameObject } from "../../../dist";

class Platform2_2_05 extends GameObject {
    constructor(parent, options) {
      super(parent, {
          models: [
              { assetPath: 'models/platform_2_2_05.glb' }
          ],
          rigidBody: {
            type: 'fixed',
            colliders: [
                { type: 'cuboid', hx: 1, hy: 0.25, hz: 1 }
            ]
          },
          ...options
      })
    }
}

export default Platform2_2_05;
