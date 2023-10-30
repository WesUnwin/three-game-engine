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
    verticalVelocity: number;

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
        }, controllerOptions);
        this.verticalVelocity = 0;
    }

    afterLoaded(): void {
        const rapierWorld = this.getRapierWorld();
        const offset = 0.05;
        this.rapierCharacterController = rapierWorld.createCharacterController(offset);
    }

    beforeRender({ deltaTimeInSec, time }) {
        const inputManager = this.getScene().game.inputManager;
        const keyboard = inputManager.keyboard;

        const yawAngle = this.getDesiredYaw();
        const pitchAngle = this.getDesiredPitch();
        const desiredRotation = new THREE.Quaternion();
        desiredRotation.setFromEuler(new THREE.Euler(pitchAngle, yawAngle, 0, 'YXZ'));

        const yawQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yawAngle, 0));
        this.rapierRigidBody.setRotation(yawQuaternion, true);

        let camera = null;
        this.threeJSGroup.traverse(obj => {
            if (obj instanceof THREE.Camera) {
                camera = obj;
            }
        });
        if (camera) {
            console.log('set c')
            camera.rotation.set(pitchAngle, 0, 0);
        }

        const desiredMovementVector = this.getDesiredTranslation(deltaTimeInSec);

        // Make it so "forward" is in the same direction as where the character faces
        desiredMovementVector.applyAxisAngle(new THREE.Vector3(0,1,0), yawAngle);

        // Emulate gravity (accelerates verticalVelocity downwards to a max terminal velocity)
        const isOnGround = this.isOnGround();
        if (isOnGround && this.verticalVelocity < 0) {
            this.verticalVelocity = -0.5; // keeps collider pressed against ground
        } else {
            this.verticalVelocity -= (9.8 * deltaTimeInSec);
            if (this.verticalVelocity < -10) {
                this.verticalVelocity = -10; // terminal velocity
            }
        }

        desiredMovementVector.y += (this.verticalVelocity * deltaTimeInSec);

        //console.log(`isOnGround: ${isOnGround} vert velocity: ${this.verticalVelocity}, y: ${this.rapierRigidBody.translation().y}`);

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
        if (keyboard.isKeyDown(' ')) {
            const timeSinceLastJump = time - this.lastJumpTime;
            if (timeSinceLastJump > this.controllerOptions.jumpCooldown) {
                if (isOnGround) {
                    // There is ground below the character, so the player can indeed initate a jump
                    this.verticalVelocity = 5;
                    this.lastJumpTime = time;
                }
            }
        }
    }
}

export default KinematicCharacterController;