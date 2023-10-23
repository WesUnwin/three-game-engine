

const packagerConfig = {
  extraResource: './assets', // will be packaged in the electron-packager out folder: Resources/assets
  icon: './assets/icons/icon', // when extension is ommited, file is chosen based on platform
  ignore: path => {
    if (!path) {
      return false;
    }

    // Don't include webpack source maps in the build (obviously not desirable)
    const ignoredFileExtensions = [
      '.o',
      '.obj',
      '.js.map'
    ];
    if (ignoredFileExtensions.some(suffix => path.endsWith(suffix))) {
      console.log('\n==> packageConfig ignore(): skipping packaging file (due to file ext): ', path);
      return true;
    }

    const ignorePrefixes = [
      '/.git',
      '/assets_originals',
      '/steam',
      '/Electron',
      '/src',
      '/assets', // Explanation: this is already included as an extraResource, so will be located in the electron-package out folder /Resources/assets
      '/README',
      '/IDEAS.txt'
    ];
    if (ignorePrefixes.some(prefix => path.startsWith(prefix))) {
      return true;
    }

    // Include everything starting with this.
    const includedPrefixes = [
      '/.webpack',

      '/package.json',
      '/package-lock.json'
    ];
    if (includedPrefixes.some(prefix => path.startsWith(prefix))) {
      return false;
    }

    if (path.startsWith('/node_modules')) {
      const ignoredNodemodules = [
        '/node_modules/.bin',
        '/node_modules/electron',
        '/node_modules/electron-prebuilt',
        '/node_modules/electron-prebuilt-compile'
      ]
      if (ignoredNodemodules.some(prefix => path.startsWith(prefix))) {
        return true;
      }
      return false;
    }

    console.log('\n==> packageConfig ignore(): skipping packaging: ', path);
    return true;
  }
};

const config = {
  packagerConfig: packagerConfig,
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'vr_archery',
        setupIcon: './assets/icons/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin'
      ]
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        maintainer: 'Wes Unwin'
      }
    }
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './Electron/webpack.main.config.js',
        renderer: {
          config: './Electron/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './Electron/index.html',
              js: './Electron/renderer.js',
              name: 'main_window',
              preload: {
                js: './Electron/preload.js'
              }
            }
          ]
        }
      }
    ]
  ]
}

module.exports = config;