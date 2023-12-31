import * as THREE from 'three';

import Asset from "./Asset";

class SoundAsset extends Asset {
    async load() : Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new THREE.AudioLoader();
            this.getFullURL().then(fullURL => {
                loader.load(fullURL,
                    data => {
                        // data is an AudioBuffer instance
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

export default SoundAsset;