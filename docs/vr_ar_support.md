## Virtual Reality (VR) and Augmented Reality (AR) Support
Three.js and three-game-engine have functionality to enable your to build VR/AR apps, powered by the WebXR javascript APIs. WebXR is designed to use OpenXR APIs at an operating system level to interact with compatible VR/AR devices.

The game.renderer.vrMode object can be used to enter and exit immersive VR:

```
  // To request to enter immersive vr call:
  game.renderer.vrMode.enter();

  // To exit immsersive vr:
  game.renderer.vrMode.exit();
```