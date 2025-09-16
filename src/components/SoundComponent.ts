import Component, { ComponentJSON } from "../Component";
import SoundAsset from "../assets/SoundAsset";
import { createPositionalAudio } from "../util/ThreeJSHelpers";
import * as THREE from 'three';

export interface SoundComponentJSON extends ComponentJSON {
  assetPath: string;
  name: string;
  loop?: boolean;
  autoplay?: boolean;
  volume?: number;
  playbackRate?: number;
  refDistance?: number;
  rolloffFactor?: number;
  distanceModel?: string;
  maxDistance?: number;
  directionalCone?: {
    coneInnerAngle: number;
    coneOuterAngle: number;
    coneOuterGain: number;
  };
}

class SoundComponent extends Component {
  positionalAudio: THREE.PositionalAudio;

  async load() {
    const scene = this.gameObject.getScene();
    const asset = await scene.game.loadAsset(this.jsonData.assetPath);
    if (!(asset instanceof SoundAsset)) {
        throw new Error(`GameObject: asset found at ${this.jsonData.assetPath} in AssetStore should be a SoundAsset`);
    }
    const audioBuffer = asset.getData() as AudioBuffer;
    const audioListener = scene.game.renderer.getCameraAudioListener();
    const name = this.jsonData.name || `sound`;
    this.positionalAudio = createPositionalAudio(this.jsonData, audioBuffer, audioListener, name);
    this.gameObject.threeJSGroup.add(this.positionalAudio);
  }

  playSound(delayInSec: number = 0, detune: number | null = null) {
    if (this.positionalAudio.isPlaying) {
      this.positionalAudio.pause(); // elsewise nothing will happen
    }
    this.positionalAudio.play(delayInSec);
    if (detune !== null) {
      this.positionalAudio.setDetune(detune); // set this here, rather than when creating the positionalAudio as setDetune can't be called till playback (where audio.source is set)
    }
  }
}

export default SoundComponent;
