/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:17:46
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 15:59:42
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
const npxRoot = path.join(__dirname, '../../')

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

  let plugins = [new webpack.IgnorePlugin(/vertx/), new webpack.DefinePlugin(definition)]
  if (config.webpack.banner) {
    plugins.push(
      new webpack.BannerPlugin({
        banner: config.webpack.banner + ' | built at ' + new Date(config.version) + '\n',
        entryOnly: true
      })
    )
  }

  let conf = {
    mode: env === 'development' ? 'development' : 'production',
    cache: false,
    devtool: env === 'development' ? '#eval-source-map' : false,
    context: contextPath,
    entry: entries,
    output: {
      filename: env === 'development' ? '[name].js' : '[name].js?[chunkhash]',
      chunkFilename: env === 'development' ? '[name].js' : '[name].js?[chunkhash]',
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
      modules: [path.join(projectRoot, 'node_modules'), path.join(npxRoot, 'node_modules')]
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
    plugins,
    optimization: {
      noEmitOnErrors: true,
      splitChunks: false
    }
  }
  return conf
}
