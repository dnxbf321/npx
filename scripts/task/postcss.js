var path = require('path')
var glob = require('glob')
var fs = require('fs')
var mkdirp = require('mkdirp')
var colors = require('colors')
var postcss = require('postcss')
var getPostcssPlugins = require('../util/postcss-plugins')
var aliasEnv = require('../util/alias-env')

var projectRoot = process.cwd()

function writeCss(result) {
  return new Promise((resolve, reject) => {
    mkdirp.sync(path.dirname(result.opts.to))
    fs.writeFileSync(result.opts.to, result.css)
    fs.writeFileSync(result.opts.to + '.map', result.map)
    console.log(colors.bgGreen('[task postcss]'), path.relative(projectRoot, result.opts.to))
  })
}

module.exports = function(env) {
  env = aliasEnv(env)
  var postcssPlugins = getPostcssPlugins(env)

  var csses = glob.sync('css/**/[!_]*.css', {
    nodir: true,
    cwd: path.join(projectRoot, 'client/static')
  })

  csses.forEach((it) => {
    var fromPath = path.join(projectRoot, 'client/static', it)
    var toPath = path.join(projectRoot, 'client/dist/static', it)
    var source = fs.readFileSync(fromPath)
    postcss(postcssPlugins)
      .process(source.toString(), {
        from: fromPath,
        to: toPath,
        map: {
          inline: false
        }
      })
      .then(function(result) {
        return writeCss(result)
      })
      .catch(function(err) {
        console.log(colors.bgRed('[task postcss]'), err)
      })
  })
}
