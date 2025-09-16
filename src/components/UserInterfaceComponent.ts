import Component from "../Component";
import * as UIHelpers from '../ui/UIHelpers';

class UserInterfaceComponent extends Component {
  async load() {
    const scene = this.gameObject.getScene();
    const assetStore = scene.game.assetStore;
    await UIHelpers.createUIComponent(this.jsonData, this.gameObject.threeJSGroup, assetStore);
  }
}

export default UserInterfaceComponent;
