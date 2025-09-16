import Component, { ComponentJSON } from "../Component";
import * as THREE from 'three';
import { setObject3DProps } from '../util/ThreeJSHelpers';
import { Vector3Data } from "../types";

export interface LightComponentJSON extends ComponentJSON {
  lightType: string;
  position?: Vector3Data;
}

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
<<<<<<< HEAD
    const LightClass = lightTypes[this.jsonData.lightType];
    if (LightClass) {
      light = new LightClass();
      light.name = this.jsonData.lightType.toLowerCase();
    } else {
      throw new Error(`GameObject: error creating ThreeJS light: unknown light type: ${this.jsonData.lightType}`);
    }

    const objectProps = { ...this.jsonData };
    delete objectProps.lightType;
=======
    const LightClass = lightTypes[this.jsonData.type];
    if (LightClass) {
      light = new LightClass();
      light.name = this.jsonData.type.toLowerCase();
    } else {
      throw new Error(`GameObject: error creating ThreeJS light: unknown light type: ${this.jsonData.type}`);
    }

    const objectProps = { ...this.jsonData };
    delete objectProps.type;
>>>>>>> main
    setObject3DProps(light, objectProps);

    this.light = light;
    this.gameObject.threeJSGroup.add(this.light);
  }
}

export default LightComponent;
