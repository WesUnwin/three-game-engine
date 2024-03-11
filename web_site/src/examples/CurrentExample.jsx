import React, { useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const CurrentExample = ({ currentExample }) => {
  const iframeRef= useRef();

  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');

  const iframeSrc = `https://wesunwin.github.io/three-game-engine/examples/${currentExample.name}.html`;

  const reloadIframe = () => {
    iframeRef.current.src = iframeRef.current.src + '';
  };

  useEffect(() => {
    if (currentExample?.code) {
      setCode('Loading...')
      window.fetch(currentExample.code)
            .then(response => response.text())
            .then(code => setCode(code))
    }
  }, [currentExample?.code])

  return (
    <div className="current-example">
      <h4>{currentExample.label}</h4>

      <div className="current-example-content">
        <div className="current-example-preview">
          <p>
            {currentExample.description}
          </p>

          <iframe
            ref={iframeRef}
            className="current-example-iframe"
            src={iframeSrc}
          />
        </div>

        {currentExample.footer}

        <button onClick={() => setShowCode(!showCode)}>
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
        &nbsp;
        <button onClick={reloadIframe}>
          Restart Demo
        </button>

        {showCode &&
          <div className="current-example-code">
            <CodeMirror
              theme={vscodeDark}
              value={code}
              extensions={[javascript({ jsx: true })]}
              onChange={() => {}}
            />
          </div>
        }

        <div className="current-example-run-locally-instructions">
          <h5 style={{ textAlign: 'center' }}>Want to run this example locally?</h5>
          <p style={{ textAlign: 'center' }}>You can run this example locally, allowing you to play around with the source code:</p>
          <ul>
            <li>Clone this repo (git clone git@github.com:WesUnwin/three-game-engine.git).</li>
            <li>Run "npm install" to install all dependencies.</li>
            <li>Navigate to this examples folder: "cd examples/{currentExample.name}"</li>
            <li>Run "node server.js"</li>
            <li>A browser tab will automatically be opened (url: localhost:8080).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentExample