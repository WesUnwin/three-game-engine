import Keyboard from "./Keyboard";
import Mouse from "./Mouse";

class InputManager {
    keyboard: Keyboard;
    mouse: Mouse;

    constructor(canvas: HTMLCanvasElement) {
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(canvas);
    }
}

export default InputManager;