import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import GameObject from "../GameObject"
import { CharacterControllerOptions } from '../types';

const defaultControllerOptions: CharacterControllerOptions = {
    walkingSpeed: 2,
    runningSpeed: 4,
    jumpCooldown: 1000
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

    rayCastToGround(): RAPIER.RayColliderToi {
        const rapierWorld = this.getRapierWorld();
        const currentPosition = this.rapierRigidBody.translation();

        const capsuleHalfHeight = 0.45 + 0.4 //this.controllerOptions.capsule.halfHeight - this.controllerOptions.capsule.radius

        // Point just below the capsulate collider
        const rayOrigin = { 
            x: currentPosition.x,
            y: currentPosition.y - capsuleHalfHeight - 0.01,
            z: currentPosition.z
        };

        const rayDirection = { x: 0, y: -1, z: 0 }; // downwards
        const ray = new RAPIER.Ray(rayOrigin, rayDirection);
        return rapierWorld.castRay(ray, 1, true);
    }

    isOnGround(threshold: number = 0.1): boolean {
        const groundHit = this.rayCastToGround();
        return groundHit ? groundHit.toi < threshold : false;
    }
}

export default CharacterController