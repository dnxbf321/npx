var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var JsDocPlugin = require('jsdoc-webpack-plugin')
var baseConfig = require('./webpack-base-conf')
var jsdocConfig = require('../../jsdoc.json')

var SOURCE_MAP = false

module.exports = merge(baseConfig, {
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
  ].concat(jsdocConfig.enable ?
    new JsDocPlugin({
      conf: './jsdoc.json'
    }) : [])
})
