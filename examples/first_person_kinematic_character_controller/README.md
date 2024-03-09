# First Person Kinematic Character Controller Demo
Demonstrates using the KinematicCharacterController class to create a first-person perspective character that
can be moved around using input like keyboard/mouse and gamepad input.

The example creates a GameObject extending KinematicCharacterController imported from this library:
```
  import { KinematicCharacterController } from "three-game-engine";
  ...

  class ExampleCharacter extends KinematicCharacterController {
    constructor(parent, options) {
      ...
    }
  }
```


## Controls:
 Keyboard: WSAD or up/down/left/right arrow keys. (Eg. W moves forward relative to the direction the character is facing)
 Mouse: click to allow your mouse to be captured by the game (use ESC key to escape your mouse from the game)
        move your mouse around to make the playable character look around.


## To Run Locally:
Clone this repo, npm install, the run the following command which will
run a local server using webpack dev server.

```sh
cd examples/first_person_kinematic_character_controller
node server.js
```
Open a browser (if not automatically opened) and view the example from:
http://localhost:8080


## To Publish to the github.io Website (done by myself, WesUnwin)
Run the following command in this folder:

```sh
npx webpack --config .\prodWebpackConfig.js
```

This will re-buils the prod webpack pack in docs/examples/... using the source code in this folder.
Then commit and push the changes to the docs/ folder in this repo:

```sh
git add ../../docs
git commit -m "..."
git push
```

Upon pushing changes to /docs, this will automatically enqueue a github action, to republish the docs/ fodler to the github.io website:
https://wesunwin.github.io/three-game-engine/#/examples

Wait for this action to complete (can take 5-10 minutes).
