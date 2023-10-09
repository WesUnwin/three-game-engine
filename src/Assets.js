import Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Assets {
  static loadedAssets = {}; // key/value pairs  (url is key, asset is value) all files currently loaded

  static assetsURL = null;

  static async setup() {
    console.log('Assets: setting up...');
    if (window.electron) {
      const isPackaged = await window.electron.isAppPackaged();
      console.log('Assets: is electron app packaged: ', isPackaged);
      if (isPackaged) {
        const resourcesPath = window.electron.getResourcesPath();
        Assets.assetsURL = `file://${resourcesPath}/assets`;
      } else {
        const dirName = window.electron.getDirName();
        Assets.assetsURL = `file://${dirName}/../../../assets`;
      }
    } else {
      Assets.assetsURL = `http://localhost:8080`;
    }
    console.log(`Assets: assetsURL set to: ${Assets.assetsURL}`);
  }

  static getURL(path) {
    if (!Assets.assetsURL) {
      throw new Error('Assets: must call setup() first');
    }

    return `${Assets.assetsURL}/${path}`;
  }

  static load(url) {
    return new Promise((resolve, reject) => {

      const onProgress = () => {
        //console.log(`Assets: loading: ${url} - ${( xhr.loaded / xhr.total * 100 )}% done.`);
      };

      const onSuccess = asset => {
        Assets.loadedAssets[url] = asset;
        console.log(`Assets: successfully loaded: ${url}`);
        resolve(asset);
      };

      const onError = error => {
        console.log(`Assets: ERROR loading: ${url}: ${error}`);
        reject(error);
      };

      const fullURL =  Assets.getURL(url);
      if (url.endsWith('.json')) {
        const fileLoader = new Three.FileLoader();
        fileLoader.load(fullURL,
          function(text) {
            const json = JSON.parse(text);
            onSuccess(json);
          },
          onProgress,
          onError
        );
      } else if (['.png', '.jpg', '.bmp'].some(ext => url.endsWith(ext))) {
        const textureLoader = new Three.TextureLoader();
        textureLoader.load(
          fullURL,
          onSuccess, // receives a gltf object
          undefined, // onProgress callback currently not supported
          onError
        );
      } else if (['.gltf', '.glb'].some(ext => url.endsWith(ext))) {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          fullURL,
          onSuccess, // receives a gltf object
          onProgress,
          onError
        );
      } else if (['.wav', '.mp3', 'ogg'].some(ext => url.endsWith(ext))) {
        const audioLoader = new Three.AudioLoader();
        audioLoader.load(
          fullURL,
          onSuccess, // receives an audioBuffer
          onProgress,
          onError
        );
      } else if (url.includes('cube_textures')) {
        const cubeTextureLoader = new Three.CubeTextureLoader();
        cubeTextureLoader.setPath(fullURL)
                          .load(
                            [
                              'px.png', 'nx.png',
                              'py.png', 'ny.png',
                              'pz.png', 'nz.png'
                            ],
                            onSuccess,
                            onProgress,
                            onError
                          );
      } else {
        throw new Error(`Unknown asset type: ${url}, no code to select which loader to use`);
      }
    });
  }

  static unload(url) {
    const asset = Assets.loadedAssets[url];
    if (asset) {
      // TODO does one need to dispose of the gltf object and its resources?
      Assets.loadedAssets[url] = null;
      console.log(`Assets: unloaded ${url}`);
    } else {
      console.log(`Assets: unloading ${url} - skipped, not currently loaded`);
    }
  }

  /**
   * Returns the asset
   * 
   * For a glb/gltf file, this is the gltf object that came from the GLTFLoader.
   * An object of the form:
   *  {
   *    scene:           THREE.Group
   *    scenes:          Array<THREE.Group>
   *    cameras:         Array<THREE.Camera>
   *    animations: __   Array<THREE.AnimationClip>
   *    asset: __        Object
   *  }
   * 
   * For audio files, this is the AudioBuffer instance.
   */
  static get(url) {
    const asset = Assets.loadedAssets[url];
    if (!asset) {
      throw new Error(`Asset not loaded: ${url}`);
    }
    return asset;
  }
}

export default Assets;