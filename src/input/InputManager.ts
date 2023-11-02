import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import GamepadHandler from "./GamepadHandler";

class InputManager {
    keyboard: Keyboard;
    mouse: Mouse;
    gamepadHandler: GamepadHandler;

    constructor(canvas: HTMLCanvasElement) {
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(canvas);
        this.gamepadHandler = new GamepadHandler();
    }
}

export default InputManager;