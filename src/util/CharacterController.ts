import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import GameObject from "../GameObject"
import { CharacterControllerOptions } from '../types';

const defaultControllerOptions: CharacterControllerOptions = {
    walkingSpeed: 1.5,
    runningSpeed: 3,
    jumpCooldown: 1500
}

class CharacterController extends GameObject {
    controllerOptions: CharacterControllerOptions;
    lastJumpTime: number = 0;

    constructor(parent, options, controllerOptions = defaultControllerOptions) {
        super(parent, {
            ...options // merge with any passed in GameObjectOptions
        })
        this.controllerOptions = Object.assign({}, defaultControllerOptions, controllerOptions);
        this.lastJumpTime = 0;
    }

    afterLoaded(): void {
    }

    getDesiredYaw(): number {
        const inputManager = this.getScene().game.inputManager;
        const mouse = inputManager.mouse;
        return mouse.getPointerX() / -250.0; 
    }

    getDesiredPitch(): number {
        const inputManager = this.getScene().game.inputManager;
        const mouse = inputManager.mouse;
        return mouse.getPointerY() / -250.0; 
    }

    getDesiredTranslation(deltaTimeInSec: number): THREE.Vector3 {
        const keyboard = this.getScene().game.inputManager.keyboard;

        // meters per sec
        const movementSpeed = keyboard.isShiftDown() ? this.controllerOptions.runningSpeed : this.controllerOptions.walkingSpeed;

        const movementAmount = movementSpeed * deltaTimeInSec;

        const [w, s, a, d] = ['w', 's', 'a', 'd'].map(key => keyboard.isKeyDown(key));

        const desiredMovement = { x: 0, y: 0, z: 0 };
        if (w) {
            desiredMovement.z -= 1;
        }
        if (s) {
            desiredMovement.z += 1;
        }
        if (a) {
            desiredMovement.x -= 1;
        }
        if (d) {
            desiredMovement.x += 1;
        }

        const desiredMovementVector = new THREE.Vector3(desiredMovement.x, desiredMovement.y, desiredMovement.z);

        desiredMovementVector.normalize();
        desiredMovementVector.multiplyScalar(movementAmount);

        return desiredMovementVector;
    }

    beforeRender({ deltaTimeInSec, time }) {

    }
}

export default CharacterController