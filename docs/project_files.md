## Project Files
Your game (a project) consists of a folder of various project files.
Some of these will .json files defining things like scenes, types of game objects, etc.
Some of them may be asset files like GTLFs, sound files, etc.

### Base URL
When constructing a game, you pass in a URL (the base URL) which points to your project folder. This URL can use the file:// scheme or http, https:// etc.

```
// Pass in the base URL
const game = new Game('file://your_project_folder/') // or use an http/https URL if desired

// the base URL should point to your project folder (containing your game.json and other files)
```

### game.json File
Your project folder must contain a game.json file located in the root directory.
This file points to all your scene files, which in turn reference game object types, and other asset files.

See docs on [game.json](https://wesunwin.github.io/three-game-engine/#/docs/game_json)

### Asset Paths
GameObjects and Scenes can reference various asset files such as GLTFs (models and animation data), sound effects, etc. These files are automatically loaded into the game's asset store (game.assetStore)
as needed when a scene is loaded (game.loadScene()).

Assets are typically referred to by an asset path, which is a file path relative to the game's base URL. (First argument to the Game object's constructor).

```
// An asset path of "models/tree.glb" thus will be assumed to be available for fetching at:
// "file://your_project_folder/models/tree.glb"
```

