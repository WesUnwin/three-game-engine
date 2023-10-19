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
    })

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

    // Scene's can be contructed with an initial hierarchy of GameObjects:
    const scene = new Scene({
      gameObjects: [
        {
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
        }
      ]
    });

    // A game actively displays one scene at a time. Use loadScene() to switch to another scene.
    // This will recursively (and asynchronously) load all assets required by all GameObjects in the scene.
    await game.loadScene(scene);

    // GameObjects can created at any time, and attached to a scene before or after its the scene is loaded.
    const ground = scene.findByName('ground');
    new GameObject(ground, { // Will be added as a child GameObject of the ground GameObject
      name: 'pine_tree_1',
      models: [
        { assetPath: 'models/pine_tree.glb', position: { x: -2, z: -2 }, scale: { x: 0.5, y: 0.5, z: 0.5 } }
      ]
    });

    game.play();
}

export default runDemo
