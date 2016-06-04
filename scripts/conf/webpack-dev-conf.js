var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack-base-conf')

Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name] = ['../../scripts/conf/webpack-dev-client'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig, {
  devtool: '#eval-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  	new webpack.IgnorePlugin(/vertx/),
  	new webpack.optimize.CommonsChunkPlugin('js/common.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
})
