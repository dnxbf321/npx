import path from 'path'
import koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import onerror from 'koa-onerror'
import staticServe from 'koa-static'
import session from 'koa-session'
import proxy from 'koa-proxy'
import hbs from './help/hbs-with-helper'
import routes from './route'
import getConfig from './config'

const config = getConfig()

let app = koa()
let router = routes()

// response-time middleware
app.use(function*(next) {
  var start = new Date
  yield next
  var ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
})

// error handler
onerror(app, {
  all: true
})

app.keys = [global.secret]
// use middleware
app.use(session(app, {
  signed: true
}))
app.use(logger())
app.use(compress())
app.use(bodyParser())

// proxy hot-update.json to client server
// hack：因为 webpack-hot-middleware 模块总是将 hot-update 请求发送到当前域名，但实际上 hot-update 应由 client server 应答，所以需要 proxy
if (process.env.NODE_ENV === 'development') {
  app.use(proxy({
    host: 'http://127.0.0.1:' + config.client.port,
    match: /hot-update/
  }))
}

// static server
app.use(function*(next) {
  let isStaticFile = /\.(js|css|png|jpg|gif|ico|woff|ttf|svg|eot)/.test(path.extname(this.req.path))
  if (isStaticFile) {
    this.res.setHeader('Access-Control-Allow-Origin', '*');
  }
  yield next
})
app.use(staticServe(path.join(__dirname, '../client/dist/')))

// koa-hbs is middleware. `use` it before you want to render a view
app.use(hbs.middleware({
  viewPath: path.join(__dirname, './view'),
  partialsPath: [path.join(__dirname, './view/partial')]
}))

// Locals: config.json => global
app.use(function*(next) {
  this.state.global = config.server
  yield next
})

// router
app
  .use(router.routes())
  .use(router.allowedMethods({
    throw: true
  }))

// start server
const PORT = config.server.port

app.listen(PORT, err => {
  if (err) {
    throw err
  }
  console.log(`server listening on PORT: ${PORT}`)
})
