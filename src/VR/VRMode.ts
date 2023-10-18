const { EventEmitter }  = require('events');

// TODO possibly use promise chaining to serialize calls to isSessionSupported + requestSession
class VRMode extends EventEmitter {
  _session: any;
  webXRSupported: boolean;
  immersiveVRSupported: boolean;
  immersiveVRChecked: boolean;

  // // TODO why do I have to declare these, they are inherited from EventEmitter
  // emit: (eventName: string) => {};
  // on: (eventName: string) => void;

  constructor() {
    super();
    this._session = null;
    this.webXRSupported = "xr" in window.navigator;
    this.immersiveVRSupported = false;
    this.immersiveVRChecked = false;
    if (this.webXRSupported) {
      // @ts-ignore
      window.navigator.xr.addEventListener('devicechange', this._onDeviceChange); 
      this._checkForImmersizeVRSupport();
    }
  }

  isWebXRSupported(): boolean {
    return this.webXRSupported;
  }

  isImmersiveVRSupported(): boolean {
    return this.immersiveVRSupported;
  }

  hasCheckedImmersiveVRSupport(): boolean {
    return this.immersiveVRChecked;
  }

  _setImmersiveVRSupported(value: boolean) {
    if (this.immersiveVRSupported !== value || !this.immersiveVRChecked) {
      this.immersiveVRSupported = value;
      this.immersiveVRChecked = true;
      this.emit('CHANGE');
    }
  }

  _checkForImmersizeVRSupport() {
    if (!this.webXRSupported) {
      this._setImmersiveVRSupported(false);
      return;
    }

    const onCheckComplete = (supported: boolean) => {
      console.log('VRMode: immersive-vr supported: ', supported);
      this._setImmersiveVRSupported(supported);
    };

    const onCheckFailed = (error: Error) => {
      console.error('VRMode: isSessionSupported check failed! error: ', error);
      throw error;
    };

    console.log('VRMode: checking navigator.xr.isSessionSupported("immersive-vr")...');
    // @ts-ignore
    window.navigator.xr.isSessionSupported('immersive-vr').then(onCheckComplete, onCheckFailed);
  }

  enter() {
    if (this._session) {
      console.warn('VRMode: enter(): session already active');
      return;
    }

    // WebXR's requestReferenceSpace only works if the corresponding feature
    // was requested at session creation time. For simplicity, just ask for
    // the interesting ones as optional features, but be aware that the
    // requestReferenceSpace call will fail if it turns out to be unavailable.
    // ('local' is always available for immersive sessions and doesn't need to
    // be requested separately.)
    const sessionInit = {
      optionalFeatures: [
        'local-floor',
        'bounded-floor',
        'hand-tracking',
        //'layers'
      ]
    };

    const onRequestSessionFailed = e => {
      console.error('VRMode: request session failed');
      console.log(e);
    };

    console.log('VRMode: requesting immersive-vr session...');
    // @ts-ignore
    window.navigator.xr.requestSession('immersive-vr', sessionInit).then(this._onSessionStarted, onRequestSessionFailed);
  }

  exit() {
    if (this._session) {
      console.log('VRMode: ending session');
      this._session.end();
    } else {
      console.warn('VRMode: exit(): no active session');
    }
  }

  getSession() {
    return this._session;
  }

  _onDeviceChange = () => {
    console.log('VRMode: navigator.xr devicechange event')
    this._checkForImmersizeVRSupport();
  };

  _onSessionStarted = session => {
    console.log('VRMode: session started');
    session.addEventListener('end', this._onSessionEnded);
    this._session = session;
    this.emit('SESSION_STARTED', session);
    this.emit('CHANGE');
  }

  _onSessionEnded = () => {
    console.log('VRMode: session ended');
    this._session.removeEventListener('end', this._onSessionEnded);
    this._session = null;
    this.emit('SESSION_ENDED');
    this.emit('CHANGE');
  }
}

export default VRMode;