const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    getResourcesPath: () => process.resourcesPath,
    getDirName: () => __dirname,
    isAppPackaged: () => ipcRenderer.invoke('get-is-packaged')
  }
);
