var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var path = require('path')

var entry = require('./webpack-entry')
var definition = require('./webpack-definition')
var htmlPlugins = require('./webpack-html-plugins')

var precss = require('precss')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var postcssConf = require('./postcss.json')
var postcssPlugins = [
  precss(postcssConf.precss || {}),
  autoprefixer(postcssConf.autoprefixer || {}),
  cssnano(postcssConf.cssnano || {})
]

var codePath = process.cwd()
var projectRoot = path.join(codePath, 'client')
var staticRoot = path.join(projectRoot, 'static')

module.exports = {
  context: projectRoot,
  entry: entry,
  output: {
    filename: '[name].js',
    path: path.join(codePath, 'client/dist'),
    publicPath: path.join(JSON.parse(definition().client.publicPath), '/').replace(/\:\/([^\/])/i, '://$1')
  },
  resolve: {
    extensions: ['', '.js'],
    fallback: [path.join(codePath, 'node_modules')],
    alias: {
      'src': path.join(codePath, 'src')
    }
  },
  resolveLoader: {
    fallback: [path.join(codePath, 'node_modules')]
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
      include: staticRoot,
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue',
      include: staticRoot,
      exclude: /node_modules/
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
    formatter: require('eslint-friendly-formatter')
  },
  babel: {
    presets: ['es2015', 'stage-2'],
    plugins: ['transform-runtime', 'add-module-exports'],
    comments: false
  },
  vue: {
    postcss: {
      plugins: postcssPlugins
    },
    loaders: {
      css: ExtractTextPlugin.extract('vue-style-loader', ['css-loader'])
    }
  },
  postcss: postcssPlugins,
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.DefinePlugin(definition()),
    new webpack.optimize.CommonsChunkPlugin('static/js/common.js'),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.OccurenceOrderPlugin()
  ].concat(htmlPlugins)
}
