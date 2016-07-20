var babel = require('babel-core')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var glob = require('glob')
var colors = require('colors')
var path = require('path')
var fs = require('fs')

var codePath = process.cwd()

var config = require('../util/config')()
Object.keys(config).forEach(function(k) {
  var v = config[k]
  switch (Object.prototype.toString.call(v)) {
    case '[object Number]':
    case '[object String]': // define plugin 把 string 当做可执行代码
    case '[object Object]':
      config[k] = JSON.stringify(v)
      break
    default:
  }
})

var babelrc = fs.readFileSync(path.join(codePath, '.babelrc'), {
  encoding: 'utf8'
})
babelrc = JSON.parse(babelrc.toString())
babelrc.plugins.push(['define', config])
babelrc.minified = process.env.NODE_ENV === 'production'
babelrc.sourceMaps = process.env.NODE_ENV !== 'production' ? 'inline' : false

var assets = glob.sync('**/*.bl.js', {
  cwd: path.join(codePath, 'client/asset')
})

assets.forEach(function(js) {
  babel.transformFile(path.join(codePath, 'client/asset', js), babelrc, function(err, result) {
    if (err) {
      return console.log(colors.bgRed('[task babel-asset]'), ' ', err)
    }

    var dist = path.join(codePath, 'client/dist/static')
    rimraf(path.join(dist, js), {}, function() {})
    mkdirp(dist, function(err) {
      if (err) {
        return console.log(colors.bgRed('[task babel-asset]'), ' ', err)
      }
      fs.writeFile(path.join(dist, js).replace('.bl.js', '.js'), result.code, function(err) {
        if (err) {
          console.log(colors.bgRed('[task babel-asset]'), ' ', err)
        }
      })
    })

  })
})
