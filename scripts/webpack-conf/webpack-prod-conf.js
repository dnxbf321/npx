const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const JsDocPlugin = require('jsdoc-webpack-plugin')
const { getBaseConf, getCustomConf } = require('./webpack-base-conf')
const getConfig = require('../util/config')

let SOURCE_MAP = false
module.exports = env => {
  let config = getConfig(env)
  if (!config) {
    return
  }

  let customConfig = getCustomConf(env)
  return merge(
    getBaseConf(env),
    {
      stats: {
        children: false
      },
      cache: false,
      devtool: SOURCE_MAP ? '#source-map' : false,
      output: {
        filename: '[name].js?[chunkhash]'
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          output: {
            comments: false
          }
        })
      ]
        .concat(
          config.jsdoc
            ? new JsDocPlugin({
                conf: path.join(process.cwd(), '.jsdoc.json')
              })
            : []
        )
        .concat(
          config.webpack.banner
            ? new webpack.BannerPlugin({
                banner: config.webpack.banner + ' | built at ' + new Date(config.version),
                entryOnly: true
              })
            : []
        )
    },
    customConfig
  )
}
