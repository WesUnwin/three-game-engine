import React, { useEffect, useState } from 'react';
import ExamplesSidebar from './ExamplesSidebar.jsx';
import CurrentExample from './CurrentExample.jsx';

const Examples = () => {
  const [currentExample, setCurrentExample] = useState(null)

  const examples = [
    {
      thumbnail: 'https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/images/first_person_kinematic_character_controller_example_thumbnail.png',
      name: 'first_person_kinematic_character_controller_example',
      label: 'First-Person Kinematic Character Controller',
      description: 'Demonstrates using the KinematicCharacterController class to create a first-person controlled character game object.',
      code: 'https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/examples/first_person_kinematic_character_controller/index.js',
      footer: (
        <div className="current-example-footer">
          <h6 style={{ textAlign: 'center' }}>Controls:</h6>
          <ul>
            <li>Click on the iframe to allow the game to capture your mouse (ESC to escape).</li>
            <li>Move your mouse to look around.</li>
            <li>Use WSAD (or arrow keys) to move relative to the direction your facing.</li>
            <li>Hold shift to run.</li> 
          </ul>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!currentExample) {
      setCurrentExample(examples[0])
    }
  }, [currentExample?.name])

  return (
    <div className="examples">
      <ExamplesSidebar
        examples={examples}
        currentExample={currentExample}
        setCurrentExample={setCurrentExample}
      />

      {currentExample &&
        <CurrentExample currentExample={currentExample} />
      }
    </div>
  );
};

export default Examples;