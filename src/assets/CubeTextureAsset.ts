import * as THREE from 'three';

import Asset from "./Asset";

class CubeTextureAsset extends Asset {
    async load() : Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new THREE.CubeTextureLoader();
            this.getFullURL().then(fullURL => {
                loader.setPath(fullURL)
                .load(
                  [
                      'px.png', 'nx.png',
                      'py.png', 'ny.png',
                      'pz.png', 'nz.png'
                  ],
                  () => resolve(),
                  () => {
                      // On progress
                  },
                  error => reject(error)
                );
            });
        })
    }
}

export default CubeTextureAsset;