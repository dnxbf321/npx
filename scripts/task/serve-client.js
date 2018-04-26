/*
* @Author: dengjiayao
* @Date:   2018-04-25 16:18:40
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 15:53:49
*/
const webpack = require('webpack')
const DevServer = require('webpack-dev-server')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')
const aliasEnv = require('../util/alias-env')
const cssMiddleware = require('../util/express-postcss-middleware')
const getWpConfig = require('../webpack-conf/webpack-dev-conf')
const getNpxConfig = require('../util/config')

const projectRoot = process.cwd()

async function setup(env, npxConf, wpConf) {
  const options = {
    contentBase: [
      path.join(projectRoot, 'client/dist/'),
      path.join(projectRoot, 'client/dist/static/'),
      path.join(projectRoot, 'client/assets/')
    ],
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0'
    },
    host: '127.0.0.1',
    port: npxConf.client.port,
    publicPath: wpConf.output.publicPath,
    watchOptions: {
      pool: true
    },
    stats: {
      children: false,
      colors: true,
      entrypoints: false,
      modules: false
    }
  }

  DevServer.addDevServerEntrypoints(wpConf, options)
  let compiler = webpack(wpConf)

  let server = new DevServer(compiler, options)
  server.use(
    cssMiddleware({
      src: path.join(projectRoot, 'client'),
      publicPath: wpConf.output.publicPath,
      env
    })
  )

  return server
}

module.exports = async (env, filter) => {
  env = aliasEnv(env)

  let npxConf = getNpxConfig(env)
  let wpConf = getWpConfig(env, filter)

  let app = await setup(env, npxConf, wpConf)

  let PORT = npxConf.client.port
  return new Promise((resolve, reject) => {
    app.listen(PORT, 'localhost', err => {
      if (err) {
        console.log(colors.bgRed(`\n[task ${leftPad('dev-server', 12)}]`), err)
        reject(err)
      } else {
        console.log(colors.bgGreen(`\n[task ${leftPad('dev-server', 12)}] files on port: ${PORT}`))
        resolve()
      }
    })
  })
}
