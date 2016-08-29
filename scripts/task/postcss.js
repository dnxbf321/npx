import path from 'path'
import glob from 'glob'
import fs from 'fs'
import mkdirp from 'mkdirp'
import colors from 'colors'
import postcss from 'postcss'
import getPostcssPlugins from '../util/postcss-plugins'
import aliasEnv from '../util/alias-env'

var projectRoot = process.cwd()

function writeCss(result) {
  return new Promise((resolve, reject) => {
    mkdirp.sync(path.dirname(result.opts.to))
    fs.writeFileSync(result.opts.to, result.css)
    fs.writeFileSync(result.opts.to + '.map', result.map)
    console.log(colors.bgGreen('[task postcss]'), path.relative(projectRoot, result.opts.to))
  })
}

export default (env) => {
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
      .then((result) => {
        return writeCss(result)
      })
      .catch((err) => {
        console.log(colors.bgRed('[task postcss]'), err)
      })
  })
}
