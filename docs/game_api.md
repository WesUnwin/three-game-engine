## Game API
This is the top-level object that you typically create and configure just once.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| new Game(baseURL)                            | Creates a new game, reading the options specified in the game.json file found at the given base URL. |
| async loadScene(sceneName)                    | Async function that loads and switches to rendering the scene with the given name. |
| play()                                       | Starts (or resumes) rendering of the game, rendering the currently loaded scene. |
| pause()                                      | Pauses rendering of the game till play() is called again.                        |
| async loadAsset(assetPath)                   | Tells game.assetStore to fetch a given asset (such a .gltf/glb file) and store it for future use. Assets needed by GameObjects are automatically, loaded when the GameObject is loaded into a scene, but this can be used to make assets ready in advance. |
| getAssetStore()                              | Returns the asset store instance game.assetStore used by this game object.       |