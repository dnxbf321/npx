import koa from 'koa'
import staticServe from 'koa-static'
import webpack from 'webpack'
import webpackConnectHistoryApiFallback from 'koa-connect-history-api-fallback'
import webpackDevMiddleware from 'koa-webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import colors from 'colors'
import leftPad from 'left-pad'
import path from 'path'
import aliasEnv from '../util/alias-env'
import cssMiddleware from '../util/koa-postcss-middleware'
import getWpConfig from '../webpack-conf/webpack-dev-conf'
import getConfig from '../util/config'

var codePath = process.cwd()

export default (env) => {
  env = aliasEnv(env)

  var wpConfig = getWpConfig(env)
  var config = getConfig(env)
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
    stats: 'normal'
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

  var PORT = config.client.port
  return new Promise((resolve, reject) => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('serve-client', 12)}]`), err)
        reject()
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('serve-client', 12)}]`), 'static files on port: ' + PORT)
        resolve()
      }
    })
  })
}
