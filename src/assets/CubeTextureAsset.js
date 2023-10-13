import * as THREE from 'three';

import Asset from "./Asset";

class CubeTextureAsset extends Asset {
    async load() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.CubeTextureLoader();
            const fullURL = this.getFullURL();
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
        })
    }
}

export default CubeTextureAsset;