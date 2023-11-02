import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import GamepadHandler from "./GamepadHandler";
import { InputOptions } from "../types";

const defaultOptions = {
    wsadMovement: true
};

class InputManager {
    options: InputOptions;
    keyboard: Keyboard;
    mouse: Mouse;
    gamepadHandler: GamepadHandler;

    constructor(canvas: HTMLCanvasElement, options = {}) {
        this.options = Object.assign({}, defaultOptions, options);
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(canvas);
        this.gamepadHandler = new GamepadHandler();
    }

    beforeRender() {
        this.gamepadHandler.readGamepads();
    }

    // Returns a value from -1.0 to 1.0 based on keyboard input, gamepad input, etc.
    readVerticalAxis(): number {
        if (this.options.wsadMovement) {
            if (this.keyboard.isKeyDown('w') || this.keyboard.isKeyDown('ArrowUp')) {
                return -1.0;
            }
        }

        if (this.keyboard.isKeyDown('s') || this.keyboard.isKeyDown('ArrowDown')) {
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
            if (this.keyboard.isKeyDown('a') || this.keyboard.isKeyDown('ArrowLeft')) {
                return -1.0;
            }
        }

        if (this.keyboard.isKeyDown('d') || this.keyboard.isKeyDown('ArrowRight')) {
            return 1.0;
        }

        if (this.gamepadHandler.anyGamepadConnected()) {
            return this.gamepadHandler.readHorizontalAxis();
        }

        return 0.0;
    }
}

export default InputManager;