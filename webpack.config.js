var entry = require('./entry.json')
var path = require('path');
var webpack = require('webpack');

process.env.NODE_ENV ='development'
process.env.HOT = true

module.exports = {
    entry:entry,
    output: {
        path: path.join(__dirname, 'dist'), 
        publicPath: '/static/',     
        filename: '[name].bundle.js',
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                loader: "html"
            }
        ]
    },
    resolve: {
        alias: {
            
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            filename: "commons.js",
            name: "commons"
        })
    ]

};




