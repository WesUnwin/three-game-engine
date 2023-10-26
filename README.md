
# three-game-engine
Simple, lightweight game engine using:
 - Three.js - a 3D WebGL-based Graphics Engine (https://github.com/mrdoob/three
 - Rapier - a 3D Physics Engine (https://github.com/dimforge/rapier.js)
 - three-mesh-ui - Toolkit for building 3D user interfaces in Three.js

This library simply ties together several well known, capable javascript libraries resulting in a powerful yet simple game engine.

![Screenshot](docs/three-game-engine.png)

This game engine allows you to manage a Scene of GameObjects.
Each GameObject controls a Group in the ThreeJS scene graph, and can optionally be associated with a Rapier RigidBody with colliders.

![Screenshot](docs/three-game-engine-architecture.png)

## The vision
 - to make it easy to tie together 3 great javascript libraries: ThreeJS, Rapier3D, and three-mesh-ui to create a versatile, easy to use 3D game engine.
 - to allow javascript lovers to easily jump into game development, using tools and libraries familiar to them.
 - to offer a 100% free engine that can be used by anyone to build personal or comercial apps/games.
 - maintain source code that is highly readable, and extendable
 - to offer VR support

MUCH TO COME VERY SOON - THIS LIBRARY HAS JUST RECENTLY BEEN STARTED

# Example

```
    import { Game, Scene } from "three-game-engine";

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

    // Will render the empty scene, displaying its default blue background
    game.play();
```

# Library API

Top level objects:

```
  import { Game, Scene, GameObject } from 'three-game-engine';

  // See descriptions below of each of these top level objects
```

## Game API
This is the top-level object that you typically create and configure just once.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| new Game(options: GameOptions)               | Creates a new game, with a WebGL1 renderer setup with the specified options      |
| async loadScene(scene)                       | Async function that loads and switches to rendering a Scene (see Scene API)      |
| play()                                       | Starts (or resumes) rendering of the game, rendering the currently loaded scene. |
| pause()                                      | Pauses rendering of the game till play() is called again.                        |
| async loadAsset(assetPath)                   | Tells game.assetStore to fetch a given asset (such a .gltf/glb file) and store it for future use. Assets needed by GameObjects are automatically, loaded when the GameObject is loaded into a scene, but this can be used to make assets ready in advance. |
| getAssetStore()                              | Returns the asset store instance game.assetStore used by this game object.       |

### GameOptions
This is a set of options in the form of a javascript object passed into new Game(gameOptions), to configure how the game engine should operate. Some of the settings will be passed to other features of the game engine like the internal
Renderer, AsssetStore, Camera, etc.

| Property                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| .rendererOptions                             | See RendererOptions below. These are passed onto game.renderer                   |
| .assetOptions                                | Seet AssetOptions. These are passed onto game.assetStore                         |

### AssetOptions

| Property                  | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| .baseURL                  | Base URL that all asset paths are assumed to be relative too. Eg. "http://localhost:8000/assets". Thus an asset with asset path: "textures/image.png" would be fetched using the full URL of: "http://localhost:8000/assets/textures/image.png". |
| .retainAssetsBetweenScene | (default: false) if true the game's assetstore will not clear assets when loading a scene, which can make switching back to scenes already loaded quicker, and loading scenes with assets used in previously loaded scenes quicker. |

## game.renderer
A game object internally manages a Renderer object (accessed by game.renderer).
This contains all the functionality that manages and implements a renderer loop using a Three.js WebGL1 Renderer object internally.

### RendererOptions

| Property                     | Description                                                                                       |
| -----------------------------| ------------------------------------------------------------------------------------------------- |
| .width                       | The width in pixels to be applied to the ThreeJS WebGL renderer.                                  |
| .height                      | The height in pixels to be applied to the ThreeJS WebGL renderer.                                 |
| .pixelRatio                  | The pixelRatio in pixels to be applied to the ThreeJS WebGL renderer, most apps pass in window.devicePixelRatio  |
| .cameraOptions               | See CameraOptions below                                                                           |
| .setupFullScreenCanvas       | If true, a canvas HTML element will automatically be created and added to the DOM, stretched to fill the window, and be used by ThreeJS to render onto.  |

### CameraOptions
These values will be passed onto the ThreeJS PerspectiveCamera created automatically by game.renderer.

| Property                 | Description                                                                      |
| -------------------------| -------------------------------------------------------------------------------- |
| .fov                     | Field of view.                                                                   |
| .aspect                  | Aspect ratio                                                                     |
| .near                    | Near value                                                                       |
| .far                     | Far value                                                                        |

## Scene API
A game is developed as set of Scenes. The game can actively render just one scene (or none) at a given time.
Scenes can represent different levels, areas, menus, hubworlds, or even loading screens in a game.
A Scene internally manages a Three.js Scene object.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| new Scene(sceneData)                         | Creates a 3D scene from the given data.                                          |
| addGameObject(gameObject)                    | Adds the given GameObject to the scene.                                         |
| removeGameObject(gameObject)                 | Removes the given GameObject from the scene.                                     |
| getRootGameObjects()                         | Returns all top level game objects in the scene.                                 |
| find(fn)                                     | Returns the first game object where the function fn(gameObject) returns true.     |
| findAll(fn)                                  | Returns an array of game objects where the given function fn(gameObject) returns true. |
| findByName(name)                             | Returns the first game object in the scene with the given name.                   |
| findAllByTag(tag)                            | Returns all game objects in the scene that have the given.                        |

## GameObject API
A scene contains a hieriarchy of GameObjects.

All game objects are an instance of GameObject, or a sub-class of GameObject that your application may define.
Creating a GameObject sub-class is a great way of generalizing the behavior of a given set of game objects. 

Each GameObject internally manages a ThreeJS Group (gameObject.threeJSGroup).
The group object can contain various graphical 3D models, lights and other ThreeJS Object3Ds within it.

A GameObject can also optionally have a RapierJS RigidBody (gameObject.rapierRigidBody).
The RigidBody can be used to control the physics and collision detection aspects of the GameObject.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| new GameObject(parent, options)              | Creates a GameObject as a child of either a scene or another GameObject.         |
| addGameObject(gameObject)                    | Adds the given GameObject as a child of this GameObject.                          |
| removeGameObject(gameObject)                 | Removes the given GameObject if it is an immediate child of this GameObject.      |
| getRootGameObjects()                         | Returns all immediate child GameObjects of this GameObject.                      |
| find(fn)                                     | Returns the first game object where the function fn(gameObject) returns true. |
| findAll(fn)                                  | Returns an array of game objects where the given function fn(gameObject) returns true. |
| findByName(name)                             | Returns the first descendent game object with the given name.                    |
| findAllByTag(tag)                            | Returns an array of all descendent game objects that have the given tag.        |