import { Game, KinematicCharacterController } from "../../dist/index";

const baseURL = window.location.host === 'localhost' ? 'http://localhost:8080' : 'https://raw.githubusercontent.com/WesUnwin/three-game-engine/main'

const game = new Game(`${baseURL}/examples/first_person_kinematic_character_controller`, {
  rendererOptions: {
    setupFullScreenCanvas: true
  },
  inputOptions: {
    mouseOptions: {
      usePointerLock: true
    }
  }
});

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

    afterLoaded() {
      super.afterLoaded();

      const scene = this.getScene();
      const game = scene.game;
    
      const player = scene.getGameObjectWithName('player');

      game.renderer.setCameraPosition(-4, 5, 10);
      game.renderer.makeCameraLookAt(0,0,0);
    
      const cam = game.renderer.getCamera();
      player.threeJSGroup.add(cam);

      cam.position.set(0, 0.4, 0);
      cam.rotation.set(0, 0, 0);

      scene.showPhysics();
    }
}

game.registerGameObjectClasses({ ExampleCharacter });

game.play();

window.game = game;

export default runDemo
