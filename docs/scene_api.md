## Scene API
A game is developed as set of Scenes. The game can actively render just one scene (or none) at a given time.
Scenes can represent different levels, areas, menus, hubworlds, or even loading screens in a game.
A Scene internally manages a Three.js Scene object.

| Function                                     | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| addGameObject(gameObject)                    | Adds the given GameObject to the scene.                                         |
| removeGameObject(gameObject)                 | Removes the given GameObject from the scene.                                     |
| getRootGameObjects()                         | Returns all top level game objects in the scene.                                 |
| getGameObject(fn)                                     | Returns the first game object where the function fn(gameObject) returns true.     |
| getGameObjects(fn)                                  | Returns an array of game objects where the given function fn(gameObject) returns true. |
| getGameObjectWithName(name)                             | Returns the first game object in the scene with the given name.                   |
| getGameObjectsWithTag(tag)                            | Returns all game objects in the scene that have the given.                        |
