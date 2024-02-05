import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui'

import Game from './Game';
import VRMode from './VR/VRMode';
import Logger from './Logger'
import GameObject from './GameObject';
import { RendererOptions } from './types';

interface ThreeJSWebGL1RendererConstructorOptions {
    antialias?: boolean;
    canvas?: HTMLCanvasElement;
}

class Renderer {
    game: Game;
    options: RendererOptions;
    threeJSRenderer: THREE.WebGL1Renderer;
    threeJSCamera: THREE.Camera;
    threeJSCameraAudioListener: THREE.AudioListener;
    vrMode: VRMode;
    previousRenderTime: number | undefined;

    constructor(game: Game, options: RendererOptions = {}) {
        this.game = game;
        this.options = options;

        const threeJSRendererOptions: ThreeJSWebGL1RendererConstructorOptions = {
            antialias: true
        };
        if (options.canvas) {
            threeJSRendererOptions.canvas = options.canvas;
            if (!this.options.width) {
                this.options.width = options.canvas.width;
            }
            if (!this.options.height) {
                this.options.height = options.canvas.height;
            }
        }

        this.threeJSRenderer = new THREE.WebGL1Renderer(threeJSRendererOptions);
        this.threeJSRenderer.gammaOutput = true;
        this.threeJSRenderer.outputEncoding = THREE.sRGBEncoding;
        this.threeJSRenderer.shadowMap.enabled = true;
        this.threeJSRenderer.shadowMap.type = 1;

        this.threeJSRenderer.toneMapping = 0;
        this.threeJSRenderer.toneMappingExposure = 1;
        this.threeJSRenderer.physicallyCorrectLights = false;

        if (typeof window !== 'undefined') {
            this.options.width = this.options.width || window?.innerWidth;
            this.options.height = this.options.height || window?.innerHeight;
            this.options.pixelRatio = this.options.pixelRatio || window?.devicePixelRatio
        }

        this.threeJSRenderer.setPixelRatio(this.options.pixelRatio || 1);
        this.threeJSRenderer.setSize(this.options.width, this.options.height);

        const defaultCameraOptions = {
            fov: 50, // field of view
            aspect: this.options.width / this.options.height,
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

        if (this.options.setupFullScreenCanvas) {
            this.setupFullScreenCanvas();
        }

        if (this.options.enableVR) {
            this._initVR();
        }
    }

    setupFullScreenCanvas() {
        if (typeof window === 'undefined') {
            throw new Error('setupFullScreenCanvas() can only be called in a browser-like context, where the top level variable window is defined')
        }

        const canvas = this.getCanvas();
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        document.body.innerHTML = '';
        document.body.appendChild(canvas);
        document.body.style.margin = '0px';
      
        // on resizing the viewport, update the dimensions of the canvas to fill the viewport
        window.addEventListener('resize', () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          this.setSize(window.innerWidth, window.innerHeight);
        });

        this.setSize(window.innerWidth, window.innerHeight);
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

    getCanvas(): HTMLCanvasElement {
        return this.threeJSRenderer.domElement;
    }
    
    setSize(width: number, height: number) {
        this.options.width = width;
        this.options.height = height;

        this.threeJSRenderer.setSize(this.options.width, this.options.height);

        this.threeJSCamera.aspect = this.options.width / this.options.height;
        this.threeJSCamera.updateProjectionMatrix();

        if (this.game.scene) {
            const threeJSScene = this.game.scene.threeJSScene
            if (threeJSScene) {
                this.threeJSRenderer.render(threeJSScene, this.threeJSCamera);
            }
        }
    }

    addCameraToGameObject(gameObject: GameObject) {
        if (!(gameObject instanceof GameObject)) {
            throw new Error('addCameraToGameObject: you can only pass a GameObject instance to this function');
        }
        this.addCameraToObject3D(gameObject.threeJSGroup);
    }

    addCameraToObject3D(object3D: THREE.Object3D) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('addCameraToObject3D: you can only pass a Object3D instance to this function');
        }
        object3D.add(this.threeJSCamera);
    }

    getCamera(): THREE.Camera {
        return this.threeJSCamera;
    }

    setCamera(camera: THREE.Camera, attachAudioListener: boolean = true) {
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
    _render(time: number) {
        const deltaTimeMS = this.previousRenderTime ? time - this.previousRenderTime : time;
        this.previousRenderTime = time;

        const deltaTimeInSec = deltaTimeMS / 1000;

        const beforeRenderArgs = {
            deltaTimeInSec,
            time
        };

        if (this.options.beforeRender) {
            this.options.beforeRender(beforeRenderArgs);
        }

        ThreeMeshUI.update();

        const scene = this.game.scene;
        if (scene) {
            this.game.inputManager.beforeRender();

            if (!this.game.gameOptions.disablePhysics) {
                scene.advancePhysics();
            }

            if (scene.threeJSScene) {
                scene.updatePhysicsGraphics();

                this._beforeRender(beforeRenderArgs);
    
                this.threeJSRenderer.render(scene.threeJSScene, this.threeJSCamera);
            }
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

    setCameraPosition(...args) {
        this.threeJSCamera.position.set(...args);
    }

    setCameraRotation(...args) {
        this.threeJSCamera.rotation.set(...args);
    }

    makeCameraLookAt(...args) {
        this.threeJSCamera.lookAt(...args);
    }
}

export default Renderer