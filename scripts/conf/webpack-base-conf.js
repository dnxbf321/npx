var webpack = require('webpack')
var path = require('path')
var codePath = process.cwd()
var projectRoot = path.join(codePath, 'client/static')
var entry = require('./webpack-entry')(projectRoot)
var definition = require('./webpack-definition')

module.exports = {
  context: projectRoot,
  entry: entry,
  output: {
    path: path.join(codePath, 'client/dist/static'),
    publicPath: '/static/',
    filename: '[name].js'
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
      test: /\.js$/,
      loader: 'eslint',
      include: projectRoot,
      exclude: /node_modules|build/
    }],
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: projectRoot,
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 100,
        name: '[path][name].[ext]?[hash:7]'
      }
    }]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  plugins: [
    new webpack.DefinePlugin(definition())
  ]
}
