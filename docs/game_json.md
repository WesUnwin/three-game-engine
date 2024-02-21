## game.json files
Every project should have exactly one file called game.json locate in the root of your project folder. This file defines top-level settings and points to external scene json files which define the scenes of your game.

This file is automatically created for you when creating a project using the scene editor.

The game.json file indicates which scene is the initial scene - the scene that will be automatically loaded when starting to run the game.

This file controls game-level settings, and points to a series of scenes each described by a separate JSON file.

```
{
  "rendererOptions": { ... }, // optional, see RendererOptions
  "assetOptions": { ... }, // optional, see AssetOptions

  "initialScene": "mainMenu",

  // A game contains a series of scenes that you can switch between (See Scene JSON files)
  "scenes": {
    "mainMenu": "scenes/main_menu.json",
    "loadingScene": "scenes/loading.json",
    "scene1": "scenes/scene1.json"
  },

  // Scene JSON files can create game objects of several predefined "types"
  "gameObjectTypes": {
    "player": "game_objects/player.json"
  },
}
```

### RendererOptions

| Property                     | Description                                                                                       |
| -----------------------------| ------------------------------------------------------------------------------------------------- |
| .width                       | The width in pixels to be applied to the ThreeJS WebGL renderer.                                  |
| .height                      | The height in pixels to be applied to the ThreeJS WebGL renderer.                                 |
| .pixelRatio                  | The pixelRatio in pixels to be applied to the ThreeJS WebGL renderer, most apps pass in window.devicePixelRatio  |
| .cameraOptions               | See CameraOptions below                                                                           |
| .setupFullScreenCanvas       | If true, a canvas HTML element will automatically be created and added to the DOM, stretched to fill the window, and be used by ThreeJS to render onto.  |

### AssetOptions

| Property                  | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| .retainAssetsBetweenScene | (default: false) if true the game's assetstore will not clear assets when loading a scene, which can make switching back to scenes already loaded quicker, and loading scenes with assets used in previously loaded scenes quicker. |

#### CameraOptions
These values will be passed onto the ThreeJS PerspectiveCamera created automatically by game.renderer.

| Property                 | Description                                                                      |
| -------------------------| -------------------------------------------------------------------------------- |
| .fov                     | Field of view.                                                                   |
| .aspect                  | Aspect ratio                                                                     |
| .near                    | Near value                                                                       |
| .far                     | Far value                                                                        |

