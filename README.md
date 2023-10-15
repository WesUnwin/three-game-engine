
# three-game-engine
Simple, lightweight game engine using:
 - Three.js - a 3D WebGL-based Graphics Engine (https://github.com/mrdoob/three
 - Rapier - a 3D Physics Engine (https://github.com/dimforge/rapier.js)
 - three-mesh-ui - Toolkit for building 3D user interfaces in Three.js

This library simply ties together several well known, capable javascript libraries resulting in a powerful yet simple game engine.

![Screenshot](docs/three-game-engine.png)

## The vision
 - to create an easy-to-use, easy-to-setup versatile 3D game engine for developers that love and respect javascript
 - to allow for full use of the underlying libraries
 - maintain source code that is highly readable, and extendable
 - to offer VR support

MUCH TO COME VERY SOON - THIS LIBRARY HAS JUST RECENTLY BEEN STARTED

# Example

```
    import { Game, Scene } from "three-game-engine";

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

    // Will render the empty scene, displaying its default blue background
    game.play();
```

# Library API

## Game API (import Game from 'three-game-engine')
This is the top-level object that you typically create and configure just once.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| constructor(options)                         | Creates a new game, with a WebGL1 renderer setup with the specified options      |
| async loadScene(scene)                       | Async function that loads and switches to rendering a Scene (see Scene API)      |
| play()                                       | Starts (or resumes) rendering of the game, rendering the currently loaded scene. |
| pause()                                      | Pauses rendering of the game till play() is called again.                        |

## game.renderer
A game object internally manages a Renderer object (accessed by game.renderer).
This contains all the functionality that manages and implements a renderer loop using a Three.js WebGL1 Renderer object internally.

## Scene API  (import Scene from 'three-game-engine')
A game is developed as set of Scenes. The game at any given time is always actively displaying a single scene.
Scenes can represent different levels, areas, menus, hubworlds, or even loading screens in a game.
A scene internally manages a Three.js Scene object.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| constructor(sceneData)                       | Creates a 3D scene from the given data                                           |
| addGameObject(gameObject)                    | Adds the given GameObject to the scene                                           |
| removeGameObject(gameObject)                 | Removes the given GameObject from the scene                                      |
| getRootGameObjects()                         | Returns all top level game objects in the scene                                  |
| find(fn)                                     | Returns the first game object where the function fn(gameObject)                  |
|                                              | returns true                                                                     |
| findAll(fn)                                  | Returns an array of game objects where the given function fn(gameObject)         |
|                                              | returns true                                                                     |
| findByName(name)                             | Returns the first game object in the scene with the given name                   |
| findAllByTag(tag)                            | Returns all game objects in the scene that have the given                        |

## GameObject API  (import GameObject from 'three-game-engine')
A scene contains a hieriarchy of GameObjects.
Each GameObject corresponds to an Object3D (and its children) within the underlying three.js scene.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| constructor(parent, options)                 | Creates a GameObject as a child of either a scene or another GameObject.         |
| addGameObject(gameObject)                    | Adds the given GameObject as a child of this GameObject                          |
| removeGameObject(gameObject)                 | Removes the given GameObject if it is an immediate child of this GameObject      |
| getRootGameObjects()                         | Returns all immediate child GameObjects of this GameObject                       |
| find(fn)                                     | Returns the first game object where the function fn(gameObject)                  |
|                                              | returns true                                                                     |
| findAll(fn)                                  | Returns an array of game objects where the given function fn(gameObject)         |
|                                              | returns true                                                                     |
| findByName(name)                             | Returns the first descendent game object with the given name                     |
| findAllByTag(tag)                            | Returns an array of all descendent game objects that have the given tag          |