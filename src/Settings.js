import EventEmitter from 'events';

import Util from './Util';

const LOCAL_STORAGE_KEY = 'game_settings';

class Settings {
  static _emitter = new EventEmitter();
  static _settings = null;
  static _promiseChain = Promise.resolve(); // allow at most 1 save() or load() operation at a time.

  static on(event, listener) {
    Settings._emitter.on(event, listener);
  }

  static off(event, listener) {
    Settings._emitter.off(event, listener);
  }

  static _getInitialSettings() {
    return {
      max_arrows: 30,
      bow_in_right_hand: false, // If true, the bow will be held in the right hand, and drawn with the left hand (for left handed users).
      draw_distance_min: 0.15,  // When the two controllers are this distance or less apart, bow is fully NOT drawn (drawOffset = 0)
      draw_distance_max: 0.5   // When the two controllers are this distance or more apart, bow is fully drawn (drawOffset = 1)
    };
    // Other setttings:
    //   unlocked_level_<level name>: true
    //   highest_round_unlocked_for_<level name>: 7
    //   high_scores_for_<level name>: [ { round: 10, score: 950 }, { round: 9, score: 1000 }, .. ] // must be sorted by round, highest round number first
  }

  static load() {
    Settings._promiseChain = Settings._promiseChain.then(() => {
      console.log(`Settings: loading settings...`);
  
      let savedSettings = null;
      try {
        savedSettings = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      } catch(error) {
        console.error(`Settings: error reading settings from localStorage: ${error}`);
      }

      if (savedSettings) {
        console.log(`Setings: saved settings detected, parsing data...`);
        try {
          Settings._settings = JSON.parse(savedSettings);
          Settings._validate();
          console.log('Settings: saved settings successfully loaded.');
        } catch(error) {
          console.error(`Settings: error parsing saved settings: ${error}. Loading default settings instead.`);
          Settings._settings = Settings._getInitialSettings();
        }
      } else {
        console.log(`Settings: no saved settings detected, loading initial settings...`);
        Settings._settings = Settings._getInitialSettings();
      }

      console.log(`Settings: loaded values: ${JSON.stringify(Settings._settings)}`);
      Settings._emitter.emit('CHANGE');
    });
  }

  static get(key) {
    return Settings._settings[key];
  }

  static set(key, value) {
    console.log(`Settings: setting ${key} to ${value}`);
    Settings._settings[key] = value;
    Settings._save();
  }

  static _save() {
    Settings._debouncedSave();
  }

  static reset() {
    console.log(`Settings: clearing settings...`);
    Settings._settings = Settings._getInitialSettings();
    console.log('Settings: initial settings loaded.');
    Settings._save();
  }

  static _validate() {
    const maxArrows = Settings._settings.max_arrows;
    if (typeof maxArrows !== 'number' || maxArrows <= 0) {
      throw new Error('Settings: invalid settings, max_arrows must be a numeric value > 0');
    }
  }

  static _debouncedSave = Util.debounce(() => {
    // Use promise chain to serialize (only one save/load operation at a time)
    Settings._promiseChain = Settings._promiseChain.then(async () => {
      console.log('Settings: saving...');

      let saveError = null;
      try {
        const json = JSON.stringify(Settings._settings);
        localStorage.setItem(LOCAL_STORAGE_KEY, json);
      } catch (error) {
        saveError = error;
      }

      if (saveError) {
        Settings._onSaveError(saveError);
      } else {
        Settings._onSaveSuccess();
      }
    });
  }, 500);

  static _onSaveSuccess = () => {
    console.log('Settings: settings saved successfully.');
    Settings._emitter.emit('SAVED');
  };

  static _onSaveError = error => {
    console.warn(`Settings: error saving settings: ${error}`);
    Settings._emitter.emit('SAVE_ERROR');
  };
}

export default Settings;