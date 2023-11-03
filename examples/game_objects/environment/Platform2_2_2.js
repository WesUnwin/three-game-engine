import { GameObject } from "../../../dist";

class Platform2_2_2 extends GameObject {
    constructor(parent, options) {
        super(parent, {
            models: [
                { assetPath: 'models/platform_2_2_2.glb' }
            ],
            rigidBody: {
            type: 'fixed',
            colliders: [
                { type: 'cuboid', hx: 1, hy: 1, hz: 1 }
            ]
            },
            ...options
        })
    }
}

export default Platform2_2_2;
