import React, { useEffect, useRef, useState } from "react";
import { Game, THREE } from '../../dist/index';
import { useDispatch, useSelector } from 'react-redux';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls, TransformControlsPlane } from 'three/examples/jsm/controls/TransformControls.js';
import { getSelectedItem, selectItem } from "./Redux/SelectedItemSlice.js";
import { modifyGameObject } from "./Redux/FileDataSlice.js";
import StatusBar from "./StatusBar/StatusBar.jsx";
import store from "./Redux/ReduxStore.js";
import fileDataSlice from "./Redux/FileDataSlice.js";
import selectedItemSlice from "./Redux/SelectedItemSlice.js";
import GameObject from "../../dist/GameObject.js";
import { debounce } from "./util/debounce.js";
import settingsSlice, { getSettings } from "./Redux/SettingsSlice.js";
import currentModalSlice from "./Redux/CurrentModalSlice.js";

const modifyGameObjectTypeInMainArea = debounce(({ gameObjectType }) => {
    const gameJSONFile = store.getState().fileData.files.find(f => f.path === 'game.json');
    const gameObjectTypeFilePath = (gameJSONFile.data.gameObjectTypes || {})[gameObjectType];
    const gameObjectTypeFile = store.getState().fileData.files.find(f => f.path === gameObjectTypeFilePath);
    if (window.game?.scene) {
        const asset = game.assetStore.get(gameObjectTypeFilePath);
        if (asset) {
            asset.setData(gameObjectTypeFile.data);
        }
    }
}, 1000);

