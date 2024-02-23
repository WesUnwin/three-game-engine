## Mouse Handler
The mouse handler is a property of game.inputManager that is responsible for collecting and simplifying the task of interacting with the user's pointing devices (mouse/trackpad/etc.).

### Pointer Lock
When ```inputOptions.mouseOptions.usePointerLock``` is set in your game options, the mouse handler will automatically request a pointer lock meaning that your will continuously be able to detect mouse movement regardless of whether the mouse is over the canvas or not.

### getPointerX
Returns a value indicating the pointer's horizontal position in pixels, where negative values represent movement to the left, positive amounts represent movement to the right.

```
  getPointerX(): number

  // Eg. game.inputManager.mouseHandler.getPointerX()
```

### getPointerY
Returns a value indicating the pointer's vertical position in pixels, where negative values represent movement upwards, positive amounts represent movement downwards.

```
  getPointerY(): number

  // Eg. game.inputManager.mouseHandler.getPointerY()
```