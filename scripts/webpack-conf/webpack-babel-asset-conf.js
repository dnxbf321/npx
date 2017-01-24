import webpack from 'webpack'

import path from 'path'
import glob from 'glob'

import getDefinition from './webpack-definition'
import getConfig from '../util/config'
import babelrc from '../util/babelrc'

var projectRoot = process.cwd()
var contextPath = path.join(projectRoot, 'client')
var assetRoot = path.join(contextPath, 'asset')
var cliRoot = path.join(__dirname, '../../')

function getEntry() {
  var ret = {}
  var entries = glob.sync(assetRoot + '/**/*.bl.js', {
    cwd: assetRoot
  })
  entries.forEach((it) => {
    var filePath = path.relative(assetRoot, it)
    var entryName = filePath.slice(0, -6).replace(/\\/g, '/')
    ret[entryName] = './asset/' + filePath
  })
  return ret
}

export default (env) => {
  var config = getConfig(env)
  var definition = getDefinition(env)
  var conf = {
    context: contextPath,
    stats: {
      children: false
    },
    cache: false,
    devtool: env === 'development' ? '#source-map' : false,
    entry: getEntry(),
    output: {
      filename: '[name].js?[chunkhash]',
      chunkFilename: '[name].js?[chunkhash]',
      path: path.join(projectRoot, 'client/dist/static'),
      publicPath: path.join(config.client.publicPath, '/').replace(/\\/g, '/').replace(/\:\/([^\/])/i, '://$1')
    },
    resolve: {
      modules: [
        path.join(projectRoot, 'node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        path.join(projectRoot, 'node_modules'),
        path.join(cliRoot, 'node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.join(projectRoot, 'client')],
          exclude: /node_modules/,
          use: [{
            loader: 'eslint-loader',
            options: {
              configFile: path.join(projectRoot, '.eslintrc.js'),
              formatter: require('eslint-friendly-formatter')
            }
          }],
          enforce: 'pre'
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelrc
            }
          ]
        }, {
          test: /\.js$/,
          include: /node_modules/,
          use: [
            {
              loader: 'es3ify-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        }
      })
    ].concat(config.webpack.banner ?
      new webpack.BannerPlugin({
        banner: config.webpack.banner + ' | built at ' + new Date(config.version),
        entryOnly: true
      }) : [])
  }
  return conf
}
