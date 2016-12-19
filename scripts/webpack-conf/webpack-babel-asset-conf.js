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
      extensions: ['', '.js'],
      root: [path.join(projectRoot, 'node_modules')],
      fallback: [path.join(cliRoot, 'node_modules')]
    },
    resolveLoader: {
      root: [path.join(cliRoot, 'node_modules')],
      fallback: [path.join(projectRoot, 'node_modules')]
    },
    module: {
      preLoaders: [{
        test: /\.(js|vue)$/,
        loader: 'eslint',
        include: assetRoot,
        exclude: /node_modules/
      }],
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: babelrc
      }, {
        test: /\.js$/,
        loader: 'es3ify',
        include: /node_modules/
      }]
    },
    eslint: {
      configFile: path.join(projectRoot, '.eslintrc.js'),
      formatter: require('eslint-friendly-formatter')
    },
    babel: babelrc,
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    ].concat(config.webpack.banner ?
      new webpack.BannerPlugin(config.webpack.banner + ' | built at ' + new Date(config.version), {
        entryOnly: true
      }) : [])
  }
  return conf
}
