import { Game, Scene } from "../dist/index";

// Creates a full screen canvas,
// an empty scene (with a default blue background)
// and starts running the scene.
const runDemo = async () => {

    const game = new Game({
      rendererOptions: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio
      }
    })
  
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

    const scene = new Scene();

    await game.loadScene(scene);

    game.play();
}

export default runDemo
