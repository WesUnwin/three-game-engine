// to use this run:
// npx webpack --config .\prodWebpackConfig.js

const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
      index: './index.js'
  },
  output: {
    filename: 'first-person-kinematic-character-controller-example.js',
    path: path.resolve(__dirname, '../../docs/examples')
  },
  module: {
      rules: [
          {
            test: /\.js$/,
            use: 'babel-loader',
          },
          {
              test: /\.jsx$/,
              use: 'babel-loader',
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|j?g|svg|gif)?$/,
            use: 'file-loader'
          }
      ]
  }
};