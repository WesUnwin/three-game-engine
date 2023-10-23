import { Game, Scene, GameObject } from "three-game-engine"


// Since we can't use a top-level await, wrap everything in runApp() and call immediately
const runApp = async () => {
    let asssetBaseURL = `http://localhost:8080`;

    if (window.electron) {
      const isPackaged = await window.electron.isAppPackaged();
      if (isPackaged) {
        const resourcesPath = window.electron.getResourcesPath();
        asssetBaseURL = `file://${resourcesPath}/assets`;
      } else {
        const dirName = window.electron.getDirName();
        asssetBaseURL = `file://${dirName}/../../../assets`;
      }
    }

    const game = new Game({
        rendererOptions: {
        },
        assetOptions: {
            baseURL: asssetBaseURL
        }
    })

    const canvas = game.renderer.getCanvas();
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    document.body.innerHTML = '';
    document.body.appendChild(canvas);
    document.body.style.margin = '0px';
  
    // on resizing the viewport, update the dimensions of the canvas to fill the viewport
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      game.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    game.renderer.setSize(window.innerWidth, window.innerHeight);
    
    class BarrelGameObject extends GameObject {
        constructor(parent, options) {
            super(parent, {
            models: [
                { assetPath: 'models/barrel.glb' }
            ],
            rigidBody: {
                type: 'dynamic',
                colliders: [
                { type: 'cylinder', halfHeight: 0.5, radius: 0.5 }
                ]
            },
                ...options // merge with any passed in GameObjectOptions
            })
        }
    
        afterLoaded() {
            // Once a force is added it will remain affecting the rigid body untill removed
            this.rapierRigidBody.addForce({ x: 0, y: 0, z: -1 }, true);
        }
    
        beforeRender() {
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
                name: 'barrel',
                klass: BarrelGameObject,
                position: { x: 0.1, y: 3, z: 4 },
                rotation: { x: 0, y: -0.1, z: 20 }
            }
        ]
    });
    
    game.renderer.setCameraPosition(-4, 5, 10);
    game.renderer.threeJSCamera.lookAt(0,0,0);
    
    await game.loadScene(scene);
    
    game.play();
}

runApp();