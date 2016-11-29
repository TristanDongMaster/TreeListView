var entry = require('./entry.json')
var path = require('path');
var webpack = require('webpack');
process.env.NODE_ENV ='production'
process.env.HOT = false

module.exports = {
    // devtool: "source-map",  
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
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            filename: "commons.js",
            name: "commons"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

};




