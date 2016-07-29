var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var getBaseConfig = require('./webpack-base-conf')

module.exports = function() {
  var baseConfig = getBaseConfig('development')

  Object.keys(baseConfig.entry).forEach(function(name) {
    baseConfig.entry[name] = [path.join(__dirname, 'webpack-dev-client')].concat(baseConfig.entry[name])
  })

  return merge(baseConfig, {
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
}
