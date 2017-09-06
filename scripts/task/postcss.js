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

export default async (env) => {
  env = aliasEnv(env)
  let postcssPlugins = getPostcssPlugins(env)

  let csses = glob.sync('css/**/[!_]*.css', {
    nodir: true,
    cwd: path.join(projectRoot, 'client/static')
  })

  while (csses.length) {
    let it = csses.shift()
    let fromPath = path.join(projectRoot, 'client/static', it)
    let toPath = path.join(projectRoot, 'client/dist/static', it)
    let source = fs.readFileSync(fromPath)
    try {
      let result = await postcss(postcssPlugins).process(source.toString(), {
        from: fromPath,
        to: toPath,
        map: {
          inline: false
        }
      })

      mkdirp.sync(path.dirname(result.opts.to))
      fs.writeFileSync(result.opts.to, result.css)
      fs.writeFileSync(result.opts.to + '.map', result.map)

      console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), path.relative(projectRoot, result.opts.to))
    } catch ( err ) {
      console.log(colors.bgRed(`[task ${leftPad('postcss', 12)}]`), err)
      return Promise.reject(err)
    }
  }

  console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), 'done')
}
