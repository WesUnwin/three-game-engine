import { MouseOptions } from "../types";

class MouseHandler {
    canvas: HTMLCanvasElement;
    pointerX: number;
    pointerY: number;
    options: MouseOptions;

    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.pointerX = 0;
        this.pointerY = 0;
        this.options = options;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        if (this.options.usePointerLock) {
            this.canvas.addEventListener("click", () => {
                this.canvas.requestPointerLock();
            });
        }

        const onMouseMove = (event: MouseEvent) => {
            // movementX the delta value of how much the point moved horizontally in pixels, negative is to the left, positive amounts are towards the right
            // movementY the delta value of how much the point moved vertically in pixels, negative is upwards, positive is downwards.
            this.pointerX += event.movementX;
            this.pointerY += event.movementY;
        };

        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement == this.canvas) {
                console.log('Mouse: canvas element has pointer lock');
                document.addEventListener("mousemove", onMouseMove, false);
            } else {
                console.log('Mouse: canvas element lost pointer lock');
                document.removeEventListener("mousemove", onMouseMove, false);
            }
        });
    }

    getPointerX(): number {
        return this.pointerX;
    }

    getPointerY(): number {
        return this.pointerY;
    }
}

export default MouseHandler;