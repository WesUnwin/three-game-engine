import RAPIER from "@dimforge/rapier3d-compat";
import { Game, Scene, KinematicCharacterController, THREE, DynamicCharacterController } from "../dist/index";

const runDemo = async () => {
    const game = new Game({
      rendererOptions: {
        setupFullScreenCanvas: true
      },
      assetOptions: {
        baseURL: 'http://localhost:8080/assets'
      }
    })

    class ExampleCharacter extends DynamicCharacterController {
        constructor(parent, options) {
            super(parent, {
                models: [
                    //{ assetPath: 'models/barrel.glb' }
                ],
                ...options // merge with any passed in GameObjectOptions
            })
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
            name: 'player',
            klass: ExampleCharacter,
            position: { x: -3, y: 3, z: 3 }
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
            position: { x: 1, y: 1, z: 0 },
            rotation: { x: 31, y: 90, z: 11 }
        }
      ]
    });

    game.renderer.setCameraPosition(-4, 5, 10);
    game.renderer.makeCameraLookAt(0,0,0);

    scene.showPhysics();

    await game.loadScene(scene);

    game.play();

    const player = scene.findByName('player');

    const cam = game.renderer.getCamera();
    player.threeJSGroup.add(cam);
    cam.position.set(0, 0.4, 0);
    cam.rotation.set(0, 0, 0);

    window.game = game;
}

export default runDemo
