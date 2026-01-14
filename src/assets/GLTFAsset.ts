import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import Asset from "./Asset";
import { DracoLoaderOptions } from '../types';

class GLTFAsset extends Asset {
    // As recommended by Three.js it's recommended to create one
    // instance of DracoLoader and re-use it. 
    static _dracoLoader;

    static getDracoLoader(options: DracoLoaderOptions) {
        if (!GLTFAsset._dracoLoader) {
            const loader = new DRACOLoader();
            loader.setDecoderPath(options.path);
            if ('decoderConfig' in options) {
                loader.setDecoderConfig(options.decoderConfig);
            }
            if ('workerLimit' in options) {
                loader.setWorkerLimit(options.workerLimit);
            }

            GLTFAsset._dracoLoader = loader;
        }
        return GLTFAsset._dracoLoader;
    }

    async load() : Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();

            // Optional: GLTFLoader can use a DRACOLoader instance to decode any 
            // Draco compressed mesh data inside the GTLF/GLB file.
            const { dracoLoaderOptions } = this.assetStore.assetOptions;
            if (dracoLoaderOptions) {
                const dracoLoader = GLTFAsset.getDracoLoader(dracoLoaderOptions);
                loader.setDRACOLoader(dracoLoader);
            }

            this.getFullURL().then(fullURL => {
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
            });
        })
    }
}

export default GLTFAsset;