import Koa from 'koa'
import staticServe from 'koa-static'
import webpack from 'webpack'
import historyApiFallback from 'koa2-history-api-fallback'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'
import colors from 'colors'
import leftPad from 'left-pad'
import path from 'path'
import aliasEnv from '../util/alias-env'
import cssMiddleware from '../util/koa-postcss-middleware'
import getWpConfig from '../webpack-conf/webpack-dev-conf'
import getConfig from '../util/config'

let codePath = process.cwd()

async function setup(env, config, wpConfig) {
  let app = new Koa()

  if (wpConfig) {
    let compiler = webpack(wpConfig)
    app.use(devMiddleware(compiler, {
      noInfo: false,
      quiet: false,
      lazy: false,
      watchOptions: {
        aggregateTimeout: 300
      },
      publicPath: wpConfig.output.publicPath,
      stats: {
        children: false,
        colors: true,
        modules: false
      }
    }))
    app.use(hotMiddleware(compiler))
  }

  app.use(historyApiFallback())

  // use css middleware
  app.use(cssMiddleware({
    src: path.join(codePath, 'client'),
    publicPath: wpConfig.output.publicPath,
    env: env
  }))

  // serve pure static assets
  app.use(async (ctx, next) => {
    let isStaticFile = /\.(js|css|png|jpg|gif|ico|woff|ttf|svg|eot)/.test(path.extname(ctx.req.url))
    if (isStaticFile) {
      ctx.res.setHeader('Access-Control-Allow-Origin', '*')
    }
    await next()
  })
  app.use(staticServe(path.join(codePath, 'client/dist/')))
  app.use(staticServe(path.join(codePath, 'client/dist/static/')))
  app.use(staticServe(path.join(codePath, 'client/assets/')))

  return app
}

export default async (env, entry) => {
  env = aliasEnv(env)

  let config = getConfig(env)
  let wpConfig = getWpConfig(env, entry)

  let app = await setup(env, config, wpConfig)

  let PORT = config.client.port
  return new Promise((resolve, reject) => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('serve-client', 12)}]`), err)
        reject(err)
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('serve-client', 12)}]`), 'static files on port: ' + PORT)
        resolve()
      }
    })
  })
}
