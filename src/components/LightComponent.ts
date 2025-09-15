import Component from "../Component";
import * as THREE from 'three';
import { setObject3DProps } from '../util/ThreeJSHelpers';

class LightComponent extends Component {
  light: THREE.Light;

  load() {
    let light = null;
    const lightTypes = {
      AmbientLight: THREE.AmbientLight,
      DirectionalLight: THREE.DirectionalLight,
      HemisphereLight: THREE.HemisphereLight,
      PointLight: THREE.PointLight,
      RectAreaLight: THREE.RectAreaLight,
      SpotLight: THREE.SpotLight
    };
    const LightClass = lightTypes[this.jsonData.type];
    if (LightClass) {
      light = new LightClass();
      light.name = this.jsonData.type.toLowerCase();
    } else {
      throw new Error(`GameObject: error creating ThreeJS light: unknown light type: ${this.jsonData.type}`);
    }

    const objectProps = { ...this.jsonData };
    delete objectProps.type;
    setObject3DProps(light, objectProps);

    this.light = light;
    this.gameObject.threeJSGroup.add(this.light);
  }
}

export default LightComponent;
