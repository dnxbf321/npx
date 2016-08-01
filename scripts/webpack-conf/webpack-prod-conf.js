var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var JsDocPlugin = require('jsdoc-webpack-plugin')
var getBaseConfig = require('./webpack-base-conf')
var getConfig = require('../util/config')

var SOURCE_MAP = false

module.exports = function(env) {
  var config = getConfig(env)
  return merge(getBaseConfig(env), {
    stats: {
      children: false
    },
    cache: false,
    devtool: SOURCE_MAP ? '#source-map' : false,
    output: {
      chunkFilename: '[id].js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        exclude: /node_modules/
      })
    ].concat(config.jsdoc ?
      new JsDocPlugin({
        conf: path.join(process.cwd(), '.jsdoc.json')
      }) : [])
  })
}