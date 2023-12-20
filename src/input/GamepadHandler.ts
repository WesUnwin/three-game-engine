class GamepadHandler {
    gamepads: (Gamepad | null)[]; // can be null if disconnected during the session
    apiSupported: boolean;

    constructor() {
        this.gamepads = [];
        this.apiSupported = this.isGamepadAPISupported();
        if (this.apiSupported) {
            console.debug('GamepadHandler: navigator.getGamepads() API is supported');
            this.setup();
        } else {
            console.warn('GamepadHandler: navigator.getGamepads() API NOT supported');
        }
    }

    isGamepadAPISupported() {
        return typeof navigator != 'undefined' && 'getGamepads' in navigator;
    }

    setup() {
        if (typeof window != 'undefined' && 'addEventListener' in window) {
            console.debug('GamepadHandler: adding gamepadconnected and gamepaddisconnected event listeners...');
            window.addEventListener('gamepadconnected', this._onGamePadConnected);
            window.addEventListener('gamepaddisconnected', this._onGamePadDisconnected);
        }
    }

    teardown() {
        if (typeof window != 'undefined' && 'removeEventListener' in window) {
            console.debug('GamepadHandler: removing gamepadconnected and gamepaddisconnected event listeners...');
            window.removeEventListener('gamepadconnected', this._onGamePadConnected);
            window.removeEventListener('gamepaddisconnected', this._onGamePadDisconnected);
        }
    }

    anyGamepadConnected(): boolean {
        return this.gamepads.some(gamepad => gamepad);
    }

    _onGamePadConnected = event => {
        const { gamepad } = event;
        console.debug(`GamePad: gamepad connected at index: ${gamepad.index} id: ${gamepad.id} button count: ${gamepad.buttons.length} axes count: ${gamepad.axes.length}`);
        this.readGamepads();
    }

    _onGamePadDisconnected = event => {
        const { gamepad } = event;
        console.debug(`GamePad: gamepad disconnected at index: ${gamepad.index} id: ${gamepad.id}`);
        this.readGamepads();
    }

    readGamepads() {
        // gets the current state of gamepads PLUS the current state of their buttons and axes
        // this needs to be called each frame of the game in order for this.gamepads and their button/axes states to be up to date
        if (this.apiSupported) {
            const gamepadList = navigator.getGamepads();
            this.gamepads = [];
            for (let g of gamepadList) {
                this.gamepads.push(g)
            }
        }
    }

    readVerticalAxis(): number {
        const amounts = [];
        for (const gamepad of this.gamepads) {
            if (gamepad) {
                const forwardButton = gamepad.buttons[12];
                if (forwardButton) {
                    amounts.push(forwardButton.value * -1.0);
                }

                const backwardButton = gamepad.buttons[13];
                if (backwardButton) {
                    amounts.push(backwardButton.value);
                }
                
                const verticalAxes = [gamepad.axes[1]];
                verticalAxes.forEach(axis => {
                    if (typeof axis != 'undefined') {
                        amounts.push(axis);
                    }
                });
            }
        }

        // Sum all values producing a net axis movement, ignore close to neutral values
        return amounts.filter(amt => Math.abs(amt) > 0.01).reduce((amt, sum) => amt + sum, 0.0);
    }

    readHorizontalAxis(): number {
        const amounts = [];
        for (const gamepad of this.gamepads) {
            if (gamepad) {
                const leftButton = gamepad.buttons[14];
                if (leftButton) {
                    amounts.push(leftButton.value * -1.0);
                }

                const rightButton = gamepad.buttons[15];
                if (rightButton) {
                    amounts.push(rightButton.value);
                }
                
                const horizontalAxes = [gamepad.axes[0]];
                horizontalAxes.forEach(axis => {
                    if (typeof axis != 'undefined') {
                        amounts.push(axis);
                    }
                });
            }
        }

        // Sum all values producing a net axis movement, ignore close to neutral values
        return amounts.filter(amt => Math.abs(amt) > 0.01).reduce((amt, sum) => amt + sum, 0.0);
    }


    print() {
        console.log(`Gamepad count: ${this.gamepads.length}`);
        this.readGamepads(); // must be called here, to get the fresh/current state of all buttons and axes
        this.gamepads.forEach((gamepad, index) => {
            console.log(`GamePad: gamepad at index: ${index}: ${gamepad === null ? '(NULL)' : gamepad.id}`);
            if (gamepad) {
                gamepad.buttons.forEach((button, buttonIndex) => {
                    console.log(`==> button ${buttonIndex} - pressed: ${button.pressed} value: ${button.value}`);
                });
                gamepad.axes.forEach((axis, axisINdex) => {
                    // An analogue stick typically has 2 axes: one for the horizontal location of the stick, one for the vertical.
                    // The position value typically goes from -1.0 to 1.0 left to right, or top to bottom.
                    // Axis 1 and 2 might be the left stick, axis 3 and 4 might be the right stick like with my Logitech Wireless Gamepad F710
                    console.log(`==> axis ${axisINdex} - position: ${axis.toFixed(4)}`);
                });
            }
        });
        // Example based on my Logitech Wireless Gamepad F710
        //   Button 0   A Button                     when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 1   B Button                     when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 2   X Button                     when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 3   Y Button                     when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.

        //   Button 4   Upper left Trigger Button    when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 5   Upper right Trigger Button   when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.

        //   Button 6   Lower left Trigger Button    when pressed "pressed" property is true.    Value varies from 0 (not at all pressed) to 1 fully pressed.
        //   Button 7   Lower right Trigger Button   when pressed "pressed" property is true.   Value varies from 0 (not at all pressed) to 1 fully pressed.

        //   Button 8   Back button                  when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 9   Start button                 when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.

        //   Button 10  Left Stick Pressed           when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 11  Right Stick Pressed          when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.

        //   Button 12  D-Pad Up                     when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 13  D-Pad Down                   when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 14  D-Pad Left                   when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.
        //   Button 15  D-Pad Right                  when pressed "pressed" property is true, value is 1, elswise pressed is false, value is 0.

        //   Axis 0:   Left Analog Stick, Horizontal Axis     Leftmost position: -1.0   Rightmost position:  1.0
        //   Axis 1:   Left Analog Stick, Vertical Axis       Topmost position:  -1.0   Bottommost position: 1.0
        //   Axis 2:   Right Analog Stick, Horizontal Axis    Leftmost position: -1.0   Rightmost position:  1.0
        //   Axis 3:   Right Analog Stick, Vertical Axis      Topmost position:  -1.0   Bottommost position: 1.0
    }
}

export default GamepadHandler;