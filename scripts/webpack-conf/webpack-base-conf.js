import webpack from 'webpack'
import progressBarWebpackPlugin from 'progress-bar-webpack-plugin'

import path from 'path'
import colors from 'colors'
import leftPad from 'left-pad'

import requireUncached from 'require-uncached'

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

var eslintrc = {
  configFile: path.join(projectRoot, '.eslintrc.js'),
  formatter: require('eslint-friendly-formatter')
}

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
      modules: [
        path.join(projectRoot, 'node_modules'),
        path.join(cliRoot, 'node_modules')
      ],
      alias: {
        vue: 'vue/dist/vue.js' // standalone build, see https://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
      }
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
          include: [staticRoot],
          exclude: /node_modules/,
          use: [{
            loader: 'eslint-loader',
            options: eslintrc
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
          test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1,
                name: '[path][name].[ext]?[hash]'
              }
            }
          ]
        }, {
          test: /\.hbs$/,
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                helperDirs: [path.join(staticRoot, 'js/hbs-helper'), path.join(__dirname, '../helper')],
                partialDirs: [path.join(staticRoot, 'html/partial')]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
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

export function getCustomConfig(env) {
  var webpackConfJs = path.join(projectRoot, 'webpack.config.js')
  try {
    var conf = requireUncached(webpackConfJs)
    return conf({
      babel: babelrc,
      eslint: eslintrc,
      postcss: getPostcssPlugins(env)
    })
  } catch ( e ) {
    return {}
  }
}
