import GLTFAsset from './GLTFAsset'
import TextureAsset from './TextureAsset'
import SoundAsset from './SoundAsset'
import JSONAsset from './JSONAsset'

class Asset {
    constructor(baseURL, path) {
        this.baseURL = baseURL;
        this.path = path;
        this.data = null;
    }

    static getAssetSubclass(url) {
        const assetTypes = [
            { subclass: GLTFAsset, fileExtensions: ['.gltf', '.glb'] },
            { subclass: TextureAsset, fileExtensions: ['.png', '.jpg', '.bmp'] },
            { subclass: SoundAsset, fileExtensions: ['.wav', '.mp3', 'ogg'] },
            { subclass: JSONAsset, fileExtensions: ['.json'] }
        ];

        if (url.includes('cube_textures')) {
            return 
        } else {
            const assetType = assetTypes.find(type => type.fileExtensions.some(ext => url.endsWith(ext)));
            if (assetType) {
                return assetType.subclass;
            } else {
                throw new Error(`Unknown asset type: ${url}, no code to select which loader to use`);
            }
        }
    }

    getFullURL() {
        return `${this.baseURL}/${this.path}`;
    }

    async load() {
        // Override this in sub-class, with logic specific to the type of asset
        // this may involve using a loader specificto the type of asset, and
        // setting this.data to something
    }

    getData() {
        return this.data;
    }
}

export default Asset