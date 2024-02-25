import React from 'react';

const Libraries = () => {
  return (
    <>
      <div className="card-group">
        <div className="card">
          <div className="card-header">
            Graphics
          </div>
          <img
            src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/three_logo.webp"
            className="card-img-top feature-card-img"
            alt="Three.js Logo"
          />
          <div className="card-body">
            <h5 className="card-title">
              Three.js
            </h5>
            <p className="card-text">
              Use all the features of three.js, the most powerful and capable WebGL graphics library.
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                <a href="https://threejs.org/">
                  Learn more
                </a>
              </small>
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            Physics
          </div>
          <img
            src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/rapier_logo.png"
            className="card-img-top feature-card-img"
            alt="Rapier 3D Logo"
          />
          <div className="card-body">
            <h5 className="card-title">
              Rapier 3D
            </h5>
            <p className="card-text">
              Leverage the physics and collision detection capabilities of the Rapier phyiscs engine, authored in Rust and compiled to web assembly for maximum performance.
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                <a href="https://rapier.rs/">
                  Learn more
                </a>
              </small>
            </p>
          </div>
        </div>
  
        <div className="card">
          <div className="card-header">
            UI
          </div>
          <img
            src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/three_mesh_ui.png"
            className="card-img-top feature-card-img"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">
              three-mesh-ui
            </h5>
            <p className="card-text">
              Build 3D user interfaces that exist within the Three.js environment, that can be interacted with by mouse and keyboard, or VR controllers.
              Excellent for apps needing VR support, or creating immersive, in-game user interfaces.
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                <a href="https://github.com/felixmariotto/three-mesh-ui">
                  Learn more
                </a>
              </small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Libraries