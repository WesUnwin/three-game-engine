import KeyboardHandler from "./KeyboardHandler";
import MouseHandler from "./MouseHandler";
import GamepadHandler from "./GamepadHandler";
import { InputOptions } from "../types";

const defaultOptions = {
    wsadMovement: true
};

class InputManager {
    options: InputOptions;
    keyboardHandler: KeyboardHandler;
    mouseHandler: MouseHandler;
    gamepadHandler: GamepadHandler;

    constructor(canvas: HTMLCanvasElement, options = {}) {
        this.options = Object.assign({}, defaultOptions, options);
        this.keyboardHandler = new KeyboardHandler();
        this.mouseHandler = new MouseHandler(canvas);
        this.gamepadHandler = new GamepadHandler();
    }

    beforeRender() {
        this.gamepadHandler.readGamepads();
    }

    // Returns a value from -1.0 to 1.0 based on keyboard input, gamepad input, etc.
    readVerticalAxis(): number {
        if (this.options.wsadMovement) {
            if (this.keyboardHandler.isKeyDown('w') || this.keyboardHandler.isKeyDown('ArrowUp')) {
                return -1.0;
            }
        }

        if (this.keyboardHandler.isKeyDown('s') || this.keyboardHandler.isKeyDown('ArrowDown')) {
            return 1.0;
        }

        if (this.gamepadHandler.anyGamepadConnected()) {
            return this.gamepadHandler.readVerticalAxis();
        }

        return 0.0;
    }

    // Returns a value from -1.0 to 1.0 based on keyboard input, gamepad input, etc.
    readHorizontalAxis(): number {
        if (this.options.wsadMovement) {
            if (this.keyboardHandler.isKeyDown('a') || this.keyboardHandler.isKeyDown('ArrowLeft')) {
                return -1.0;
            }
        }

        if (this.keyboardHandler.isKeyDown('d') || this.keyboardHandler.isKeyDown('ArrowRight')) {
            return 1.0;
        }

        if (this.gamepadHandler.anyGamepadConnected()) {
            return this.gamepadHandler.readHorizontalAxis();
        }

        return 0.0;
    }
}

export default InputManager;