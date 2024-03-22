class KeyboardHandler {
    pressedKeys = {};
    shiftIsDown: boolean = false;

    constructor() {
        this.pressedKeys = {};
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', event => {
                this.pressedKeys[event.key.toLowerCase()] = true;
                this.shiftIsDown = event.shiftKey;
            });
            window.addEventListener('keyup', event => {
                this.pressedKeys[event.key.toLowerCase()] = false;
                this.shiftIsDown = event.shiftKey;
            });
        }
    }

    isKeyDown(key: string): boolean {
        return this.pressedKeys[key] || false;
    }

    isShiftDown(): boolean {
        return this.shiftIsDown;
    }
}

export default KeyboardHandler;