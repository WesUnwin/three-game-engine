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

    class TestScene extends Scene {
        constructor() {
            super("json/scenes/simpleTestScene.json")
        }
    }

    const scene = new TestScene();

    game.renderer.setCameraPosition(-3, 4, 8);
    game.renderer.makeCameraLookAt(0,0,0);

    await game.loadScene(scene);

    new GameObject(scene, {
        name: 'example-ui',
        position: { x: 0, y: 2, z: 0 },
        userInterfaces: [
            {
                type: 'Block',
                width: 4,
                height: 2,
                padding: 0.05,
                justifyContent: 'center',
                textAlign: 'left',
                fontFamily: 'fonts/verdanaz/verdanaz-msdf.json', // three-game-engine allows you to use an asset path here, instead of the JSON data directly
                fontTexture: 'fonts/verdanaz/verdanaz.png', // three-game-engine allows you to use an assetPath, rather than an absolute URL here
                children: [
                    {
                        name: 'text-component',
                        type: 'Text',
                        content: 'GameObjects can parent user interfaces built out of MeshUIComponents, which are just types of ThreeJS Object3Ds that can be used to build UI that exists in the 3D scene.',
                        fontSize: 0.1
                    }
                ]
            }
        ]
    })

    game.play();

    window.game = game;
}

export default runDemo
