import React, { useEffect } from 'react';

const useIframe = true;
const examplesPageURL = "https://wesunwin.github.io/three-game-engine/examples"

const Examples = () => {
  useEffect(() => {
    if (!useIframe) {
      window.location = examplesPageURL;
    }
  }, [useIframe]);

  return useIframe ? (
    <iframe
      className="examples-iframe"
      src={examplesPageURL}
    />
  ) : <p>
    Redirecting to examples page...
  </p>
};

export default Examples;