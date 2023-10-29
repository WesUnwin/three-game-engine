class Keyboard {
    pressedKeys = {};

    constructor() {
        this.pressedKeys = {};
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', event => {
                this.pressedKeys[event.key] = true;
            });
            window.addEventListener('keyup', event => {
                this.pressedKeys[event.key] = false;
            });
        }
    }

    isKeyDown(key: string): boolean {
        return this.pressedKeys[key] || false;
    }
}

export default Keyboard;