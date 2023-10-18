import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Asset from "./Asset";

class GLTFAsset extends Asset {

    async load() : Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            const fullURL = this.getFullURL();
            loader.load(fullURL,
                data => {
                    /**
                     * For a glb/gltf file, this is the gltf object that came from the GLTFLoader.
                     * An object of the form:
                     *  {
                     *    scene:           THREE.Group
                     *    scenes:          Array<THREE.Group>
                     *    cameras:         Array<THREE.Camera>
                     *    animations: __   Array<THREE.AnimationClip>
                     *    asset: __        Object
                     *  }
                     */
                    this.data = data;
                    resolve();
                },
                () => {
                    // on progress
                },
                error => {
                    reject(error);
                }
            );
        })
    }
}

export default GLTFAsset;