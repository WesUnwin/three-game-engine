import React from 'react';

const DesktopAndMobile = () => {
  return (
    <>
      <h4 className="text-center">
        A web first engine... but with mobile and desktop app support
      </h4>

      <br />
      <div className="card-group">
        <div className="card">
          <div className="card-header">
            Desktop Apps
          </div>
          <img
            src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/electron_logo.png"
            height="150px"
            style={{ objectFit: 'contain', margin: '10px' }}
            className="card-img-top"
            alt="Electron Logo"
          />
          <div className="card-body">
            <h5 className="card-title">
              Electron
            </h5>
            <p className="card-text">
              See examples/electron for an example of how to package your app as a desktop app, using electron.
              Electron allows you to package web apps as windows, Mac OS and linux desktop apps, powered by chromium.
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                <a href="https://www.electronjs.org/">
                  Visit www.electronjs.org
                </a>
              </small>
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            Mobile Apps
          </div>
          <img
            height="150px"
            style={{ objectFit: 'contain', margin: '10px' }}
            src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/cordova_logo.png"
            className="card-img-top"
            alt="Cordova Logo"
          />
          <div className="card-body">
            <h5 className="card-title">
              Cordova
            </h5>
            <p className="card-text">
              See examples/cordova for an example of how to package and distribute your app as a android or iOS app using Apache Cordova.
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                <a href="https://cordova.apache.org/">
                  Visit cordova.apache.org
                </a>
              </small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopAndMobile