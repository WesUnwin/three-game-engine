[![npm version](https://badge.fury.io/js/three-game-engine.svg)](https://badge.fury.io/js/three-game-engine)

MUCH TO COME VERY SOON - THIS LIBRARY HAS JUST RECENTLY BEEN STARTED

# three-game-engine
Simple, lightweight game engine using:
 - Three.js - a 3D WebGL-based Graphics Engine (https://github.com/mrdoob/three
 - Rapier - a 3D Physics Engine (https://github.com/dimforge/rapier.js)
 - three-mesh-ui - Toolkit for building 3D user interfaces in Three.js

This library simply ties together several well known, capable javascript libraries resulting in a powerful yet simple game engine.

![Screenshot](docs/three-game-engine.png)

## The Vision
 - to make it easy to tie together 3 great javascript libraries: ThreeJS, Rapier3D, and three-mesh-ui to create a versatile, easy to use 3D game engine.
 - to allow javascript lovers to easily jump into game development, using tools and libraries familiar to them.
 - to offer a 100% free engine that can be used by anyone to build personal or comercial apps/games.
 - maintain source code that is highly readable, and extendable
 - to offer VR support

# Architecture
This game engine allows you to manage a Scene of GameObjects.
Each GameObject controls a Group in the ThreeJS scene graph, and can optionally be associated with a Rapier RigidBody with colliders.

![Screenshot](docs/three-game-engine-architecture.png)

# Assets
Your game will need to load and interact with various files such as gltfs, sounds, images, scene JSON files, game object type JSON files, etc.
The game object manages an AssetStore (game.assetStore) which manages loading and caching files as they are needed.

Your game will need to specify a base URL: (eg. https://localhost/assets or file://yourgamefiles/assets) to be used for all assets.
All assets are specified by an asset path which is relative to this base URL: eg an asset path of models/player.glb thus would be loaded from https://localhost/assets/models/player.glb.

# Scenes
Scenes are represented by instances of the Scene class, or a sub-class of Scene.
Scenes can (optionally) be initialized by JSON data that controls the positioning and layout of GameObjects representing scenary, items. characters, etc. in the scene.

Creating a class that extends the Scene class will give you the ability to add scripting to control the behavior of the scene.

Furthermore you can registerGameObjectClasses() to associate a javascript class with each type of GameObject, allowing you to control the behavior of types of GameObjects.

```
import { Scene } from 'three-game-engine';
import testAreaJSON from './testArea.json';

import PlayerGameObject from '../game_objects/PlayerGameObject.js';

class TestAreaScene extends Scene {
  constructor() {
    super(testAreaJSON); // will use the layout defined in this json to populate this scene with game objects when loaded
  
    // Designate the PlayerGameObject JS class (a sub-class of GameObject),
    // to controls all game objects of type 'playerGameObject', defined in the above testAreaJSON
    this.registerGameObjectClasses({
      'playerGameObject': PlayerGameObject 
    })
  }

  afterLoaded() {
    // called once when this scene is loaded by the game object
  }

  beforeRender() {
    // called once before each time ThreeJS renders the scene
  }
}
```

# Scene JSON
The best way to control the initial layout of a scene is by creating a .json file like this:

```
{
  "gameObjectTypes": {
    "player": "game_objects/player.json" // asset path relative to assetOptions.baseURL 
  },

  "gameObjects": [
    // you can define individual, unique GameObjects like this:
    { 
      "name": "ground",
      "models": [
        { "assetPath": "models/ground.glb" }
      ],
      "lights": [
        { "type": "AmbientLight", "intensity": 0.5 }
      ],
      "position": { "x": 5, "y": 0, "z": 0 }
    },

    // OR you can create a game object of a given "type", inheriting from the above game object type's .json file
    { 
      "type": "player",
      "position": { "x": 5, "y": 0, "z": 0 }
    }
  ]
}
```

# GameObject Type JSON
You can define a type of GameObject by a .json file, to create re-usable, generalized GameObjects that all
are based off a common set of properties (eg. all share the same models/physics properties etc.)

```
{
  "models": [
    { "assetPath": "models/player.glb" }
  ],
  "rigidBody": { // Optional
      "type": "kinematicPositionBased",
      "colliders": [
          { "type": "capsule", "halfHeight": 0.5, "radius", 0.5 }
      ],
      "enabledRotations": { "x": false, "y": true, "z": false }
  }
}
```

# GameObject Classes
A GameObject type can also be (optionally) associated with a GameObject sub-class.

call game/scene.registerGameObjectClasses() to link your javascript GameObject class to a type of
GameObject.

Registering a GameObject class allows you to define/control the behavior of GameObjects of this type.

```
  class PlayerGameObject extends GameObject {
      afterLoaded() {
        // called once when this GameObject and its scene gets loaded
      }

      beforeRender() {
        // called once each frame
        // you can control the behavior and functionality of the game object here.
      }
  }
```

# Examples
The examples/ folder In this repo contains several simple example apps that that demonstrate features of the engine.
To run the examples in your browser, clone this repo then run:

```
  npm install
  npm run examples
```

# Desktop and Mobile Apps
In addition to using this library to build web apps that run in your browser, with third party tools like electron, cordova, etc. you can easily package and distribute your game as a desktop app or mobile app.

This repo contains complete working examples of:
- How to use electron & electron-forge to package your game as a desktop app, see [examples/electron](https://github.com/WesUnwin/three-game-engine/tree/main/examples/electron)
- How to package your app as an android or iOS app using Apache Cordova, see [examples/cordova](https://github.com/WesUnwin/three-game-engine/tree/main/examples/cordova)


# API Reference

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
| new Scene()                                  | Creates a new empty Scene.                                                       |
| new Scene(jsonAssetPath)                     | Creates a new scene, that will be populated with the layout of GameObjects in the specified json file. See Scene JSON. |
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