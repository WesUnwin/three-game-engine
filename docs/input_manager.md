## Input Handling
The game object has an InputManager (game.inputManager) that is responsible for using various input handling classes to aggregate input from the user's mouse, keyboard, and game pads.

```
  game.inputManager // refers to the InputManager instance

  game.inputManager.keyboardHandler // See [keyboard handler](https://wesunwin.github.io/three-game-engine/#/docs/keyboard_handler).
  game.inputManager.mouseHandler // See [mouse handler](https://wesunwin.github.io/three-game-engine/#/docs/mouse_handler)
  game.inputManager.gamepadHandler // see [gamepad handler](https://wesunwin.github.io/three-game-engine/#/docs/gamepad_handler)
```

### readVerticalAxis()
This function aggregates keyboard and game pad input to perform the common task of creating an abstract vertical axis (-1.0 representing backwards, and 1.0 representing the forward direction).

```
readVerticalAxis() // returns a value from -1.0 (backwards) to 1.0 (forward)

// Pressing "w" or the "up" arrow key on your keyboard,
// or pressing the primary analogue stick forward, or the up key on a game pad's D pad,
// will result in this value being closer to -1.0 (forward into the camera along the z-axis)

// Pressing "s" or the "down" arrow key on your keyboard,
// or pressing the primary analogue stick backwards, or the down key on a game pad's D pad,
// will result in this value being closer to 1.0 (backwards, along the z-axis)
```

### readHorizontalAxis()
This function aggregates keyboard and game pad input to perform the common task of creating an abstract horizontal axis (-1.0 representing left, and 1.0 representing the right direction).

```
readHorizontalAxis() // returns a value from -1.0 (left) to 1.0 (right)

// Pressing "a" or the "left" arrow key on your keyboard,
// or pressing the primary analogue stick to the left, or the left key on a game pad's D pad,
// will result in this value being closer to -1.0

// Pressing "d" or the "right" arrow key on your keyboard,
// or pressing the primary analogue stick to the right, or the right key on a game pad's D pad,
// will result in this value being closer to 1.0 
```