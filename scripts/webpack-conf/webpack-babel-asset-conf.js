/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:17:46
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 17:57:55
*/
const webpack = require('webpack')

const path = require('path')
const glob = require('glob')

const getDefinition = require('./webpack-definition')
const getConfig = require('../util/config')
const babelrc = require('../util/babelrc')

const projectRoot = process.cwd()
const contextPath = path.join(projectRoot, 'client')
const assetRoot = path.join(contextPath, 'asset')
const cliRoot = path.join(__dirname, '../../')

function getEntry() {
  let ret = {}
  let entries = glob.sync(assetRoot + '/**/*.bl.js', {
    cwd: assetRoot
  })
  entries.forEach(it => {
    let filePath = path.relative(assetRoot, it)
    let entryName = filePath.slice(0, -6).replace(/\\/g, '/')
    ret[entryName] = './asset/' + filePath
  })
  return ret
}

module.exports = env => {
  let config = getConfig(env)
  let definition = getDefinition(env)
  let entries = getEntry()

  if (Object.keys(entries).length === 0) {
    return
  }

  let conf = {
    context: contextPath,
    stats: {
      children: false
    },
    cache: false,
    devtool: env === 'development' ? '#source-map' : false,
    entry: entries,
    output: {
      filename: '[name].js?[chunkhash]',
      chunkFilename: '[name].js?[chunkhash]',
      path: path.join(projectRoot, 'client/dist/static'),
      publicPath: path
        .join(config.client.publicPath, '/')
        .replace(/\\/g, '/')
        .replace(/\:\/([^\/])/i, '://$1')
    },
    resolve: {
      modules: [path.join(projectRoot, 'node_modules')]
    },
    resolveLoader: {
      modules: [path.join(projectRoot, 'node_modules'), path.join(cliRoot, 'node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.join(projectRoot, 'client')],
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
              options: {
                configFile: path.join(projectRoot, '.eslintrc.js'),
                formatter: require('eslint-friendly-formatter')
              }
            }
          ],
          enforce: 'pre'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelrc
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        }
      })
    ].concat(
      config.webpack.banner
        ? new webpack.BannerPlugin({
            banner: config.webpack.banner + ' | built at ' + new Date(config.version),
            entryOnly: true
          })
        : []
    )
  }
  return conf
}
