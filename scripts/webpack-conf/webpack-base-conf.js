import webpack from 'webpack'
import progressBarWebpackPlugin from 'progress-bar-webpack-plugin'

import path from 'path'
import colors from 'colors'
import leftPad from 'left-pad'

import getDefinition from './webpack-definition'
import entry from './webpack-entry'
import htmlPlugins from './webpack-html-plugins'
import getPostcssPlugins from '../util/postcss-plugins'
import getConfig from '../util/config'
import babelrc from '../util/babelrc'

var projectRoot = process.cwd()
var contextPath = path.join(projectRoot, 'client')
var staticRoot = path.join(contextPath, 'static')
var cliRoot = path.join(__dirname, '../../')

export default (env) => {
  var postcssPlugins = getPostcssPlugins(env)
  var envConfig = getConfig(env)
  var entryPrefixer = envConfig.entryPrefixer || ''
  var webpackNoCommon = envConfig.webpack['no-common'] || false
  var definition = getDefinition(env)
  var conf = {
    context: contextPath,
    entry: entry,
    output: {
      filename: '[name].js?[hash]',
      chunkFilename: '[name].js?[chunkhash]',
      path: path.join(projectRoot, 'client/dist'),
      publicPath: path.join(envConfig.client.publicPath, '/').replace(/\\/g, '/').replace(/\:\/([^\/])/i, '://$1')
    },
    resolve: {
      extensions: ['', '.js'],
      root: [path.join(projectRoot, 'node_modules')],
      fallback: [path.join(cliRoot, 'node_modules')],
      alias: {
        vue: 'vue/dist/vue.js' // standalone build, see https://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
      }
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
        test: /\.js$/,
        loader: 'es3ify',
        include: /node_modules/
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
          name: '[path][name].[ext]?[hash]'
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
      new webpack.optimize.OccurenceOrderPlugin(),
      new progressBarWebpackPlugin({
        format: colors.bgCyan(`[webpack ${leftPad('build', 9)}]`) + '[:bar] ' + colors.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
      })
    ].concat(htmlPlugins)
  }
  if (!webpackNoCommon) {
    conf.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: 'static/js/' + entryPrefixer + 'common'
    }))
  }
  return conf
}
