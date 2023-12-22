import * as THREE from 'three';
import Asset from "./Asset";

class JSONAsset extends Asset {
    async load() : Promise<void> {
        return new Promise((resolve, reject) => {
            const fileLoader = new THREE.FileLoader();
            this.getFullURL().then(fullURL => {
                fileLoader.load(fullURL,
                    text => {
                        this.data = JSON.parse(text);
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

export default JSONAsset;