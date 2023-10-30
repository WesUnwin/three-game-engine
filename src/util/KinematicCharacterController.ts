import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import CharacterController from './CharacterController';

const defaultCapsuleOptions = {
    halfHeight: 0.45,
    radius: 0.4,
    density: 500
};

/**
 * Based off Rapier's CharacterController, but with more functionality.
 */
class KinematicCharacterController extends CharacterController {
    rapierCharacterController: RAPIER.KinematicCharacterController;

    constructor(parent, options, controllerOptions) {
        super(parent, {
            rigidBody: {
                type: 'kinematicPositionBased',
                colliders: [
                    { type: 'capsule', ...Object.assign({}, defaultCapsuleOptions, ((controllerOptions || {}).capsule || {})) }
                ],
                enabledRotations: { x: false, y: true, z: false }
            },
            ...options // merge with any passed in GameObjectOptions
        }, controllerOptions)
    }

    afterLoaded(): void {
        const rapierWorld = this.getRapierWorld();
        this.rapierCharacterController = rapierWorld.createCharacterController(0.2);
    }

    beforeRender({ deltaTimeInSec, time }) {
        const inputManager = this.getScene().game.inputManager;
        const keyboard = inputManager.keyboard;

        const yawAngle = this.getDesiredYaw();
        const pitchAngle = this.getDesiredPitch();
        const desiredRotation = new THREE.Quaternion();
        desiredRotation.setFromEuler(new THREE.Euler(pitchAngle, yawAngle, 0, 'YXZ'));
        this.rapierRigidBody.setRotation(desiredRotation, true);

        const desiredMovementVector = this.getDesiredTranslation(deltaTimeInSec);

        // Make it so "forward" is in the same direction as where the character faces
        desiredMovementVector.applyQuaternion(desiredRotation);

        // Emulate gravity
        desiredMovementVector.y -= 1;

        const collider = this.rapierRigidBody.collider(0);
        this.rapierCharacterController.computeColliderMovement(collider, desiredMovementVector);

        const correctedMovement = this.rapierCharacterController.computedMovement();

        const translation = this.rapierRigidBody.translation();
        this.rapierRigidBody.setNextKinematicTranslation({
            x: translation.x + correctedMovement.x,
            y: translation.y + correctedMovement.y,
            z: translation.z + correctedMovement.z
        });

        // Jump mechanics
        // if (keyboard.isKeyDown(' ')) {
        //     const timeSinceLastJump = time - this.lastJumpTime;
        //     if (timeSinceLastJump > this.controllerOptions.jumpCooldown) {
        //         const rapierWorld = this.getRapierWorld();
        //         const currentPosition = this.rapierRigidBody.translation();

        //         // Point just below the capsulate collider
        //         const rayOrigin = { 
        //             x: currentPosition.x,
        //             y: currentPosition.y - this.controllerOptions.capsule.halfHeight - this.controllerOptions.capsule.radius - 0.05,
        //             z: currentPosition.z
        //         };

        //         const rayDirection = { x: 0, y: -0.1, z: 0 }; // downwards
        //         const ray = new RAPIER.Ray(rayOrigin, rayDirection);
        //         const groundHit = rapierWorld.castRay(ray, 0.01, true);

        //         const isFalling = this.rapierRigidBody.linvel().y < -0.1;
        //         if (groundHit && !isFalling) {
        //             // There is ground below the character, so the player can indeed initate a jump
        //             this.rapierRigidBody.applyImpulse(new THREE.Vector3(0, this.jumpImpulse, 0), true);
        //             this.lastJumpTime = time;
        //         }
        //     }
        // }
    }
}

export default KinematicCharacterController;