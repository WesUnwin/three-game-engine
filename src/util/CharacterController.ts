import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import GameObject from "../GameObject"

const defaultControllerOptions = {
    capsule: {
        halfHeight: 0.45,
        radius: 0.4,
        density: 500
    }
}

class CharacterController extends GameObject {
    controllerOptions: {
        capsule: {
            halfHeight: number,
            radius: number
        }
    };
    lastJumpTime: number = 0;
    jumpCooldown: number = 1500; // in millisec
    jumpImpulse: number = 1300;

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

    getDesiredTranslation(): THREE.Vector3 {
        const keyboard = this.getScene().game.inputManager.keyboard;

        const movementSpeed = 0.1;

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
        desiredMovementVector.multiplyScalar(movementSpeed);

        return desiredMovementVector;
    }

    beforeRender({ deltaTimeInSec, time }) {

    }
}

export default CharacterController