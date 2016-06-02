var koa = require('koa')
var staticServe = require('koa-static')
var webpack = require('webpack')
var webpackMiddleware = require('koa-webpack-dev-middleware')
var cssMiddleware = require('koa-postcss-middleware')
var path = require('path')
var wpConfig = require('./webpack.dev.conf')
var config = require('../../config.json')

var app = koa()
var compiler = webpack(wpConfig)

app.use(webpackMiddleware(compiler, {
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
  src: path.join(__dirname, '../static'),
  publicPath: '/static/'
}))

// serve pure static assets
app.use(staticServe(path.join(__dirname, '../dist/')))

var PORT = config['default'].client.port
module.exports = app.listen(PORT, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('static files on port: ' + PORT)
})
