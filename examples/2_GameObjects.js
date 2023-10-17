import { Game, Scene } from "../dist/index";

const runDemo = async () => {

    const game = new Game({
      rendererOptions: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio
      },
      assetOptions: {
        baseURL: 'http://localhost:8080/assets'
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
        }
      ]
    });

    await game.loadScene(scene);

    game.play();
}

export default runDemo
