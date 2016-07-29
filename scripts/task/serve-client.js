var koa = require('koa')
var staticServe = require('koa-static')
var webpack = require('webpack')
var webpackConnectHistoryApiFallback = require('koa-connect-history-api-fallback')
var webpackDevMiddleware = require('koa-webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var colors = require('colors')
var path = require('path')
var aliasEnv = require('../util/alias-env')
var cssMiddleware = require('../util/koa-postcss-middleware')
var getWpConfig = require('../webpack-conf/webpack-dev-conf')
var config = require('../../config.json')

var codePath = process.cwd()

module.exports = function(env) {
  env = aliasEnv(env)

  var wpConfig = getWpConfig(env)
  var compiler = webpack(wpConfig)
  var app = koa()

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

  var hotMiddleware = webpackHotMiddleware(compiler)
  app.use(function*(next) {
    yield hotMiddleware.bind(null, this.req, this.res)
    yield next
  })

  // use css middleware
  app.use(cssMiddleware({
    src: path.join(codePath, 'client'),
    publicPath: wpConfig.output.publicPath,
    env: env
  }))

  // serve pure static assets
  app.use(function*(next) {
    var isStaticFile = /\.(js|css|png|jpg|gif|ico|woff|ttf|svg|eot)/.test(path.extname(this.req.url))
    if (isStaticFile) {
      this.res.setHeader('Access-Control-Allow-Origin', '*')
    }
    yield next
  })
  app.use(staticServe(path.join(codePath, 'client/dist/')))
  app.use(staticServe(path.join(codePath, 'client/dist/static/')))
  app.use(staticServe(path.join(codePath, 'client/assets/')))

  var PORT = config['default'].client.port
  app.listen(PORT, function(err) {
    if (err) {
      console.log(colors.bgRed('[task serve-client]'), colors.red(err))
      return
    }
    console.log(colors.bgGreen.bold('[task serve-client]'), 'static files on port: ' + PORT)
  })
}
