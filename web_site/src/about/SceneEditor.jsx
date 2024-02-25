import React from 'react';

const SceneEditor = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4 className="text-center">
        Scene Editor
      </h4>

      <p className="text-center">
        Create and manage your scenes using the include scene editor tool, or directly edit the .json files used by your game. <br />
        Control the positioning, lighting, appearance and physics properties of game objects. <br />
        Asset files and other files are storred externally allowing for re-use across scenes.
      </p>

      <img
        style={{
          height: '400px',
          objectFit: 'contain',
          margin: '0 auto',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px'
        }}
        src="https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/scene_editor.png"
      />
    </div>
  );
};

export default SceneEditor