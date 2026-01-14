import GLTFAsset from './GLTFAsset'
import TextureAsset from './TextureAsset'
import SoundAsset from './SoundAsset'
import JSONAsset from './JSONAsset'
import Asset from './Asset';
import { AssetOptions } from '../types';

class AssetStore {
  baseURL: string | null;
  dirHandle: FileSystemDirectoryHandle | null;
  loadedAssets: any;
  assetOptions: AssetOptions;

  constructor(baseURLorDirHandle: string | FileSystemDirectoryHandle, assetOptions: AssetOptions) {
    if (typeof baseURLorDirHandle === 'string') {
      this.baseURL = baseURLorDirHandle;
      if (this.baseURL.endsWith('/')) {
          this.baseURL = this.baseURL.slice(0, this.baseURL.length - 1);
      }
      this.dirHandle = null;
    } else {
      this.baseURL = null;
      this.dirHandle = baseURLorDirHandle;
    }

    this.assetOptions = assetOptions || {};

    this.loadedAssets = {}; // key/value pairs  (url is key, asset is value) all files currently loaded
  }

  static _getAssetSubclass(path: string) {
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
  async load(path: string): Promise<Asset> {
    if (!this.loadedAssets[path]) {
      const AssetSubclass = AssetStore._getAssetSubclass(path);
      const asset = new AssetSubclass(this.baseURL || this.dirHandle, path, this);
      await asset.load();
      this.loadedAssets[path] = asset;
      console.log(`AssetStore: successfully loaded asset: ${path}`);
    }

    return this.loadedAssets[path];
  }

  get(path: string) {
    return this.loadedAssets[path];
  }

  unload(path: string) {
    const asset = this.loadedAssets[path];
    if (asset) {
      asset.unload();
      this.loadedAssets[path] = null;
      console.log(`Assets: unloaded ${path}`);
    } else {
      console.log(`Assets: unloading ${path} - skipped, not currently loaded`);
    }
  }

  unloadAll() {
    console.log(`AssetStore: unloading all assets, clearing this store.`);
    Object.keys(this.loadedAssets).forEach(assetPath => {
      this.unload(assetPath)
    });
  }
}

export default AssetStore;