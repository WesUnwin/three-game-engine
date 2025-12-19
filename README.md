<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
![NPM Version](https://img.shields.io/npm/v/three-game-engine?style=for-the-badge)
[![MIT License][license-shield]][license-url]
[![Stargazers][stars-shield]][stars-url]
[![Forks][forks-shield]][forks-url]
[![Contributors][contributors-shield]][contributors-url]
![NPM Downloads](https://img.shields.io/npm/dm/three-game-engine?style=for-the-badge)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/WesUnwin/three-game-engine.svg?style=for-the-badge
[contributors-url]: https://github.com/WesUnwin/three-game-engine/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/WesUnwin/three-game-engine.svg?style=for-the-badge
[forks-url]: https://github.com/WesUnwin/three-game-engine/network/members
[stars-shield]: https://img.shields.io/github/stars/WesUnwin/three-game-engine.svg?style=for-the-badge
[stars-url]: https://github.com/WesUnwin/three-game-engine/stargazers
[license-shield]: https://img.shields.io/github/license/WesUnwin/three-game-engine.svg?style=for-the-badge
[license-url]: https://github.com/WesUnwin/three-game-engine/blob/main/LICENSE.txt

<br />
<div align="center">
![Logo](https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/logo.png)

  <h3 align="center">three-game-engine</h3>

  <p align="center">
    The ThreeJS game engine, featuring the Rapier physics engine.
    <br />
    <a href="https://wesunwin.github.io/three-game-engine/"><strong>Website »</strong></a>
    <br />
    <br />
    <a href="https://wesunwin.github.io/three-game-engine/#/docs">
      Docs
    </a>
    |
    <a href="https://wesunwin.github.io/three-game-engine/#/examples">Demo</a>
    |
    <a href="https://wesunwin.github.io/three-game-engine/#/editor">
      Scene Editor
    </a>
    |
    <a href="https://github.com/WesUnwin/three-game-engine/issues">Report Bug</a>
    |
    <a href="https://github.com/WesUnwin/three-game-engine/issues">Request a Feature</a>
  </p>
</div>


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#why-use-this-engine">Why use this engine?</a></li>
        <li><a href="#the-vision">The Vision</a></li>
      </ul>
    </li>
    <li><a href="#scene-editor">Scene Editor</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#desktop-and-mobile-apps">Desktop and Mobile Apps</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## About The Project

This library simply ties together several well known, very capable javascript libraries resulting in a powerful yet simple game engine. These dependencies are minimal and fully open-source.

* [Three.js](https://github.com/mrdoob/three) - a 3D WebGL-based Graphics Engine
* [Rapier](https://github.com/dimforge/rapier.js) - a 3D Physics Engine
* [three-mesh-ui](https://github.com/felixmariotto/three-mesh-ui) - Lets you build 3D user interfaces in Three.js

![Screenshot](docs/images/three-game-engine.png)

Although a web-first game engine, you can very easily package and distribute apps/games using this as desktop apps or mobile using electron, cordova or other libraries (examples of how to do this are included in the examples/ folder).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Why Use this Engine?

This engine is open source, light weight, very readable (seriously check out the source code :) ), it's totally free and allows you to use tools and techniques that web developers are familiar with like javascript/typescript/webpack/json files/etc. Furthermore its very actively maintained and gaining momentum. It's great for rapid prototyping, and developers familiar with three.js and web tools will transition into this quickly.

*Why not just use Three.js?*
- ThreeJS is designed to be a graphics engine, its stops short of providing all the things games need:
  - Asset management
  - Input aggregation and abstraction
  - User interfaces
  - Physics
  - Other utilities (eg. Character Controllers, A.I. Path Finding, etc.)

Compared to the Three.js scene editor:
- This allows you to compose and manage a game with multiple scenes
- Allows you to generalize GameObjects into types (prefabs)
- Externalizes and allows for re-use of assets like gltfs, textures, sounds, etc.
- Allows you to control the physics characteristics of game engines.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### The Vision

* To provide a web-first game engine, for developers that love javascript/typescript (but with support for building desktop and mobile apps)
* to offer a 100% free engine that can be used by anyone to build personal or comercial apps/games.
* maintain source code that is highly readable, and extendable
* to offer VR support

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Scene Editor

This game engine comes with a well-equiped scene editor that allows you to compose scenes with game objects.

Your game and scenes are described by a project folder containing .json files that can be manually edited or opened in the scene editor.

The scene editor also allows you to quickly boilerplate a new project also.

You can run the scene editor locally by cloning this repo and:
```sh
  npm install
  npm run scene_editor
```

OR

Use the online scene editor [here](https://wesunwin.github.io/three-game-engine/#/editor)

![Scene Editor](https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/scene_editor.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Architecture
This game engine allows you to manage a Scene of GameObjects.
Each GameObject controls a Group in the ThreeJS scene graph, and can optionally be associated with a Rapier RigidBody with colliders.

![Screenshot](docs/images/three-game-engine-architecture.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Documentation

View the MD files in the docs/ folder of this repo, or checkout the [online documentation](https://wesunwin.github.io/three-game-engine/#/docs).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Desktop and Mobile Apps
In addition to using this library to build web apps that run in your browser, 
with third party tools like electron, cordova, etc. you can easily package and 
distribute your game as a desktop app or mobile app.

This repo contains complete working examples of:
- How to use electron & electron-forge to package your game as a desktop app,
  see [examples/electron](https://github.com/WesUnwin/three-game-engine/tree/main/examples/electron)
- How to package your app as an android or iOS app using Apache Cordova,
  see [examples/cordova](https://github.com/WesUnwin/three-game-engine/tree/main/examples/cordova)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contributing

Your feedback and contributions are welcome! Let's make this engine great, PRs are welcome, for large contributions or new features it is recommended to contact me in advance. All issues, PRs and feedback will be responded to - I greatly appreciate and value your contributions!

Don't forget to give the project a star! Thanks again!

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contact

Wes Unwin - wes_unwin@hotmail.com

Project Link: [https://github.com/WesUnwin/three-game-engine](https://github.com/WesUnwin/three-game-engine)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

