var webpack = require('webpack')

var path = require('path')

var getDefinition = require('./webpack-definition')
var entry = require('./webpack-entry')
var htmlPlugins = require('./webpack-html-plugins')
var getPostcssPlugins = require('../util/postcss-plugins')
var getConfig = require('../util/config')
var babelrc = require('../util/babelrc')

var projectRoot = process.cwd()
var contextPath = path.join(projectRoot, 'client')
var staticRoot = path.join(contextPath, 'static')
var cliRoot = path.join(__dirname, '../../')

module.exports = function(env) {
  var postcssPlugins = getPostcssPlugins(env)
  var entryPrefixer = getConfig(env).entryPrefixer || ''
  var webpackNoCommon = getConfig(env).webpack['no-common'] || false
  var definition = getDefinition(env)
  var conf = {
    context: contextPath,
    entry: entry,
    output: {
      filename: '[name].js?[hash:7]',
      path: path.join(projectRoot, 'client/dist'),
      publicPath: path.join(JSON.parse(definition.client.publicPath), '/').replace(/\\/g, '/').replace(/\:\/([^\/])/i, '://$1')
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
        include: staticRoot,
        exclude: /node_modules/
      }],
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: babelrc
      }, {
        test: /\.vue$/,
        loader: 'vue'
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: '[path][name].[ext]?[hash:7]'
        }
      }, {
        test: /\.hbs$/,
        loader: 'handlebars',
        query: {
          helperDirs: [path.join(staticRoot, 'js/hbs-helper'), path.join(__dirname, '../helper')],
          partialDirs: [path.join(staticRoot, 'html/partial')]
        }
      }, {
        test: /\.css$/,
        loader: 'style!css!postcss'
      }]
    },
    eslint: {
      configFile: path.join(projectRoot, '.eslintrc.js'),
      formatter: require('eslint-friendly-formatter')
    },
    babel: babelrc,
    vue: {
      postcss: {
        plugins: postcssPlugins
      }
    },
    postcss: postcssPlugins,
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new webpack.optimize.OccurenceOrderPlugin()
    ].concat(htmlPlugins)
  }
  if (!webpackNoCommon) {
    conf.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: 'static/js/' + entryPrefixer + 'common'
    }))
  }
  return conf
}
