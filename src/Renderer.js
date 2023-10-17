import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui'

import VRMode from './VR/VRMode';
import Logger from './Logger'

class Renderer {
    constructor(game, options = {}) {
        this.game = game;
        this.options = options;

        this.width = this.options.width || 0;
        this.height = this.options.height || 0;

        this.threeJSRenderer = new THREE.WebGL1Renderer({ antialias: true });
        this.threeJSRenderer.gammaOutput = true;
        this.threeJSRenderer.outputEncoding = THREE.sRGBEncoding;
        this.threeJSRenderer.shadowMap.enabled = true;
        this.threeJSRenderer.shadowMap.type = 1;

        this.threeJSRenderer.toneMapping = 0;
        this.threeJSRenderer.toneMappingExposure = 1;
        this.threeJSRenderer.physicallyCorrectLights = false;

        this.threeJSRenderer.setPixelRatio(this.options.pixelRatio);
        this.threeJSRenderer.setSize(this.width, this.height);

        const defaultCameraOptions = {
            fov: 50, // field of view
            aspect: this.width / this.height,
            near: 0.01,
            far: 1000,
            position: {
                x: 0,
                y: 1.5,
                z: 5
            }
        };
        const cameraOptions = Object.assign(defaultCameraOptions, options.cameraOptions || {});

        this.threeJSCamera = new THREE.PerspectiveCamera(cameraOptions.fov, cameraOptions.aspect, cameraOptions.near, cameraOptions.far);
        this.threeJSCamera.position.set(cameraOptions.position.x, cameraOptions.position.y, cameraOptions.position.z);
        this.threeJSCamera.updateProjectionMatrix();

        this.threeJSCameraAudioListener = new THREE.AudioListener();
        this.threeJSCamera.add(this.threeJSCameraAudioListener);

        if (this.options.enableVR) {
            this._initVR();
        }
    }

    _initVR() {
        this.vrMode = new VRMode();

        this.vrMode.on('SESSION_STARTED', session => {
          const setSessionSuccess = () => {
            console.log('threeJSRenderer.xr.setSession succeeded')
          };
    
          const setSessionFailed = error => {
            console.error('threeJSRenderer.xr.setSession failed!', error);
            throw error;
          };
    
          this.threeJSRenderer.xr.setSession(session).then(setSessionSuccess, setSessionFailed);
        });
    
        this.vrMode.on('SESSION_ENDED', () => {
            console.log('VR Session Eneded')
        });

        this.threeJSRenderer.xr.enabled = true;
    }

    getCanvas() {
        return this.threeJSRenderer.domElement;
    }
    
    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.threeJSRenderer.setSize(this.width, this.height);

        this.threeJSCamera.aspect = this.width / this.height;
        this.threeJSCamera.updateProjectionMatrix();

        if (this.game.scene) {
            const threeJSScene = this.game.scene.threeJSScene
            this.threeJSRenderer.render(threeJSScene, this.threeJSCamera);
        }
    }

    addCameraToGameObject(gameObject) {
        if (!(gameObject instanceof GameObject)) {
            throw new Error('addCameraToGameObject: you can only pass a GameObject instance to this function');
        }
        this.addCameraToObject3D(gameObject.threeJSGroup);
    }

    addCameraToObject3D(object3D) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('addCameraToObject3D: you can only pass a Object3D instance to this function');
        }
        object3D.add(this.threeJSCamera);
    }

    setCameraPosition(x, y, z) {
        this.threeJSCamera.position.set(x, y, z);
    }

    setCameraRotation(x, y, z, order = undefined) {
        this.threeJSCamera.rotation.set(x, y, z, order);
    }

    getCamera() {
        return this.camera;
    }

    setCamera(camera, attachAudioListener = true) {
        if (!(camera instanceof THREE.Camera)) {
            throw new Error('setCamera: you must pass an instance of THREE.Camera to this function');
        }
        this.threeJSCamera = camera;
        if (attachAudioListener) {
            this.threeJSCamera.add(this.threeJSCameraAudioListener);
        }
    }

    play() {
        // Must use setAnimationLoop() (and not window.requestAnimationFrame()) for VR projects
        this.threeJSRenderer.setAnimationLoop(this._render.bind(this));
    }

    pause() {
        this.threeJSRenderer.setAnimationLoop(null); // passing null stops any ongoing animation, as the docs say
    }

    // time is a slowly increasing number of millisec since the beggining.
    _render(time) {
        const deltaTimeMS = this.previousRenderTime ? time - this.previousRenderTime : time;
        this.previousRenderTime = time;

        const deltaTimeInSec = deltaTimeMS / 1000;

        ThreeMeshUI.update();

        const scene = this.game.scene;
        if (scene) {
            this._beforeRender({
                deltaTimeInSec 
            });

            this.threeJSRenderer.render(scene.threeJSScene, this.threeJSCamera);
        }
    }

    _beforeRender(args) {
        this.game.scene.beforeRender(args);
        this.game.scene.forEachGameObject(gameObject => {
            gameObject.beforeRender(args);
        });
    }
    
    printScene() {
        if (this.game.scene) {
            Logger.printHierarchy(this.game.scene);
        } else {
            console.warn('printScene(): no active scene to print');
        }
    }

    printThreeJSScene(options = { positions: true }) {
        if (this.game.scene) {
            const threeJSScene = this.game.scene.threeJSScene;
            Logger.printThreeJSGraph(threeJSScene, options);
        } else {
            console.warn('printThreeJSScene(): No scene currently loaded, nothing to print');
        }
    }
}

export default Renderer