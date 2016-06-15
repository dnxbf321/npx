var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var codePath = process.cwd()
var projectRoot = path.join(codePath, 'client/static')
var entry = require('./webpack-entry')(projectRoot)
var definition = require('./webpack-definition')

module.exports = {
  context: projectRoot,
  entry: entry,
  output: {
    filename: '[name].js',
    path: path.join(codePath, 'client/dist/static'),
    publicPath: path.join(JSON.parse(definition().server.staticRoot), '/').replace(/(\:\/)[^\/]/i, '://')
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
      include: projectRoot,
      exclude: /node_modules|build/
    }],
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: projectRoot,
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue',
      include: projectRoot,
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
      plugins: [
        require('precss'),
        require('autoprefixer')({
          browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
        }),
        require('cssnano')({
          safe: true
        })
      ]
    },
    loaders: {
      css: ExtractTextPlugin.extract('vue-style-loader', ['css-loader'])
    }
  },
  plugins: [
    new webpack.DefinePlugin(definition()),
    new ExtractTextPlugin('[name].css')
  ]
}
