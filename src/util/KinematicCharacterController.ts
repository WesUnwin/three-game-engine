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

class KinematicCharacterController extends GameObject {
    controllerOptions: {
        capsule: {
            halfHeight: number,
            radius: number
        }
    };
    lastJumpTime: number = 0;
    jumpCooldown: number = 1500; // in millisec
    jumpImpulse: number = 1300;
    rapierCharacterController: RAPIER.KinematicCharacterController;

    constructor(parent, options, controllerOptions = defaultControllerOptions) {
        super(parent, {
            rigidBody: {
                type: 'dynamic',
                colliders: [
                    { type: 'capsule', ...Object.assign({}, defaultControllerOptions.capsule, controllerOptions.capsule) }
                ],
                enabledRotations: { x: false, y: true, z: false }
            },
            ...options // merge with any passed in GameObjectOptions
        })
        this.controllerOptions = Object.assign({}, defaultControllerOptions, controllerOptions);

        this.lastJumpTime = 0;
    }

    afterLoaded(): void {
        const rapierWorld = this.getRapierWorld();
        this.rapierCharacterController = rapierWorld.createCharacterController(0.2);
    }

    beforeRender({ deltaTimeInSec, time }) {
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

        if (desiredMovement.x != 0 || desiredMovement.y != 0 || desiredMovement.z != 0) {
            const desiredMovementVector = new THREE.Vector3(desiredMovement.x, desiredMovement.y, desiredMovement.z);
            desiredMovementVector.normalize();

            // Make it so "forward" is in the same direction as where the character faces
            const playerRotation = this.threeJSGroup.rotation;
            desiredMovementVector.applyAxisAngle(new THREE.Vector3(0,1,0), playerRotation.y);

            desiredMovementVector.multiplyScalar(movementSpeed);

            const collider = this.rapierRigidBody.collider(0);
            this.rapierCharacterController.computeColliderMovement(collider, desiredMovementVector);

            const correctedMovement = this.rapierCharacterController.computedMovement();

            const translation = this.rapierRigidBody.translation();
            this.rapierRigidBody.setTranslation({
                x: translation.x + correctedMovement.x,
                y: translation.y + correctedMovement.y,
                z: translation.z + correctedMovement.z
            }, true);
        }

        // Jump mechanics
        if (keyboard.isKeyDown(' ')) {
            const timeSinceLastJump = time - this.lastJumpTime;
            if (timeSinceLastJump > this.jumpCooldown) {
                const rapierWorld = this.getRapierWorld();
                const currentPosition = this.rapierRigidBody.translation();

                // Point just below the capsulate collider
                const rayOrigin = { 
                    x: currentPosition.x,
                    y: currentPosition.y - this.controllerOptions.capsule.halfHeight - this.controllerOptions.capsule.radius - 0.05,
                    z: currentPosition.z
                };

                const rayDirection = { x: 0, y: -0.1, z: 0 }; // downwards
                const ray = new RAPIER.Ray(rayOrigin, rayDirection);
                const groundHit = rapierWorld.castRay(ray, 0.01, true);

                const isFalling = this.rapierRigidBody.linvel().y < -0.1;
                if (groundHit && !isFalling) {
                    // There is ground below the character, so the player can indeed initate a jump
                    this.rapierRigidBody.applyImpulse(new THREE.Vector3(0, this.jumpImpulse, 0), true);
                    this.lastJumpTime = time;
                }
            }
        }
    }
}

export default KinematicCharacterController;