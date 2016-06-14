var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var baseConfig = require('./webpack-base-conf')
var definition = require('./webpack-definition')

var SOURCE_MAP = false

module.exports = merge(baseConfig, {
  stats: {
    children: false
  },
  devtool: SOURCE_MAP ? '#source-map' : false,
  output: {
    chunkFilename: '[id].js',
    publicPath: JSON.parse(definition().server.staticRoot)
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.CommonsChunkPlugin('js/common.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
})
