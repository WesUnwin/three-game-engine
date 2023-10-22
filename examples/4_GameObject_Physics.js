import GameObject from "../dist/GameObject";
import { Game, Scene } from "../dist/index";

const runDemo = async () => {

    const game = new Game({
      rendererOptions: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio
      },
      assetOptions: {
        baseURL: 'http://localhost:8080/assets' // All asssetPaths below are relative to this
      }
    });

    window.game = game;
  
    // Get the canvas, attach it to the DOM, making it fill the viewport
    const canvas = game.renderer.getCanvas();
    canvas.style.width = window.innerWidth
    canvas.style.height = window.innerHeight;
    document.body.appendChild(canvas);
    document.body.style.margin = '0px';
  
    // on resizing the viewport, update the dimensions of the canvas to fill the viewport
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      game.renderer.setSize(window.innerWidth, window.innerHeight);
    });

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
                        //{ type: 'ball', radius: 0.5 }
                        { type: 'cuboid', hx: 0.5, hy: 0.5, hz: 1 }
                    ]
                },
                ...options // merge with any passed in GameObjectOptions
            })
        }

        beforeRender() {
            console.log('Rigid body position: ', this.rapierRigidBody.translation());
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
          models: [
            { assetPath: 'models/barrel.glb' }
          ],
          rigidBody: {
            type: 'dynamic',
            colliders: [
              { type: 'cylinder', halfHeight: 0.5, radius: 0.5 }
            ]
          },
          position: { x: -1, y: 3, z: 0 },
          rotation: { x: 0, y: 0, z: 20 }
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
          position: { x: 1, y: 4, z: 0 },
          rotation: { x: 31, y: 90, z: 11 }
        }
      ]
    });

    await game.loadScene(scene);

    game.play();
}

export default runDemo
