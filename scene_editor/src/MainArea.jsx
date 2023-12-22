import React, { useEffect, useRef } from "react";
import { Game, Scene } from '../../dist/index';

// Note this does not actually span the main area currently, but it manages the rendering of the canvas in it
const MainArea = ({ dirHandle }) => {
    const canvasRef = useRef();

    const createGame = async () => {
        const canvas = canvasRef.current;

        if (!canvas) {
            throw new Error('MainArea: unable to reference canvas HTMLElement');
        }

        console.log('MainArea: creating Game...');
        window.game = new Game(dirHandle, {
            rendererOptions: {
                canvas,
                pixelRatio: window.devicePixelRatio,
                beforeRender: () => {
                    const width = window.innerWidth - 400;
                    const height = window.innerHeight - 5;
                
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style = `width: ${width}px; height: ${height}px;`
                
                    window.game.renderer.setSize(width, height)
                }
            }
        });

        await game.loadScene('TestAreaScene');
   
        game.play();
    };

    useEffect(() => {
        if (dirHandle && canvasRef.current) {
            createGame();
        }
    }, [dirHandle, canvasRef])

    return <canvas ref={canvasRef} />;
};

export default MainArea;