import { Game, KinematicCharacterController } from "../dist/index";
import TestAreaScene from "./scenes/TestAreaScene";

const runDemo = async () => {
    const game = new Game({
      rendererOptions: {
        setupFullScreenCanvas: true
      },
      assetOptions: {
        baseURL: 'http://localhost:8080/assets'
      }
    })

    class ExampleCharacter extends KinematicCharacterController {
        constructor(parent, options) {
            super(parent,
              { // GameObjectOptions
                models: [],
                ...options
              }, 
              { // CharacterControllerOptions
              }, 
              { // KinematicCharacterControllerOptions
                autoStep: {
                  maxHeight: 0.35, // automatically step onto platforms as long as their not taller than this value
                  minWidth: 0.5, // in order to auto-step onto, at least this much clearance is needed on top of it
                  includeDynamicBodies: false // if true this would step onto dynamic bodies (that are small enough)
                },
                applyImpulsesToDynamicBodies: true // allows you to push around things like the Barrel and Bale of Hay
              }
            )
        }
    }
  
    const scene = new TestAreaScene();

    const character = new ExampleCharacter(scene, {
        name: 'player',
        position: { x: -3, y: 3, z: 3 }
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
