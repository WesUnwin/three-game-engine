import GameObject from "./GameObject";

export interface ComponentJSON {
  name?: string;
  type: string;
}

/**
 * Abstract base class for game object components.
 */
class Component {
  gameObject: GameObject;
  jsonData: any;

  constructor(gameObject, jsonData: ComponentJSON) {
    this.gameObject = gameObject;
    this.jsonData = jsonData;
  }

  getName() {
    return this.jsonData.name;
  }

  getType() {
    return this.jsonData.type;
  }

  load() {
  }

  beforeRender({ deltaTimeInSec }) {
  }
}

export default Component;