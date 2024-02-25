[![npm version](https://badge.fury.io/js/three-game-engine.svg)](https://badge.fury.io/js/three-game-engine)

# UNDER CONSTRUCTION
This library has just recently been started, but aims for a beta 0.9.0 release by sometime in January or February 2024.

-----

<p align="center">
    <strong>
        <a href="https://wesunwin.github.io/three-game-engine/">
          Website
        </a>
        |
        <a href="https://wesunwin.github.io/three-game-engine/#/docs">
          Docs
        </a>
        |
        <a href="https://wesunwin.github.io/three-game-engine/#/editor">
          Scene Editor
        </a>
    </strong>
</p>

------

# three-game-engine
Simple, lightweight game engine using:
 - Three.js - a 3D WebGL-based Graphics Engine (https://github.com/mrdoob/three
 - Rapier - a 3D Physics Engine (https://github.com/dimforge/rapier.js)
 - three-mesh-ui - Lets you build 3D user interfaces in Three.js (https://github.com/felixmariotto/three-mesh-ui)

This library simply ties together several well known, capable javascript libraries resulting in a powerful yet simple game engine.

![Screenshot](docs/images/three-game-engine.png)

## The Vision
 - to make it easy to tie together 3 great javascript libraries: ThreeJS, Rapier3D, and three-mesh-ui to create a versatile, easy to use 3D game engine.
 - to allow javascript lovers to easily jump into game development, using tools and libraries familiar to them.
 - to offer a 100% free engine that can be used by anyone to build personal or comercial apps/games.
 - maintain source code that is highly readable, and extendable
 - to offer VR support


# Architecture
This game engine allows you to manage a Scene of GameObjects.
Each GameObject controls a Group in the ThreeJS scene graph, and can optionally be associated with a Rapier RigidBody with colliders.

![Screenshot](docs/images/three-game-engine-architecture.png)



# Examples
The examples/ folder In this repo contains several simple example apps that that demonstrate features of the engine.
To run the examples in your browser, clone this repo then run:

```
  npm install
  npm run examples
```

# Desktop and Mobile Apps
In addition to using this library to build web apps that run in your browser, 
with third party tools like electron, cordova, etc. you can easily package and 
distribute your game as a desktop app or mobile app.

This repo contains complete working examples of:
- How to use electron & electron-forge to package your game as a desktop app,
  see [examples/electron](https://github.com/WesUnwin/three-game-engine/tree/main/examples/electron)
- How to package your app as an android or iOS app using Apache Cordova,
  see [examples/cordova](https://github.com/WesUnwin/three-game-engine/tree/main/examples/cordova)

