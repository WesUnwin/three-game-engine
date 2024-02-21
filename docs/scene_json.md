# Scene JSON files
Scenes are defined by a JSON file, that controls the layout of a hierarchy of game objects.

```
{
  "gameObjects": [
    // You can define individual, unique GameObjects like this:
    { 
      "name": "ground",
      "models": [
        { "assetPath": "models/ground.glb" }
      ],
      "lights": [
        { "type": "AmbientLight", "intensity": 0.5 }
      ],
      "position": { "x": 5, "y": 0, "z": 0 }
    },

    // OR you can create a game object of a given "type",
    // which will inherit all the properties of the game object type's .json file
    // declared for this type in your game.json file.
    { 
      "type": "player",
      "position": { "x": 5, "y": 0, "z": 0 }
    }
  ]
}
```