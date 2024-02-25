import React from 'react';

const Features = () => {
  return (
    <>
      <h4 className="text-center">
        Features
      </h4>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col">
          <div className="card">
            <img
              src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/free.jpg"
              className="card-img-top feature-card-img"
              alt="Free"
            />
            <div className="card-body">
              <h5 className="card-title">
                100% Free
              </h5>
              <p className="card-text">
                Totally free for use in any or all commercial and/or personal projects.
                You may fork it on GitHub and customize the engine to your liking.
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <img
              src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/github_logo.webp"
              className="card-img-top feature-card-img"
              alt="Free"
            />
            <div className="card-body">
              <h5 className="card-title">
                Open Source
              </h5>
              <p className="card-text">
                Completely open source (including all dependencies), with easy to read, easy to extend source code. Contributions from the community our welcome and encouraged.
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <img
              src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/typescript_logo.png"
              className="card-img-top feature-card-img"
              alt="Free"
            />
            <div className="card-body">
              <h5 className="card-title">
                Typescript Support
              </h5>
              <p className="card-text">
                Written in typescript for easy integration and comprehesion of the library's API.
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <img
              src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/documentation.jpg"
              className="card-img-top feature-card-img"
              alt="Free"
            />
            <div className="card-body">
              <h5 className="card-title">
                Documentation & Examples
              </h5>
              <p className="card-text">
                See the online documentation on this site, or view the markdown documents in the docs/ folder of the git repo offline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features