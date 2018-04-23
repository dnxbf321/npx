/*
* @Author: dengjiayao
* @Date:   2018-01-26 15:42:48
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 19:28:29
*/
const webpack = require('webpack')
const progressBarWebpackPlugin = require('progress-bar-webpack-plugin')

const path = require('path')
const colors = require('colors')
const leftPad = require('left-pad')

const requireUncached = require('require-uncached')

const getDefinition = require('./webpack-definition')
const getEntry = require('./webpack-entry')
const getHtmlPlugins = require('./webpack-html-plugins')
const getConfig = require('../util/config')
const getPostcssrc = require('../util/postcssrc')
const babelrc = require('../util/babelrc')

const projectRoot = process.cwd()
const contextPath = path.join(projectRoot, 'client')
const staticRoot = path.join(contextPath, 'static')
const cliRoot = path.join(__dirname, '../../')

const eslintrc = {
  configFile: path.join(projectRoot, '.eslintrc.js'),
  formatter: require('eslint-friendly-formatter')
}

function getBaseConf(env, filter) {
  let postcssPlugins = getPostcssrc(env).plugins
  let envConfig = getConfig(env)
  let definitionConfig = getConfig(env, true)
  let entry = getEntry(env, filter)
  let htmlPlugins = getHtmlPlugins(env, filter)
  let definition = getDefinition(env)

  let entryPrefixer = envConfig.entryPrefixer || ''
  let webpackNoCommon = envConfig.webpack['no-common'] || false

  // 无 entry，跳过
  if (Object.keys(entry).length === 0) {
    return
  }

  let publicPath = envConfig.client.publicPath.replace(/\\/g, '/')
  if (!/\/+$/.test(publicPath)) {
    publicPath += '/'
  }
  let conf = {
    context: contextPath,
    entry: entry,
    output: {
      filename: '[name].js?[hash]',
      chunkFilename: '[name].js?[chunkhash]',
      path: path.join(projectRoot, 'client/dist'),
      publicPath: publicPath
    },
    resolve: {
      modules: [path.join(projectRoot, 'node_modules'), path.join(cliRoot, 'node_modules')],
      alias: {
        vue: 'vue/dist/vue.js' // standalone build, see https://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
      }
    },
    resolveLoader: {
      modules: [path.join(projectRoot, 'node_modules'), path.join(cliRoot, 'node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [staticRoot],
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
              options: eslintrc
            }
          ],
          enforce: 'pre'
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelrc
            }
          ]
        },
        {
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
        },
        {
          test: /\.hbs$/,
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                helperDirs: [path.join(staticRoot, 'js/hbs-helper')],
                partialDirs: [path.join(staticRoot, 'html/partial')]
              }
            },
            {
              loader: 'npx-handlebars-inject-loader',
              options: {
                data: definitionConfig
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return postcssPlugins
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new progressBarWebpackPlugin({
        format:
          colors.bgCyan(`[webpack ${leftPad('build', 9)}]`) +
          '[:bar] ' +
          colors.green.bold(':percent') +
          ' (:elapsed seconds)',
        clear: false
      })
    ].concat(htmlPlugins)
  }
  if (!webpackNoCommon) {
    conf.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'static/js/' + entryPrefixer + 'common'
      })
    )
  }
  return conf
}

function getCustomConf(env) {
  let webpackConfJs = path.join(projectRoot, 'webpack.config.js')
  try {
    let conf = requireUncached(webpackConfJs)
    return conf({
      babel: babelrc,
      eslint: eslintrc,
      postcss: getPostcssrc(env)
    })
  } catch (e) {
    return {}
  }
}

module.exports = {
  getBaseConf,
  getCustomConf
}
