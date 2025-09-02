const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'index.js')
    },
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
        new CopyWebpackPlugin({
            patterns: [ 
                { from: path.resolve(__dirname, 'game_objects'), to: 'game_objects' },
                { from: path.resolve(__dirname, 'models'), to: 'models' },
                { from: path.resolve(__dirname, '*.json'), to: '[name][ext]' }
            ]
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