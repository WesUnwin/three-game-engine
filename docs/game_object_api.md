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
| getGameObject(fn)                                     | Returns the first game object where the function fn(gameObject) returns true. |
| getGameObjects(fn)                                  | Returns an array of game objects where the given function fn(gameObject) returns true. |
| getGameObjectWithName(name)                             | Returns the first descendent game object with the given name.                    |
| getGameObjectsWithTag(tag)                            | Returns an array of all descendent game objects that have the given tag.        |