const path = require('path')
const url = require('url')
const fs = require('fs')
const extend = require('extend')
const postcss = require('postcss')
const getPostcssPlugins = require('./postcss-plugins')

module.exports = options => {
  options = extend(
    true,
    {
      src: process.cwd,
      publicPath: '',
      env: 'production'
    },
    options
  )

  let postcssPlugins = getPostcssPlugins(options.env)

  return async function(ctx, next) {
    await next()

    if (
      (ctx.req.method !== 'GET' && ctx.req.method !== 'HEAD') ||
      !/\.css/.test(ctx.req.url)
    ) {
      return
    }

    ctx.res.writeHead(200, {
      'Content-Type': 'text/css',
      'Cache-Control': 'max-age=0',
      'Access-Control-Allow-Origin': '*'
    })

    let reqUrl = url.parse(ctx.req.url, true, true)
    let relativePath = path.relative(options.publicPath, reqUrl.pathname)
    let fsLocation = path.join(options.src, relativePath)

    let source = fs.readFileSync(fsLocation)

    try {
      let result = await postcss(postcssPlugins).process(source.toString(), {
        from: fsLocation,
        map: 'inline'
      })
      ctx.res.end(result.css)
    } catch (err) {
      console.error(err)
    }
  }
}
