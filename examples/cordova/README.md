# three-game-engine Cordova Example

Cordova allows you package and distribute a web app as an android and/or ios app.

You'll want to go through the steps to setup cordova first.


This cordova project uses the cordova-webpack-plugin to compile src/index.js plus all its dependecies to www/index.bundle.js.
This is guided by the webpack config file: webpack.config.js.


# Build

```
npm install

cordova build
```

src/index will be compiled to www/index.bundle.js, which is then loaded by a script tag in www/index.html

# Run

To test running it in your browser:
```
cd examples/cordova
cordova run -- --livereload
```

To run an an android device plugged into your computer, enabled for android debugging/development:
```
cd examples/cordova
cordova run android
```