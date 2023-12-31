import React, { useEffect, useRef } from "react";
import { Game, THREE } from '../../dist/index';
import { useDispatch, useSelector } from 'react-redux';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls, TransformControlsPlane } from 'three/examples/jsm/controls/TransformControls.js';
import { getSelectedItem, selectItem } from "./Redux/SelectedItemSlice.js";
import { mergeFileData, updateGameObject } from "./Redux/FileDataSlice.js";

// Note this does not actually span the main area currently, but it manages the rendering of the canvas in it
const MainArea = ({ dirHandle }) => {
    const dispatch = useDispatch();

    const canvasRef = useRef();
    const orbitControlsRef = useRef();
    const transformControlsRef = useRef();

    const selectedItem = useSelector(getSelectedItem());

    const createGame = async () => {
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
                    const height = window.innerHeight - 5;
                
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

        await game.play();

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

            const { indices } = threeJSObject.userData;

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
                dispatch(updateGameObject(filePath, indices, field, value));
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

                const gameObjectsIntersected = relevantIntersections.map(intersect => game.scene.getGameObjectByThreeJSObject(intersect.object)).filter(g => g);

                if (gameObjectsIntersected.length) {
                    const gameObject = gameObjectsIntersected[0];
                    const indices = gameObject.threeJSGroup.userData.indices;
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
        }
    };

    useEffect(() => {
        const transformControls = transformControlsRef.current;
        if (transformControls) {
            if (selectedItem?.type === 'gameObject') {
                const indices = selectedItem.params.indices;
                const selectedGameObject = game.scene.find(gameObject => JSON.stringify(gameObject.threeJSGroup.userData.indices) === JSON.stringify(indices));
    
                game.scene.threeJSScene.add(transformControls);
                
                transformControls.attach(selectedGameObject.threeJSGroup);
            } else {
                transformControls.detach();
            }
        }
    }, [selectedItem?.type, selectedItem?.params]);

    window.addEventListener('keydown', onKeyDown);
    return <canvas ref={canvasRef} onClick={onClick} onKeyDown={onKeyDown}/>;
};

export default MainArea;