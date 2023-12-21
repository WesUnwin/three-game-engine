import React, { useEffect, useRef } from "react";
// import { Game, Scene } from '../dist/index.js';

// Note this does not actually span the main area currently, but it manages the rendering of the canvas in it
const MainArea = () => {
    const canvasRef = useRef();

    const createGame = () => {
        // window.game = new Game({
        //     rendererOptions: {
        //         canvas: canvas
        //     },
        //     assetOptions: {
        //         baseURL: 'http://localhost:8080/assets'
        //     }
        // })
        
        // window.game.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // window.addEventListener('resize', () => {
        //     window.game.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        // });
        
        // const scene = new Scene();
        
        // scene.beforeRender = ({ deltaTimeInSec }) => {
        //     const width = window.innerWidth - 400;
        //     const height = window.innerHeight - 5;
        
        //     canvas.width = width;
        //     canvas.height = height;
        //     canvas.style = `width: ${width}px; height: ${height}px;`
        
        //     window.game.renderer.setSize(width, height)
        // };
        
        // await game.loadScene(scene);
        
        // game.play();
    };

    useEffect(() => {

    }, [])

    return <canvas />;
};

export default MainArea;