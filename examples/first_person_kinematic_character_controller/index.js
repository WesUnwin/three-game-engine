import { Game, KinematicCharacterController } from "../../dist/index"; // to directly reference the lastest, local code (npm run build), OR import from "three-game-engine"

const baseURL = window.location.host === 'localhost' ? 'http://localhost:8080' : 'https://raw.githubusercontent.com/WesUnwin/three-game-engine/main'

// Create a game object pointing to the project folder, which must contain a game.json file
// definining your game, its scenes, settings, etc.
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

// We use the KinematicCharacterController class exported by three-game-engine by extending it.
// KinematicCharacterController extends CharacterController which in turn extends the GameObject superclass.
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
      super.afterLoaded() // so that KinematicCharacterController can still do its things

      const scene = this.getScene();
      const game = scene.game;     
    
      // Make the threeJS camera a child of the player game object.
      // (each game object's threeJS objects are contained in a threejs group: gameObject.threeJSGroup)
      // The camera now sees things from the ExampleCharacters perspective, creating a first-person perspective.
      const player = scene.getGameObjectWithName('player');
      const cam = game.renderer.getCamera();
      player.threeJSGroup.add(cam);

      cam.position.set(0, 0.4, 0); // move the camera up 0.4 meters so its at eye level (the origin is in the center of the characters body)

      scene.showPhysics(); // Renders the outline of all physics colliders
    }
}

game.registerGameObjectClasses({ ExampleCharacter }); // This class will control all game objects of type: "ExampleCharacter"

game.play();
