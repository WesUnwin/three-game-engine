import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui'

import VRMode from './VR/VRMode';
import Logger from './Logger'

class Renderer {
    constructor(game, options) {
        this.game = game;
        this.options = options;

        this.width = this.options.width;
        this.height = this.options.height;

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

        this.threeJSCamera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.01, 1000);
        this.threeJSCamera.position.set(0, 1.5, 5);
        this.threeJSCamera.aspect = this.width / this.height;
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

    play() {
        // Must use setAnimationLoop() (and not window.requestAnimationFrame()) for VR projects
        this.threeJSRenderer.setAnimationLoop(this._render.bind(this));
    }

    pause() {
        this.threeJSRenderer.setAnimationLoop(null);
    }

    // time is a slowly increasing number of millisec since the beggining.
    _render(time) {
        const deltaTimeMS = this.previousRenderTime ? time - this.previousRenderTime : time;
        this.previousRenderTime = time;

        const deltaTimeInSec = deltaTimeMS / 1000;

        ThreeMeshUI.update();

        if (this.game.scene) {
            const threeJSScene = this.game.scene.threeJSScene;
            threeJSScene.dispatchEvent({ type: 'update', deltaTimeInSec: deltaTimeInSec, camera: this.threeJSCamera });
            this.threeJSRenderer.render(threeJSScene, this.threeJSCamera);
        }
    }
    
    printScene(options = { positions: true }) {
        if (this.game.scene) {
            const threeJSScene = this.game.scene.threeJSScene;
            Logger.dumpObject(threeJSScene, options);
        } else {
            console.warn('printScene(): No scene currently loaded, nothing to print');
        }
    }
}

export default Renderer