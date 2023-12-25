import React, { useEffect, useRef } from "react";
import { Game, THREE } from '../../dist/index';
import { useDispatch, useSelector } from 'react-redux';
import { getFile } from './Redux/FileDataSlice.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { selectItem } from "./Redux/SelectedItemSlice.js";

// Note this does not actually span the main area currently, but it manages the rendering of the canvas in it
const MainArea = ({ dirHandle }) => {
    const dispatch = useDispatch();

    const canvasRef = useRef();

    const gameFileData = useSelector(getFile('game.json'));

    const createGame = async () => {
        const canvas = canvasRef.current;

        if (!canvas) {
            throw new Error('MainArea: unable to reference canvas HTMLElement');
        }

        let orbitControls = null;

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

                    if (orbitControls) {
                        orbitControls.update(deltaTimeInSec);
                    }
                }
            }
        });

        await game.play();

        const defaultCamera = game.renderer.getCamera();
        orbitControls = new OrbitControls(defaultCamera, canvas);
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
                if (intersections.length) {
                    const intersect = intersections[0];
                    const gameObject = game.scene.getGameObjectByThreeJSObject(intersect.object);

                    if (gameObject) {
                        const indices = gameObject.threeJSGroup.userData.indices;
                        dispatch(selectItem(game.scene.jsonAssetPath, 'gameObject', { indices }));
                    }
                }
            }
        }
    };

    return <canvas ref={canvasRef} onClick={onClick} />;
};

export default MainArea;