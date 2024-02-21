## Assets
GameObjects and Scenes can reference various asset files such as GLTFs (models and animation data), sound effects, etc. These files are automatically loaded into the game's asset store (game.assetStore)
as needed when a scene is loaded (game.loadScene()).

Assets are typically referred to by an asset path, which is a file path relative to the game's base URL. (First argument to the Game object's constructor).


```
// Pass in the base URL
const game = new Game('file://your_project_folder/') // or use an http/https URL if desired

// the base URL should point to your project folder (containing your game.json and other files)

// All asset paths are relative to this URL
```
