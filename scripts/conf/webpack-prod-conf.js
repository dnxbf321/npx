var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack-base-conf')

var SOURCE_MAP = false

module.exports = merge(baseConfig, {
  stats: {
    children: false
  },
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
  ]
})
