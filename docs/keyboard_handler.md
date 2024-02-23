## Keyboard Handler
The keyboard handler manages keyboard input, allowing to read the state of the user's keyboard.

### isKeyDown()
Returns true if the given keyboard key is currently pressed.

```
  isKeyDown(key: string): boolean

  // Returns true if the given key is down.
  // Eg. game.inputManager.keyboardHandler.isKeyDown("ArrowUp")
```

### isShiftDown()
Returns true if any shift key is currently down.

```
  isShiftDown(): boolean
```