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
    class UFOGameObject extends GameObject {
        constructor(parent, options) {
            super(parent, {
                models: [
                    { assetPath: 'models/UFO.glb', scale: { x: 0.25, y: 0.25, z: 0.25 } }
                ],
                ...options // merge with any passed in GameObjectOptions
            })
        }

        beforeRender({ deltaTimeInSec }) {
            // Here you can make changes to the GameObject in any way each frame
            // deltaTimeInSec represents the time that passed since the last frame,
            // and can be used to move things at a consistent speed in real time regardless of the
            // frame rate.
            this.rotateY(deltaTimeInSec * 2); // Equivalent of this.threeJSGroup.rotateY(deltaTimeInSec * 2)
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
            { type: 'PointLight', position: { x: 0, y: 5, z: 0 } }
          ]
        },
        {
          name: 'ufo',
          type: 'UFOGameObject',
          position: { z: -2, y: 2.5 }
        }
      ]
    });

    scene.registerGameObjectTypes({
      UFOGameObject: UFOGameObject
    });

    await game.loadScene(scene);

    game.play();
}

export default runDemo
