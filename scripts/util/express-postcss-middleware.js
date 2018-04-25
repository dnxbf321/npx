/*
* @Author: dengjiayao
* @Date:   2018-04-25 17:01:40
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-25 17:52:05
*/
const path = require('path')
const url = require('url')
const fs = require('fs')
const extend = require('extend')
const postcss = require('postcss')
const getPostcssrc = require('./postcssrc')

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

  let postcssPlugins = getPostcssrc(options.env).plugins

  return async function(req, res, next) {
    await next()
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !/\.css/.test(req.url)) {
      return
    }

    res.writeHead(200, {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=0',
      'Access-Control-Allow-Origin': '*'
    })

    let reqUrl = url.parse(req.url, true, true)
    let relativePath = path.relative(options.publicPath, reqUrl.pathname)
    let fsLocation = path.join(options.src, relativePath)

    let source = fs.readFileSync(fsLocation)

    try {
      let result = await postcss(postcssPlugins).process(source.toString(), {
        from: fsLocation,
        map: 'inline'
      })
      res.end(result.css)
    } catch (err) {
      console.error(err)
    }
  }
}
