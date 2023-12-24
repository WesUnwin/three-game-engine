import React, { useEffect, useRef } from "react";
import { Game, Scene } from '../../dist/index';
import { useSelector } from 'react-redux';
import { getFile } from './Redux/FileDataSlice.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Note this does not actually span the main area currently, but it manages the rendering of the canvas in it
const MainArea = ({ dirHandle }) => {
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

    return <canvas ref={canvasRef} />;
};

export default MainArea;