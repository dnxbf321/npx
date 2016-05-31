import path from 'path'
import koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import onerror from 'koa-onerror'
import staticServe from 'koa-static'
import session from 'koa-session'
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

// static server
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
