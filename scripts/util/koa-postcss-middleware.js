import path from 'path'
import url from 'url'
import fs from 'fs'
import extend from 'extend'
import postcss from 'postcss'
import getPostcssPlugins from './postcss-plugins'

export default (options) => {
  options = extend(true, {
    src: process.cwd,
    publicPath: '',
    env: 'production'
  }, options)

  var postcssPlugins = getPostcssPlugins(options.env)

  return function*(next) {
    var ctx = this
    if (this.req.method !== 'GET' && this.req.method !== 'HEAD') {
      return yield next
    }
    if (!/\.css/.test(this.req.url)) {
      return yield next
    }

    this.res.writeHead(200, {
      'Content-Type': 'text/css',
      'Cache-Control': 'max-age=0',
      'Access-Control-Allow-Origin': '*'
    })

    var reqUrl = url.parse(this.req.url, true, true)
    var relativePath = path.relative(options.publicPath, reqUrl.pathname)
    var fsLocation = path.join(options.src, relativePath)

    var source = fs.readFileSync(fsLocation)

    postcss(postcssPlugins)
      .process(source.toString(), {
        from: fsLocation,
        map: 'inline'
      })
      .then((result) => {
        ctx.res.end(result.css)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
