import GameObject from "../dist/GameObject";
import { Game, Scene } from "../dist/index";

const runDemo = async () => {
    const game = new Game({
      rendererOptions: {
        setupFullScreenCanvas: true
      },
      assetOptions: {
        baseURL: 'http://localhost:8080/assets'
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

    const scene = new Scene("json/scenes/simpleTestScene.json");

    game.renderer.setCameraPosition(-4, 5, 10);
    game.renderer.makeCameraLookAt(0,0,0);

    await game.loadScene(scene);

    new BarrelGameObject(scene, {
      position: { x: 0, y: 3, z: 0 },
      rotation: { x: 1.4, y: 2, z: 2 }
    });

    game.play();

    window.game = game;
}

export default runDemo
