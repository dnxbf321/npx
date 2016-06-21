var koa = require('koa')
var staticServe = require('koa-static')
var webpack = require('webpack')
var webpackConnectHistoryApiFallback = require('koa-connect-history-api-fallback')
var webpackDevMiddleware = require('koa-webpack-dev-middleware')
var cssMiddleware = require('koa-postcss-middleware')
var colors = require('colors')
var path = require('path')
var wpConfig = require('../conf/webpack-dev-conf')
var config = require('../../config.json')

var codePath = process.cwd()

var app = koa()
var compiler = webpack(wpConfig)

app.use(webpackConnectHistoryApiFallback())

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  quiet: false,
  lazy: false,
  watchOptions: {
    aggregateTimeout: 300
  },
  publicPath: wpConfig.output.publicPath,
  stats: {
    colors: true
  }
}))

var hotMiddleware = require('webpack-hot-middleware')(compiler);
app.use(function*(next) {
  yield hotMiddleware.bind(null, this.req, this.res)
  yield next
})

// use css middleware
app.use(cssMiddleware({
  src: path.join(codePath, 'client'),
  publicPath: wpConfig.output.publicPath
}))

// serve pure static assets
app.use(function*(next) {
  var isStaticFile = /\.(js|css|png|jpg|gif|ico|woff|ttf|svg|eot)/.test(path.extname(this.req.path))
  if (isStaticFile) {
    this.res.setHeader('Access-Control-Allow-Origin', '*');
  }
  yield next
})
app.use(staticServe(path.join(codePath, 'client/dist/')))

var PORT = config['default'].client.port
module.exports = app.listen(PORT, function(err) {
  if (err) {
    console.log(colors.bgRed('[task serve-client] '), colors.red(err))
    return
  }
  console.log(colors.bgCyan.bold('[task serve-client] '), 'static files on port: ' + PORT)
})
