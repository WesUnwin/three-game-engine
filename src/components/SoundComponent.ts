import Component, { ComponentJSON } from "../Component";
import SoundAsset from "../assets/SoundAsset";
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
    this.positionalAudio = this._createPositionalAudio(this.jsonData, audioBuffer, audioListener, name);
    this.gameObject.threeJSGroup.add(this.positionalAudio);
  }

  _createPositionalAudio = (json: SoundComponentJSON, audioBuffer: AudioBuffer, audioListener: THREE.AudioListener, name: string) => {
    const positionalAudio = new THREE.PositionalAudio(audioListener);
    positionalAudio.name = name;
    positionalAudio.setBuffer(audioBuffer);

    if (typeof json.loop === 'boolean') {
        positionalAudio.setLoop(json.loop);
    }
    if (typeof json.autoplay === 'boolean') {
        positionalAudio.autoplay = json.autoplay;
    }
    if (typeof json.volume === 'number') {
        positionalAudio.setVolume(json.volume);
    }
    if (typeof json.playbackRate === 'number') {
        positionalAudio.setPlaybackRate(json.playbackRate);
    }

    // NOTE: detune can not be set until until the sound is played as that
    // is when positionalAudio.source is established (not during setBuffer)

    if (typeof json.refDistance === 'number') {
        positionalAudio.setRefDistance(json.refDistance);
    }
    if (typeof json.rolloffFactor === 'number') {
        positionalAudio.setRolloffFactor(json.rolloffFactor);
    }
    if (typeof json.distanceModel === 'string') {
        positionalAudio.setDistanceModel(json.distanceModel);
    }
    if (typeof json.maxDistance === 'number') {
        positionalAudio.setMaxDistance (json.maxDistance);
    }
    if (typeof json.directionalCone === 'object') {
        positionalAudio.setDirectionalCone(
            json.directionalCone.coneInnerAngle,
            json.directionalCone.coneOuterAngle,
            json.directionalCone.coneOuterGain
        );
    }

    return positionalAudio;
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
