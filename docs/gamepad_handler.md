## Gamepad Handler
The gamepad handler is responsible for aggregating input from one or more gamepads the user may have connected.
This abstracts out using the underlying navigator.getGamepads() related javascript APIs.

The gamepad handler automatically reads and caches the state of all gamepads and their buttons and axes, once before each frame of the game.

This information is storred in an array of objects on the gamepadHandler:
```
  game.inputManager.gamepadHandler.gamepads
```
You can manually read ```.gamepads``` or use one of the helper functions mentioned below.

### anyGamepadConnected()
Returns true if there is one or more game pads available for the app to interact with. Users will have to have a gamepad connected to their computer and will have to interact with it by pressing a button while the app has focus.

```
  anyGamepadConnected(): boolean
```

### Button Names
The following strings represent all valid button names of a standard gamepad.
These strings are in order of the corresponding button indices. (Button "A" is the button with index 0).

```
['A','B','X','Y','UpperLeftTrigger','UpperRightTrigger','LowerLeftTrigger','LowerRightTrigger','Back','Start','LeftStick','RightStick','Up','Down','Left','Right'];
```

### isButtonPressed()
Returns true if the given button is currently pressed (down).

You can pass a button index (a number from 0 to 15), or instead you can pass a string (the button's name).

```
  isButtonPressed(button: number | string): boolean
```

### readButtonValue()
This returns a numeric value from 0 (not pressed) to 1.0 (fully pressed) representing the state of the given button. This is useful for working with trigger style buttons that can be partially pressed. For regular buttons this will return either 0 or 1.

You can pass a button index (a number from 0 to 15), or instead you can pass a string (the button's name).

```
  readButtonValue(button: number | string): number
```

### readAxisValue()
Reads the current value of the specified axis, of the first connected game pad. This returns a value from -1.0 to 1.0.
Axes typically represent things like analogue control sticks on the game pad. Many game pads will have to analog sticks, each with a vertical and horizontal axis.

```
readAxisValue(axisIndex: number): number

// axisNumber:
// Axis 0:   Left Analog Stick, Horizontal Axis
// Axis 1:   Left Analog Stick, Vertical Axis
// Axis 2:   Right Analog Stick, Horizontal Axis
// Axis 3:   Right Analog Stick, Vertical Axis
```

### readVerticalAxis()
Aggregates input from the D-Pad up/down buttons and primary analog stick's vertical axis producing a value from -1.0 (representing fully forward) to 1.0 (representing fully backwards).
Aggregates input from any/all connected game pads.

```
  readVerticalAxis(): number
```

### readHorizontalAxis()
Aggregates input from the D-Pad left/right buttons and the primary analog stick's horizontal axis producing a value from -1.0 (representing fully towards left) to 1.0 (representing fully towards right).
Aggregates input from any/all connected game pads.

```
  readHorizontalAxis(): number
```

### print()
For debugging purposes, console.log()s the state of all connected gamepads and their buttons and axes.