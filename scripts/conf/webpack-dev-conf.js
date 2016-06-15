var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var merge = require('webpack-merge')
var baseConfig = require('./webpack-base-conf')

Object.keys(baseConfig.entry).forEach(function(name) {
  baseConfig.entry[name] = ['../../scripts/conf/webpack-dev-client'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig, {
  devtool: '#eval-source-map',
  output: {
  	publicPath: '/static/'
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.CommonsChunkPlugin('js/common.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
})
