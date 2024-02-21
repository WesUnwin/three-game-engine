## GameObjects
Scenes contain game objects which represent things like playable and non-playable characters, scenary objects, collectible objects, and other type of object that might exist in a scene.

Each GameObject contains a Three.js group object, that acts as a container for Three.js objects like:
- models
- lights
- PositionalAudio instances
- etc.

A GameObject can also optionally have a RapierJS RigidBody, allowing it to have physics related properties.
See <a href="https://wesunwin.github.io/three-game-engine/#/docs">GameObject Physics</a>.