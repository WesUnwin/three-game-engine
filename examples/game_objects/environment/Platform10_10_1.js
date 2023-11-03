import { GameObject } from "../../../dist";

class Platform10_10_1 extends GameObject {
    constructor(parent, options) {
      super(parent, {
          models: [
              { assetPath: 'models/platform_10_10_1.glb' }
          ],
          rigidBody: {
            type: 'fixed',
            colliders: [
                { type: 'cuboid', hx: 5, hy: 0.5, hz: 5 }
            ]
          },
          ...options
      })
    }
}

export default Platform10_10_1;
