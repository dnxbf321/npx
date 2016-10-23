import glob from 'glob'
import mkdirp from 'mkdirp'
import colors from 'colors'
import leftPad from 'left-pad'
import postcss from 'postcss'
import path from 'path'
import fs from 'fs'
import getPostcssPlugins from '../util/postcss-plugins'
import aliasEnv from '../util/alias-env'

var projectRoot = process.cwd()

export default (env) => {
  env = aliasEnv(env)
  var postcssPlugins = getPostcssPlugins(env)

  var csses = glob.sync('css/**/[!_]*.css', {
    nodir: true,
    cwd: path.join(projectRoot, 'client/static')
  })

  return new Promise((resolve, reject) => {
    csses.forEach((it, idx) => {
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
          mkdirp.sync(path.dirname(result.opts.to))
          fs.writeFileSync(result.opts.to, result.css)
          fs.writeFileSync(result.opts.to + '.map', result.map)

          console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), path.relative(projectRoot, result.opts.to))
          if (idx === csses.length - 1) {
            console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), 'done')
            resolve()
          }
        })
        .catch((err) => {
          console.log(colors.bgRed(`[task ${leftPad('postcss', 12)}]`), err)
          reject()
        })
    })
  })
}
