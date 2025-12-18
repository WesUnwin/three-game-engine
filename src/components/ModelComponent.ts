import Component, { ComponentJSON } from "../Component";
import GLTFAsset from "../assets/GLTFAsset";
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import { setObject3DProps } from "../util/ThreeJSHelpers";
import { Vector3Data } from "../types";

export interface ModelComponentJSON extends ComponentJSON {
  assetPath: string;
  position?: Vector3Data;
}

class ModelComponent extends Component {
  async load() {
    const scene = this.gameObject.getScene();
    const asset = await scene.game.loadAsset(this.jsonData.assetPath);
    if (!(asset instanceof GLTFAsset)) {
      throw new Error(`ModelComponent: asset found at ${this.jsonData.assetPath} in AssetStore should be a GLTFAsset`);
    }
    const clonedModel = clone(asset.data.scene);
    clonedModel.children.forEach(object3D => {
      const objectProps = { ...this.jsonData };
      delete objectProps.assetPath;
      setObject3DProps(object3D, objectProps);
      object3D.userData.model = true;
      this.gameObject.threeJSGroup.add(object3D);
    });
  }
}

export default ModelComponent;
