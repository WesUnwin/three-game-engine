const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
      index: './web_site/index.js'
  },
  output: {
    filename: 'website.js',
    path: path.resolve(__dirname, '../docs/')
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