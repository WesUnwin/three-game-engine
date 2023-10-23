# Example three-game-engine App Using Electron to Package as a Desktop App

In this folder is an example app that showcases how you can package and distribute your
web app (that might use the three-game-engine) as a desktop app, using:

- Electron:  electron allows you to run your web app in a browser window, thus quickly allowing you to
             run your web app as a desktop application.

- Electron-forge:  allows you to package (using electron-package internally) and build installers (using makers)
  so that you can easily distribute your application.

# How to run (in unpackaged mode):

```
  cd <this repo>/examples/electron

  npm install

  npm run electron-start
```

# How to package
This will "package" your app, getting electron-forge to use electron-package to produce a folder
with all the application files needed to run your app (in out/<app name>).

```
  cd <this repo>/examples/electron

  npm install

  npm run electron-package
```

See packager configuration in ./Electron/forge.config.js.


# How build an installer
This will run all makers, which will build an installer as a single file (...Setup.exe, .dmg, etc.)
that you can distribute. The installer once run by the user will install all the application files
and setup icons, start menu entries, etc.

This will build an installer specific to your current OS.

For windows:
  - this is a __Setup.exe, Squirrel.windows style installer, that can use electron's autoUpdater.

For Mac:
  - will produce a disk image installer (a .dmg file), this also supports using electron's autoUpdater.

For Linux:
  - this will produce a .deb installer (installed via sudo dpkg -i __.deb)

See maker configuration in ./Electron/forge.config.js.

```
  cd <this repo>/examples/electron

  npm install

  npm run electron-make
```
