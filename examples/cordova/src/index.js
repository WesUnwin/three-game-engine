import { Game, Scene, GameObject} from "three-game-engine";

console.log('running three-game-engine example cordova app');

const runDemo = async () => {
    const game = new Game({
      rendererOptions: {
        setupFullScreenCanvas: true
      },
      assetOptions: {
        baseURL: 'https://localhost'  
      }
    })

    // Scripts can be associated by GameObjects by creating your own GameObject sub-class
    class BarrelGameObject extends GameObject {
        constructor(parent, options) {
            super(parent, {
              models: [
                { assetPath: 'models/barrel.glb' }
              ],
              rigidBody: {
                type: 'dynamic',
                colliders: [
                  { type: 'cylinder', halfHeight: 0.5, radius: 0.5 }
                ]
              },
                ...options // merge with any passed in GameObjectOptions
            })
        }

        afterLoaded() {
          // Once a force is added it will remain affecting the rigid body untill removed
          this.rapierRigidBody.addForce({ x: 0, y: 0, z: -1 }, true);
        }

        beforeRender() {

        }
    }

    const scene = new Scene({
      gameObjects: [
        {
          name: 'ground',
          models: [
            { assetPath: 'models/test_area.glb' }
          ],
          lights: [
            { type: 'AmbientLight', intensity: 0.5 }
          ],
          rigidBody: {
            type: 'fixed',
            colliders: [
                { type: 'cuboid', hx: 5, hy: 0.5, hz: 5 }
            ]
          }
        },
        {
          name: 'barrel',
          klass: BarrelGameObject,
          position: { x: 0.1, y: 3, z: 4 },
          rotation: { x: 0, y: -0.1, z: 20 }
        },
        {
          name: 'bale',
          models: [
            { assetPath: 'models/bale_of_hay.glb' }
          ],
          rigidBody: {
            type: 'dynamic',
            colliders: [
              { type: 'cuboid', hx: 0.5, hy: 0.5, hz: 1 }
            ]
          },
          position: { x: 1, y: 6, z: 0 },
          rotation: { x: 31, y: 90, z: 11 }
        }
      ]
    });

    game.renderer.setCameraPosition(-4, 5, 10);
    game.renderer.makeCameraLookAt(0,0,0);

    await game.loadScene(scene);

    game.play();
}

runDemo()
