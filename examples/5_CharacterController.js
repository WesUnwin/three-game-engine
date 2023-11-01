import { Game, GameObject, Scene, KinematicCharacterController } from "../dist/index";

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

    class Platform10_10_1 extends GameObject {
      constructor(parent, options) {
        super(parent, {
            models: [
                { assetPath: 'models/platform_10_10_1.glb' }
            ],
            rigidBody: {
              type: 'fixed',
              colliders: [
                  { type: 'cuboid', hx: 5, hy: 0.5, hz: 5 }
              ]
            },
            ...options
        })
      }
    }

    class Platform2_10_1 extends GameObject {
      constructor(parent, options) {
        super(parent, {
            models: [
                { assetPath: 'models/platform_2_10_1.glb' }
            ],
            rigidBody: {
              type: 'fixed',
              colliders: [
                  { type: 'cuboid', hx: 5, hy: 0.5, hz: 1 }
              ]
            },
            ...options
        })
      }
    }

    class Platform2_2_05 extends GameObject {
      constructor(parent, options) {
        super(parent, {
            models: [
                { assetPath: 'models/platform_2_2_05.glb' }
            ],
            rigidBody: {
              type: 'fixed',
              colliders: [
                  { type: 'cuboid', hx: 1, hy: 0.25, hz: 1 }
              ]
            },
            ...options
        })
      }
    }
  
    class Platform2_2_1 extends GameObject {
      constructor(parent, options) {
        super(parent, {
            models: [
                { assetPath: 'models/platform_2_2_1.glb' }
            ],
            rigidBody: {
              type: 'fixed',
              colliders: [
                  { type: 'cuboid', hx: 1, hy: 0.5, hz: 1 }
              ]
            },
            ...options
        })
      }
    }
  
    class Platform2_2_2 extends GameObject {
      constructor(parent, options) {
        super(parent, {
            models: [
                { assetPath: 'models/platform_2_2_2.glb' }
            ],
            rigidBody: {
              type: 'fixed',
              colliders: [
                  { type: 'cuboid', hx: 1, hy: 1, hz: 1 }
              ]
            },
            ...options
        })
      }
    }
  
  
    const scene = new Scene({
      gameObjects: [
        {
          name: 'player',
          klass: ExampleCharacter,
          position: { x: -3, y: 3, z: 3 }
        },
        {
            klass: Platform10_10_1,
            position: { x: 0, y: -0.25, z: 0 },
            lights: [
                { type: 'AmbientLight', intensity: 0.5 }
            ]
        },

        {
          klass: Platform10_10_1,
          position: { x: 0, y: -0.25, z: -10 }
        },

        {
          klass: Platform2_2_2,
          position: { x: -1, y: 1.25, z: -14 } // back row of 2x2x2s
        },
        {
          klass: Platform2_2_2,
          position: { x: 1, y: 1.25, z: -14 } // back row of 2x2x2s
        },
        {
          klass: Platform2_2_2,
          position: { x: 3, y: 1.25, z: -14 } // back row of 2x2x2s
        },

        {
          klass: Platform2_2_05,  // floating platform left of back row
          position: { x: -4, y: 2.5, z: -14 }
        },

        {
          klass: Platform2_2_2, // left staircase, highest step
          position: { x: -1, y: 1, z: -12 }
        },
        {
          klass: Platform2_2_2,
          position: { x: -1, y: 0.75, z: -10 }
        },
        {
          klass: Platform2_2_2,
          position: { x: -1, y: 0.5, z: -8 }
        },
        {
          klass: Platform2_2_1,
          position: { x: -1, y: 0.75, z: -6 }
        },
        {
          klass: Platform2_2_1,
          position: { x: -1, y: 0.5, z: -4 }
        },
        {
          klass: Platform2_2_05,
          position: { x: -1, y: 0.5, z: -2 }
        },
        {
          klass: Platform2_2_05, // left staircase, lowest step
          position: { x: -1, y: 0.25, z: 0 }
        },


        {
          klass: Platform2_2_2, // middle staircase, highest step
          position: { x: 1, y: 0.75, z: -12 }
        },
        {
          klass: Platform2_2_2,
          position: { x: 1, y: 0.25, z: -10 }
        },
        {
          klass: Platform2_2_1,  // middle staircase, lowest step
          position: { x: 1, y: 0.25, z: -8 }
        },

        {
          klass: Platform2_2_1,  // right staircase, single step
          position: { x: 3, y: 0.75, z: -12 }
        },


        {
          klass: Platform10_10_1,
          position: { x: -11, y: -0.25, z: -10 }
        },

        {
          klass: Platform2_2_2,
          position: { x: -7, y: 1.25, z: -14 } // back row of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_2_2,
          position: { x: -9, y: 1.25, z: -14 } // back row of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_2_2,
          position: { x: -11, y: 1.25, z: -14 } // back row of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_2_2,
          position: { x: -13, y: 1.25, z: -14 } // back row of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_2_2,
          position: { x: -15, y: 1.25, z: -14 } // back row of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_2_2,
          position: { x: -15, y: 1.25, z: -12 } // left wall of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_2_2,
          position: { x: -15, y: 1.25, z: -10 } // left wall of 2x2x2s, forward left platform
        },
        {
          klass: Platform2_10_1,
          position: { x: -15, y: -1.1, z: -0.1 }, // slope, 10 degree angle
          rotation: { x: 0.174533, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -13, y: -1.95, z: -0.4 }, // slope, 20 degree angle
          rotation: { x: 0.349066, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -11, y: -2.8, z: -0.9 }, // slope, 30 degree angle
          rotation: { x: 0.523599, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -9, y: -3.6, z: -1.5 }, // slope, 40 degree angle
          rotation: { x: 0.698132, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -7, y: -4, z: -2.2 }, // slope, 50 degree angle
          rotation: { x: 0.872665, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -15, y: -2, z: 9.9 },
          rotation: { x: 0, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -13, y: -3.5, z: 9 },
          rotation: { x: 0, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -11, y: -5.25, z: 8.5 },
          rotation: { x: 0, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -9, y: -6.9, z: 7.5 },
          rotation: { x: 0, y: Math.PI / 2.0, z: 0 }
        },
        {
          klass: Platform2_10_1,
          position: { x: -7, y: -8, z: 6 },
          rotation: { x: 0, y: Math.PI / 2.0, z: 0 }
        },


        {
          klass: Platform10_10_1,
          position: { x: 12, y: -0.25, z: -10 }
        },
        {
          name: 'bale',
          models: [
            { assetPath: 'models/bale_of_hay.glb' }
          ],
          rigidBody: {
            type: 'dynamic',
            colliders: [
              { type: 'cuboid', hx: 0.5, hy: 0.5, hz: 1 }
            ]
          },
          position: { x: 7, y: 6, z: -8 },
          rotation: { x: 31, y: 90, z: 11 }
        },
        {
          name: 'bale2',
          models: [
            { assetPath: 'models/bale_of_hay.glb' }
          ],
          rigidBody: {
            type: 'dynamic',
            colliders: [
              { type: 'cuboid', hx: 0.5, hy: 0.5, hz: 1 }
            ]
          },
          position: { x: 12, y: 6, z: -8 },
          rotation: { x: 5, y: 90, z: 11 }
        },
        {
          name: 'barrel',
          models: [
            { assetPath: 'models/barrel.glb' }
          ],
          rigidBody: {
            type: 'dynamic',
            colliders: [
              { type: 'cylinder', halfHeight: 0.5, radius: 0.5 }
            ]
          },
          position: { x: 14, y: 6, z: -5 },
          rotation: { x: 5, y: 90, z: 11 }
        },
        {
          name: 'barrel2',
          models: [
            { assetPath: 'models/barrel.glb' }
          ],
          rigidBody: {
            type: 'dynamic',
            colliders: [
              { type: 'cylinder', halfHeight: 0.5, radius: 0.5 }
            ]
          },
          position: { x: 14, y: 6, z: -11 },
          rotation: { x: 5, y: 90, z: 11 }
        }
      ]
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
