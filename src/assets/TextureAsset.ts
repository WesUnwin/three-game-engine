import * as THREE from 'three';
import Asset from "./Asset";

class TextureAsset extends Asset {
    async load() : Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            const fullURL = this.getFullURL();
            loader.load(fullURL,
                data => {
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

export default TextureAsset;