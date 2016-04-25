var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')

var SOURCE_MAP = true

module.exports = merge(baseConfig, {
  stats: {
    children: false
  },
  devtool: SOURCE_MAP ? '#source-map' : false,
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
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
