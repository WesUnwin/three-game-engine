import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

import CharacterController from './CharacterController';
import RigidBodyComponent from '../components/RigidBodyComponent';

const defaultCapsuleOptions = {
    halfHeight: 0.45,
    radius: 0.4,
    density: 500
};

class DynamicCharacterController extends CharacterController {
    jumpImpulse: number = 1300;

    constructor(parent, options, controllerOptions) {
        super(
            parent,
            {
                ...options,
                components: [
                    {
                        type: 'rigidBody',
                        rigidBodyType: 'dynamic',
                        colliders: [
                            { type: 'capsule', ...Object.assign({}, defaultCapsuleOptions, ((controllerOptions || {}).capsule || {})) }
                        ],
                        enabledRotations: { x: false, y: true, z: false }
                    },
                    ...(options.components || [])
                ],
            },
            controllerOptions
        );
    }

    afterLoaded(): void {

    }

    beforeRender({ deltaTimeInSec, time }) {
        const inputManager = this.getScene().game.inputManager;
        const keyboard = inputManager.keyboardHandler;

        const rigidBodyComponent = this.getComponent(RigidBodyComponent) as RigidBodyComponent;
        const rapierRigidBody = rigidBodyComponent.getRapierRigidBody();

        const yawAngle = this.getDesiredYaw();
        const pitchAngle = this.getDesiredPitch();
        const desiredRotation = new THREE.Quaternion();
        desiredRotation.setFromEuler(new THREE.Euler(pitchAngle, yawAngle, 0, 'YXZ'));
        rapierRigidBody.setRotation(desiredRotation, true);

        const desiredMovementVector = this.getDesiredTranslation(deltaTimeInSec);

        // Make it so "forward" is in the same direction as where the character faces
        desiredMovementVector.applyQuaternion(desiredRotation);
        
        desiredMovementVector.multiplyScalar(400);
        rapierRigidBody.applyImpulse(desiredMovementVector, true);

        // Jump mechanics
        if (keyboard.isKeyDown(' ')) {
            const timeSinceLastJump = time - this.lastJumpTime;
            if (timeSinceLastJump > this.controllerOptions.jumpCooldown) {
                const rapierWorld = this.getScene().getRapierWorld();
                const currentPosition = rapierRigidBody.translation();

                // Point just below the capsulate collider
                const rayOrigin = { 
                    x: currentPosition.x,
                    y: currentPosition.y - this.controllerOptions.capsule.halfHeight - this.controllerOptions.capsule.radius - 0.05,
                    z: currentPosition.z
                };

                const rayDirection = { x: 0, y: -0.1, z: 0 }; // downwards
                const ray = new RAPIER.Ray(rayOrigin, rayDirection);
                const groundHit = rapierWorld.castRay(ray, 0.01, true);

                const isFalling = rapierRigidBody.linvel().y < -0.1;
                if (groundHit && !isFalling) {
                    // There is ground below the character, so the player can indeed initate a jump
                    rapierRigidBody.applyImpulse(new THREE.Vector3(0, this.jumpImpulse, 0), true);
                    this.lastJumpTime = time;
                }
            }
        }
    }
}

export default DynamicCharacterController