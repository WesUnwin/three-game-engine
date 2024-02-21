# GameObject Classes
A GameObject type can also be (optionally) associated with a GameObject sub-class.

Use game.registerGameObjectClasses() to link your javascript GameObject class to a type of
GameObject:

```
  game.registerGameObjectClasses({
    player: PlayerGameObject, 
    type2: Class2,
    ...
  })

  // Explanation: game objects of type "player" will be instantiated 
  // using your PlayerGameObject class, game objects of type "type2"
  // will use Class2, etc.
```

This allows you to add scripting / behavior to your game objects:

```
  class PlayerGameObject extends GameObject {
      afterLoaded() {
        // called once when this GameObject and its scene gets loaded
        this.y = 0;
      }

      beforeRender({ deltaTimeInSec }) {
        // Called once per frame
        this.setRotation(0, this.y, 0);
        this.y += 1 * deltaTimeInSec;
      }
  }
```