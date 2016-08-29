import { transformFile } from 'babel-core'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import glob from 'glob'
import colors from 'colors'
import path from 'path'
import fs from 'fs'
import aliasEnv from '../util/alias-env'
import babelrc from '../util/babelrc'
import getConfig from '../util/config'

var projectRoot = process.cwd()

export default (env) => {
  env = aliasEnv(env)

  var config = getConfig(env)
  Object.keys(config).forEach((k) => {
    let v = config[k]
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

  assets.forEach((js) => {
    transformFile(path.join(projectRoot, 'client/asset', js), babelrc, (err, result) => {
      if (err) {
        return console.log(colors.bgRed('[task babel-asset]'), err)
      }

      let dist = path.join(projectRoot, 'client/dist/static')
      rimraf(path.join(dist, js), {}, () => {
      })
      mkdirp(dist, (err) => {
        if (err) {
          return console.log(colors.bgRed('[task babel-asset]'), err)
        }
        fs.writeFile(path.join(dist, js).replace('.bl.js', '.js'), result.code, (err) => {
          if (err) {
            console.log(colors.bgRed('[task babel-asset]'), err)
          }
        })
      })

    })
  })
}
