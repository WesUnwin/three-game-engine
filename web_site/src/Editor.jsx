import React, { useEffect } from 'react';

const useIframe = true;
const sceneEditorURL = "https://wesunwin.github.io/three-game-engine/editor"

const Editor = () => {
  useEffect(() => {
    if (!useIframe) {
      window.location = sceneEditorURL;
    }
  }, [useIframe]);

  return useIframe ? (
    <iframe
      className="editor-iframe"
      src={sceneEditorURL}
    />
  ) : <p>
    Redirecting to scene editor...
  </p>
};

export default Editor;