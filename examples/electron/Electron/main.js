const { app, BrowserWindow, session, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const log = require('electron-log');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  log.debug('Exiting app (electron-squirrel-startup)');
  app.quit();
}

const createMainWindow = () => {
  // Needed for running app to access stuff in the Resources/assets folder
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': '*'
      }
    })
  });

  // Create the browser window.
  log.debug('Electron/main.js: creating main browser window');
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false
    }
  });

  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  log.debug('Electron/main app ready event');
  createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.debug('Electron/main app window-all-closed event');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  log.debug('Electron/main app activate event');
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.handle('get-is-packaged', _event => {
  return app.isPackaged;
});
