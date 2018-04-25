/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:21:05
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-25 17:47:32
*/
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { getBaseConf, getCustomConf } = require('./webpack-base-conf')

module.exports = (env, filter) => {
  let baseConfig = getBaseConf('development', filter)
  if (!baseConfig) {
    return
  }

  Object.keys(baseConfig.entry).forEach(name => {
    let entry = baseConfig.entry[name]
    baseConfig.entry[name] = [
      'react-hot-loader/patch',
      // 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
      entry
    ]
  })

  let customConfig = getCustomConf('development')

  return merge(
    baseConfig,
    {
      cache: true,
      devtool: '#eval-source-map',
      output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
      },
      plugins: [new webpack.HotModuleReplacementPlugin()]
    },
    customConfig
  )
}
