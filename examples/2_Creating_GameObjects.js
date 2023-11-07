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

    const scene = new Scene();

    // A game actively displays one scene at a time. Use loadScene() to switch to another scene.
    // This will recursively (and asynchronously) load all assets required by all GameObjects in the scene.
    await game.loadScene(scene);

    new GameObject(scene, {
      name: 'ground', // Optional, makes it easy to look-up this GameObject
      models: [
        // GameObjects can load zero or more models from binary GTLF files (.glb files).
        // These will be fetched and added as children of this GameObject's ThreeJS Group
        { assetPath: 'models/test_area.glb' }
      ],
      lights: [
        // GameObjects can also instantiate any type of ThreeJS Light, which will be added as a child of this GameObject
        { type: 'PointLight', position: { x: 0, y: 5, z: 0 } }
      ]
    })

    // GameObjects can created at any time, and attached to a scene before or after its the scene is loaded.
    const ground = scene.findByName('ground');
    new GameObject(ground, { // Will be added as a child GameObject of the ground GameObject
      name: 'pine_tree_1',
      models: [
        { assetPath: 'models/pine_tree.glb', position: { x: -2, z: -2, y: 0.5 }, scale: { x: 0.5, y: 0.5, z: 0.5 } }
      ]
    });

    game.play();
}

export default runDemo
