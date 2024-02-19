const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './web_site/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
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
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
    }
};