import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';

console.log('Scene editor running')

const html = document.getElementsByTagName('html')[0]
html.style = 'height: 100%'

document.body.innerHTML = '<div id="app" />';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
