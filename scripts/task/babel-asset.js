import { transformFile } from 'babel-core'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import colors from 'colors'
import leftPad from 'left-pad'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import aliasEnv from '../util/alias-env'
import babelrc from '../util/babelrc'
import getWebpackDefinition from '../webpack-conf/webpack-definition'

var projectRoot = process.cwd()

export default (env) => {
  env = aliasEnv(env)

  var definition = getWebpackDefinition(env)

  babelrc.plugins.push([require.resolve('babel-plugin-transform-define'), definition])
  babelrc.minified = env === 'production'
  babelrc.sourceMaps = env !== 'production' ? 'inline' : false

  var assets = glob.sync('**/*.bl.js', {
    cwd: path.join(projectRoot, 'client/asset')
  })

  var promises = []

  assets.forEach((js, idx) => {

    let transformer = new Promise((resolve, reject) => {
      transformFile(path.join(projectRoot, 'client/asset', js), babelrc, (err, result) => {
        if (err) {
          console.log(colors.bgRed(`[task ${leftPad('babel-asset', 12)}]`), err)
          reject()
        }

        let dist = path.join(projectRoot, 'client/dist/static')
        rimraf(path.join(dist, js), {}, () => {
        })
        mkdirp(dist, (err) => {
          if (err) {
            console.log(colors.bgRed(`[task ${leftPad('babel-asset', 12)}]`), err)
            reject()
          } else {
            fs.writeFile(path.join(dist, js).replace('.bl.js', '.js'), result.code, (err) => {
              if (err) {
                console.log(colors.bgRed(`[task ${leftPad('babel-asset', 12)}]`), err)
                reject()
              } else if (idx === assets.length - 1) {
                console.log(colors.bgGreen(`[task ${leftPad('babel-asset', 12)}]`), 'done')
                resolve()
              }
            })
          }
        })
      })
    })
    promises.push(transformer)

  })

  return Promise.all(promises)

}
