const { contextBridge, ipcRenderer } = require('electron');
const log = require('electron-log'); // will write to renderer.log
log.catchErrors({ showDialog: false }); // does not seem to catch errors in the renderer process

log.debug('Electron/preload.js: running script...');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron/preload.js: DOMContentLoaded');

  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`Electron/preload.js: ${dependency} version: ${process.versions[dependency]}`);
  }
});

contextBridge.exposeInMainWorld(
  'electron',
  {
    getResourcesPath: () => process.resourcesPath,
    getDirName: () => __dirname,
    isAppPackaged: () => ipcRenderer.invoke('get-is-packaged'),
    logDebug: (...args) => log.debug(...args),
    logInfo: (...args) => log.info(...args),
    logWarn: (...args) => log.warn(...args),
    logError: (...args) => log.error(...args),
    handleRendererError: errorReport => ipcRenderer.invoke('renderer-error-report', errorReport)
  }
);

log.debug('Electron/preload.js: finished script.');