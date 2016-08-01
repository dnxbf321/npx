var babel = require('babel-core')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var glob = require('glob')
var colors = require('colors')
var path = require('path')
var fs = require('fs')
var aliasEnv = require('../util/alias-env')
var babelrc = require('../util/babelrc')
var getConfig = require('../util/config')

var projectRoot = process.cwd()

module.exports = function(env) {
  env = aliasEnv(env)

  var config = getConfig(env)
  Object.keys(config).forEach((k) => {
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

  babelrc.plugins.push([require.resolve('babel-plugin-define'), config])
  babelrc.minified = env === 'production'
  babelrc.sourceMaps = env !== 'production' ? 'inline' : false

  var assets = glob.sync('**/*.bl.js', {
    cwd: path.join(projectRoot, 'client/asset')
  })

  assets.forEach(function(js) {
    babel.transformFile(path.join(projectRoot, 'client/asset', js), babelrc, function(err, result) {
      if (err) {
        return console.log(colors.bgRed('[task babel-asset]'), err)
      }

      var dist = path.join(projectRoot, 'client/dist/static')
      rimraf(path.join(dist, js), {}, function() {})
      mkdirp(dist, function(err) {
        if (err) {
          return console.log(colors.bgRed('[task babel-asset]'), err)
        }
        fs.writeFile(path.join(dist, js).replace('.bl.js', '.js'), result.code, function(err) {
          if (err) {
            console.log(colors.bgRed('[task babel-asset]'), err)
          }
        })
      })

    })
  })
}
