var koa = require('koa')
var staticServe = require('koa-static')
var webpack = require('webpack')
var webpackMiddleware = require('koa-webpack-dev-middleware')
var path = require('path')
var config = require('./webpack.dev.conf')

var app = koa()
var compiler = webpack(config)

app.use(webpackMiddleware(compiler, {
  noInfo: false,
  quiet: false,
  lazy: false,
  watchOptions: {
    aggregateTimeout: 300
  },
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

var hotMiddleware = require("webpack-hot-middleware")(compiler);
app.use(function*(next) {
  yield hotMiddleware.bind(null, this.req, this.res)
  yield next
})

// serve pure static assets
app.use(staticServe(path.join(__dirname, '../dist/')))

module.exports = app.listen(8080, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:8080')
})
