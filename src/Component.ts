import GameObject from "./GameObject";

/**
 * Abstract base class for game object components.
 */
class Component {
  gameObject: GameObject;
  jsonData: any;

  constructor(gameObject, jsonData = {}) {
    this.gameObject = gameObject;
    this.jsonData = jsonData;
  }

  load() {
  }

  beforeRender({ deltaTimeInSec }) {
  }
}

export default Component;