// Note this does not actually span the main area currently, but it manages the rendering of the canvas in it
const MainArea = ({ dirHandle }) => {
    const dispatch = useDispatch();

    const canvasRef = useRef();
    const orbitControlsRef = useRef();
    const transformControlsRef = useRef();

    const selectedItem = useSelector(getSelectedItem());

    const settings = useSelector(getSettings());

    const [error, setError] = useState(null);

    const createGame = async () => {
        setError(null);

        const canvas = canvasRef.current;

        if (!canvas) {
            throw new Error('MainArea: unable to reference canvas HTMLElement');
        }

        console.log('MainArea: creating Game...');
        window.game = new Game(dirHandle, {
            disablePhysics: true,
            rendererOptions: {
                canvas,
                pixelRatio: window.devicePixelRatio,
                beforeRender: ({ deltaTimeInSec }) => {
                    const width = window.innerWidth - 400;
                    const height = window.innerHeight - 30;
                
                    const currentWidth = window.game.renderer.options.width;
                    const currentHeight = window.game.renderer.options.height;
                    if (currentWidth != width || currentHeight != height) {
                        canvas.width = width;
                        canvas.height = height;
                        canvas.style = `width: ${width}px; height: ${height}px;`
                    
                        window.game.renderer.setSize(width, height)
                    }

                    if (orbitControlsRef.current) {
                        orbitControlsRef.current.update(deltaTimeInSec);
                    }
                }
            }
        });

        await game.play().catch(error => {
            setError(error);
        });

        if (settings.showGrid) {
            game.scene?.showGrid();
        }

        const defaultCamera = game.renderer.getCamera();
        const orbitControls = new OrbitControls(defaultCamera, canvas);
        orbitControlsRef.current = orbitControls;

        // TransformControls provides a threeJS widget that allows the user to adjust
        // the position/scale/rotation of objects (similar to how three.js' scene editor does)
        const transformControls = new TransformControls(
            defaultCamera,
            canvas
        );
        transformControls.setSize(0.5);

        // disable orbitControls while using transformControls
        transformControls.addEventListener('mouseDown', () => {
            const orbitControls = orbitControlsRef.current;
            if (orbitControls) {
                orbitControls.enabled = false;
            } 
        });
        transformControls.addEventListener('mouseUp', () => {
            const orbitControls = orbitControlsRef.current;
            if (orbitControls) {
                orbitControls.enabled = true;
            }               
        });
        transformControls.addEventListener('change', event => {
            const filePath = game.scene.jsonAssetPath;
            const controls = event.target;
            const threeJSObject = controls.object;

            if (!threeJSObject) {
                return; // todo find out why this happens
            }

            const gameObject = game.scene.getGameObjectWithThreeJSObject(threeJSObject)
            const indices = game.scene.getGameObjectIndices(gameObject);

            let field = null;
            let value = null;
            if (controls.mode === 'translate') {
                const { x, y, z } = threeJSObject.position;
                field = ['position'];
                value = { x, y, z };
            } else if (controls.mode === 'scale') {
                const { x, y, z } = threeJSObject.scale;
                field = ['scale'];
                value = { x, y, z };
            } else if (controls.mode === 'rotate') {
                const { x, y, z } = threeJSObject.rotation;
                field = ['rotation'];
                value = { x, y, z };
            }

            if (field) {
                ['x', 'y', 'z'].forEach(prop => {
                    value[prop] = Number.parseFloat(value[prop].toFixed(3)) || 0;
                });
                dispatch(modifyGameObject(filePath, indices, field, value));
            }
        });

        transformControlsRef.current = transformControls;
    };

    useEffect(() => {
        if (dirHandle && canvasRef.current) {
            createGame();
        }
    }, [dirHandle, canvasRef])

    const onClick = event => {
        const canvas = canvasRef.current;
        const pointerPosition = new THREE.Vector2();

        pointerPosition.x = ( event.clientX / canvas.width ) * 2 - 1;
        pointerPosition.y = - ( event.clientY / canvas.height ) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        if (game?.renderer) {
            const defaultCamera = game.renderer.getCamera();
            raycaster.setFromCamera(pointerPosition, defaultCamera);
            if (game.scene) {
                const threeJScene = game.scene?.threeJSScene;
                const intersections = raycaster.intersectObject(threeJScene);

                const relevantIntersections = intersections.filter(intersect => {
                    if (intersect.object instanceof TransformControlsPlane) {
                        return false;
                    }
                    return true;
                })

                const gameObjectsIntersected = relevantIntersections.map(intersect => game.scene.getGameObjectWithThreeJSObject(intersect.object)).filter(g => g);

                if (gameObjectsIntersected.length) {
                    const gameObject = gameObjectsIntersected[0];
                    const indices = game.scene.getGameObjectIndices(gameObject);
                    dispatch(selectItem(game.scene.jsonAssetPath, 'gameObject', { indices }));
                }
            }
        }
    };

    const switchTransformControlsMode = mode => {
        transformControlsRef.current?.setMode(mode);
    };

    const onKeyDown = event => {
        console.log('MainArea: keydown: ', event.code);
        switch(event.code) {
            case 'KeyR':
                switchTransformControlsMode('rotate');
                break;
            case 'KeyS':
                switchTransformControlsMode('scale');
                break;
            case 'KeyT':
            case 'KeyP':
                switchTransformControlsMode('translate');
                break;
            case 'Delete':
                onDeleteKey();
        }
    };

    const onDeleteKey = () => {
        const selectedGameObject = getSelectedGameObject();
        if (selectedGameObject) {
            const scenePath = game.scene.jsonAssetPath;

            const currentSelectedItem = store.getState().selectedItem;
            const gameObjectIndices = currentSelectedItem.params.indices;

            dispatch(selectedItemSlice.actions.unSelectItem()); // clear as the indices of any selected game object might have changed due to deleting a game object

            dispatch(fileDataSlice.actions.deleteGameObject({
                scenePath,
                gameObjectIndices
            }));

            deleteGameObjectInMainArea({ scenePath, gameObjectIndices });
        }
    };

    const getSelectedGameObject = () => {
        const currentSelectedItem = store.getState().selectedItem;
        if (!window.game?.scene || !currentSelectedItem) {
            return null;
        }
        if (currentSelectedItem.filePath === window.game.scene.jsonAssetPath && currentSelectedItem?.type === 'gameObject') {
            const indices = currentSelectedItem.params.indices;
            const selectedGameObject = window.game?.scene?.getGameObjectByIndices(indices);
            return selectedGameObject;
        } else {
            return null;
        }
    };

    const onSelectItemChange = async () => {
        const game = window.game;
        const { type, filePath } = selectedItem;
        if (['sceneJSON', 'gameObject'].includes(type)) {
            if (game?.scene?.jsonAssetPath !== filePath) {
                // We need to switch scenes
                const gameJSONFile = store.getState().fileData.files.find(f => f.path === 'game.json');
                const sceneName = Object.keys(gameJSONFile.data.scenes || {}).find(sceneName => gameJSONFile.data.scenes[sceneName] === filePath);
                if (sceneName) {
                    console.log(`MainArea: switching to scene: ${sceneName}`);
                    dispatch(currentModalSlice.actions.openModal({ type: 'LoadingModal', params: { text: `Loading scene: ${sceneName}...` }}));
                    try {
                        await game.loadScene(sceneName);
                    } catch(error) {
                        console.error('Error loading scene: ', error);
                        setError(error);
                    }
                    dispatch(currentModalSlice.actions.closeModal());
                }
            }
        }

        const transformControls = transformControlsRef.current;
        if (transformControls) {
            const selectedGameObject = getSelectedGameObject();
            if (selectedGameObject) {
                game.scene.threeJSScene.add(transformControls);
                transformControls.attach(selectedGameObject.threeJSGroup);
            } else {
                transformControls.detach();
            }
        }
    };

    useEffect(() => {
        if (window.game && selectedItem?.type) {
            onSelectItemChange();
        }
    }, [selectedItem?.type, JSON.stringify(selectedItem?.params || {})]);

    const addGameObjectToMainArea = ({ scenePath, gameObject }) => {
        if (game?.scene?.jsonAssetPath === scenePath) {
            new GameObject(game.scene, gameObject);
            console.log('GameObject added to main area')
        }
    };

    const modifyGameObjectInMainArea = ({ scenePath, indices, field, value }) => {
        const scene = window.game?.scene
        if (scene?.jsonAssetPath === scenePath) {
            let gameObject = scene.getGameObjectByIndices(indices);
            if (['position', 'scale', 'rotation'].includes(field[0])) {
                // These fields are direct properties of the threeJSGroup
                let obj = gameObject.threeJSGroup;
                for (let i = 0; i < field.length - 1; i++ ) {
                    obj = obj[field[i]];
                }
                obj[field[field.length - 1]] = value;
            } else if (field.length == 1 && field[0] === 'lights') {
                gameObject.updateLights(value);
            } else if (field.length == 1 && field[0] === 'rigidBody') {
                gameObject.updateRigidBody(value);
            } else if (field.length == 1 && field[0] === 'models') {
                gameObject.updateModels(value);
            } else {
                throw new Error(`No logic defined to update game object property: ${field}`);
            }
        }
    };

    const deleteGameObjectInMainArea = ({ scenePath, gameObjectIndices }) => {
        if (game?.scene?.jsonAssetPath === scenePath) {
            transformControlsRef.current.detach(); // in case the object is selected
            const gameObject = game.scene.getGameObjectByIndices(gameObjectIndices);
            gameObject.destroy();
        }
    };

    const modifyFogMainArea = ({ scenePath, fog }) => {
        if (game?.scene?.jsonAssetPath === scenePath && game.scene.threeJSScene) {
            game.scene.setFog(fog);
        }
    };

    const updateSceneLightsInMainArea = ({ scenePath, updatedLights }) => {
        if (game?.scene?.jsonAssetPath === scenePath && game.scene.threeJSScene) {
            game.scene.setLights(updatedLights);
        }
    };

    const onMessage = event => {
        const gameDataEvents = {
            addGameObjectToMainArea,
            modifyGameObjectInMainArea,
            deleteGameObjectInMainArea,
            modifyGameObjectTypeInMainArea,
            modifyFogMainArea,
            updateSceneLightsInMainArea
        };
        const eventHandler = gameDataEvents[event.data.eventName];
        if (eventHandler) {
            eventHandler(event.data);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('message', onMessage);
        };
    }, []);

    useEffect(() => {
        if (window.game?.scene) {
            settings.showGrid ? window.game.scene.showGrid() : window.game.scene.hideGrid();
        }
    }, [settings.showGrid]);

    useEffect(() => {
        if (window.game?.scene) {
            settings.showColliders ? window.game.scene.showPhysics() : window.game.scene.hidePhysics();
        }
    }, [settings.showColliders]);

    return (
        <div className="main-area">
            {error ? (
                <div className="main-area-error">
                    <div>
                        <h5>The following error has occured while trying to run this game:</h5>
                        <p>
                            <strong>
                                {error.message}
                            </strong>
                        </p>
                    </div>
                </div>
            ) : (
                <canvas ref={canvasRef} onClick={onClick} onKeyDown={onKeyDown}/>
            )}
            <StatusBar />
        </div>
    );
};

export default MainArea;