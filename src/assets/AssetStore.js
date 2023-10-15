import GLTFAsset from './GLTFAsset'
import TextureAsset from './TextureAsset'
import SoundAsset from './SoundAsset'
import JSONAsset from './JSONAsset'

class AssetStore {
  constructor(options = {}) {
    this.options = options;
    this.loadedAssets = {}; // key/value pairs  (url is key, asset is value) all files currently loaded
    this.initialized = false;
  }

  async init() {
    this.baseURL = await this.getBaseURL()
    this.initialized = true;
  }

  async getBaseURL() {
    if (this.options.baseURL) {
      return this.options.baseURL
    }
  
    if (window.electron) {
      const isPackaged = await window.electron.isAppPackaged();
      if (isPackaged) {
        const resourcesPath = window.electron.getResourcesPath();
        return `file://${resourcesPath}/assets`;
      } else {
        const dirName = window.electron.getDirName();
        return `file://${dirName}/../../../assets`;
      }
    } else {
      return `http://localhost:8080/assets`;
    }
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
  async load(path) {
    if (!this.initialized) {
      throw new Error('must call assetStore.init() before using load()')
    }

    if (!this.loadedAssets[path]) {
      const AssetSubclass = AssetStore._getAssetSubclass(path);
      const asset = new AssetSubclass(this.baseURL, path);
      await asset.load();
      this.loadedAssets[path] = asset;
      console.log(`AssetStore: successfully loaded asset: ${path}`);
    }

    return this.loadedAssets[path];
  }

  unload(path) {
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