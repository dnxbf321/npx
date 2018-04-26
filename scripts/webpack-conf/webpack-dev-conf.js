/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:21:05
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 16:17:33
*/
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { getBaseConf, getCustomConf } = require('./webpack-base-conf')

module.exports = env => {
  let baseConfig = getBaseConf('development')
  if (!baseConfig) {
    return
  }

  Object.keys(baseConfig.entry).forEach(name => {
    let entry = baseConfig.entry[name]
    baseConfig.entry[name] = ['react-hot-loader/patch', entry]
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
