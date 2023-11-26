import React from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './src/Sidebar.jsx';
import { Game, Scene } from '../dist/index.js';

console.log('Scene editor running')

const html = document.getElementsByTagName('html')[0]
html.style = 'height: 100%'

document.body.style = 'height: 100%; margin: 0px;'

document.body.innerHTML = '' +
'<div id="app" style="width: 100%; height: 100%; display: flex; flex-direction: row; justify-content: stretch; align-items: stretch;">' +
'  <div id="main_area">' +
'    <canvas id="canvas" style="width: 100%; height: 100%;" />' +
'  </div>' +
'  <div id="sidebar_container" style="flex-grow: 1"></div>' +
'</div>'

const canvas = document.getElementById('canvas');

window.game = new Game({
    rendererOptions: {
        canvas: canvas
    },
    assetOptions: {
        baseURL: 'http://localhost:8080/assets'
    }
})

window.game.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

window.addEventListener('resize', () => {
    window.game.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

const scene = new Scene();

scene.beforeRender = ({ deltaTimeInSec }) => {
    const width = window.innerWidth - 400;
    const height = window.innerHeight - 5;

    canvas.width = width;
    canvas.height = height;
    canvas.style = `width: ${width}px; height: ${height}px;`

    window.game.renderer.setSize(width, height)
};

await game.loadScene(scene);

game.play();

const container = document.getElementById('sidebar_container');
const root = createRoot(container);
root.render(<Sidebar />);
