## Getting started
The best way to way to create a new project is by using the scene editor to boilerplate a new project. The scene editor is not required, but makes it easy to configure your game, and create the various .json files defining scenes, game objects. etc.

## The Scene Editor (Recommended)
See the documentation on running the [scene editor](https://wesunwin.github.io/three-game-engine/#/docs/scene_editor).
You can run the scene editor locally, or use the [online scene editor](https://wesunwin.github.io/three-game-engine/#/editor).

![Scene Editor](https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/scene_editor_small.png)

Once you've created a new project, you can use any source code management software you choose.
Its recommended to the use git or git with large file storage (if needed) to version control and backup your project.

## Manually Creating a New Project (Without the Scene Editor)
Alternatively can choose not to use the scene editor, and manually set up a web app and directly use the three-game-engine npm package.

```
  npm install --save three-game-engine

  or 

  yarn add three-game-engine
```

You typically use this library by importing classes from the three-game-engine, then instantiate a Game object that is pointed to your project folder (containing all assets, scene json files, and a game.json file).

```
import { Game } from "three-game-engine";

// The base URL points to your project folder, and is used to load assets, scene JSON files. etc.
// You can alternatively use a file:// URL to refer to local files (useful for electron and cordova apps.)
const baseURL = "https://your_project_folder" 

// Create a game object pointing to the project folder, which must contain a game.json file
const game = new Game(baseURL, {
  rendererOptions: {
    setupFullScreenCanvas: true // automatically create an HTML Canvas element, and stretch it to the size of the viewport
  },
  inputOptions: {
    mouseOptions: {
      usePointerLock: true
    }
  }
});

// Starts the game rendering loop, the initial scene indicated by "initialScene" in your game.json file will be loaded.
// You could later switch to other scenes using game.loadScene("sceneName").
game.play(); 

```

Your project folder must contain a game.json file directly in the root directory:
```
{
  "initialScene": "MainMenu",
  "scenes": {
    "MainMenu": "scenes/MainMenu.json"
  }
}
```

This file in turn points to scene JSON files, game object type files, asset files, etc.
All the paths are relative to your project folder (the base URL passed into new Game(...)).
