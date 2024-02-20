import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';

console.log('Web site running')

const bootstrapStylesheet = document.createElement('link');
bootstrapStylesheet.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
bootstrapStylesheet.setAttribute('rel', 'stylesheet');
bootstrapStylesheet.setAttribute('crossorigin', 'anonymous');
document.head.appendChild(bootstrapStylesheet);

const bootStrapScript = document.createElement('script');
bootStrapScript.setAttribute('src', "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js");
bootStrapScript.setAttribute('integrity', "sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL");
bootStrapScript.setAttribute('crossorigin', 'anonymous');
document.head.appendChild(bootStrapScript);

const html = document.getElementsByTagName('html')[0]
html.style = 'height: 100%'

document.body.innerHTML = '<div id="app" />';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
