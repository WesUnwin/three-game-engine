import Keyboard from "./Keyboard";

class InputManager {
    keyboard: Keyboard;

    constructor() {
        this.keyboard = new Keyboard();
    }
}

export default InputManager;