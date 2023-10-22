import { Game, Scene } from "../dist/index";

// Creates a full screen canvas,
// an empty scene (with a default blue background)
// and starts running the scene.
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

    await game.loadScene(scene);

    game.play();
}

export default runDemo
