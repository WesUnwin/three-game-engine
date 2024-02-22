## Scene Fog
A scene can optionally use fog to create an effect that limits visibility tinting the scene and its game objects the farther away from the camera they are.

A scene's fog settings are directly used to construct a ThreeJS Fog object and set it as the underlying threeJS scene's .fog property.

You can specify the fog for a scene in it's Scene JSON files (See Scene JSON files), or you can change it during runtime by calling:

```
  scene.setFog({
    color: '#ff0000', // red
    near: 1.0, // fog will be applied to things 1 meter and farther into from the camera
    far: 1000.0  // at this max distance into the camera, items are tinted fully (fully red)
  })

  // or pass a THREE.Fog object:
  const fog = new THREE.Fog(0xff0000, 1.0, 1000.0);
  scene.setFog(fog);
```