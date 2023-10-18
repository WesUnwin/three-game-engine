import GLTFAsset from './GLTFAsset'
import TextureAsset from './TextureAsset'
import SoundAsset from './SoundAsset'
import JSONAsset from './JSONAsset'

class AssetStore {
  options: AssetOptions;
  loadedAssets: any;
  baseURL: string;

  constructor(options: AssetOptions = {}) {
    this.options = options;
    this.loadedAssets = {}; // key/value pairs  (url is key, asset is value) all files currently loaded
    this.baseURL = options.baseURL; // Will be needed (in most cases) if loading assets
  }

  static _getAssetSubclass(path) {
    const assetTypes = [
        { subclass: GLTFAsset, fileExtensions: ['.gltf', '.glb'] },
        { subclass: TextureAsset, fileExtensions: ['.png', '.jpg', '.bmp'] },
        { subclass: SoundAsset, fileExtensions: ['.wav', '.mp3', 'ogg'] },
        { subclass: JSONAsset, fileExtensions: ['.json'] }
    ];

    if (path.includes('cube_textures')) {
        return 
    } else {
        const assetType = assetTypes.find(type => type.fileExtensions.some(ext => path.endsWith(ext)));
        if (assetType) {
            return assetType.subclass;
        } else {
            throw new Error(`Unable to identify which Asset Subclass to use for this asset: ${path}`);
        }
    }
  }

  /**
   * Fetches the specified asset (if not already fetched)
   **/
  async load(path: string) {
    if (!this.loadedAssets[path]) {
      const AssetSubclass = AssetStore._getAssetSubclass(path);
      if (!this.baseURL) {
        throw new Error('AssetStore: load: assetOptions.baseURL must be set before loading any asset');
      }
      const asset = new AssetSubclass(this.baseURL, path);
      await asset.load();
      this.loadedAssets[path] = asset;
      console.log(`AssetStore: successfully loaded asset: ${path}`);
    }

    return this.loadedAssets[path];
  }

  unload(path: string) {
    const asset = this.loadedAssets[path];
    if (asset) {
      this.loadedAssets[path] = null;
      console.log(`Assets: unloaded ${path}`);
    } else {
      console.log(`Assets: unloading ${path} - skipped, not currently loaded`);
    }
  }

  unloadAll() {
    console.log(`AssetStore: unloading all assets, clearing this store.`);
    this.loadedAssets = {};
  }
}

export default AssetStore;