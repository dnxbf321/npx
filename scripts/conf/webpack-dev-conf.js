var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack-base-conf')

Object.keys(baseConfig.entry).forEach(function(name) {
  baseConfig.entry[name] = ['../scripts/conf/webpack-dev-client'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig, {
  cache: true,
  devtool: '#eval-source-map',
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
})
