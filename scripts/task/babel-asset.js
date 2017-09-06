import webpack from 'webpack'
import colors from 'colors'
import leftPad from 'left-pad'
import glob from 'glob'
import rimraf from 'rimraf'
import path from 'path'
import getBabelAssetconf from '../webpack-conf/webpack-babel-asset-conf'
import aliasEnv from '../util/alias-env'

export default (env) => {
  // 删除 dist 下的 .bl.js 文件
  let files = glob.sync(path.join(process.cwd(), 'client/dist/static/**/*.bl.js'))
  files.forEach((it) => {
    rimraf(it, {}, () => {
    })
  })

  // 打包处理 .bl.js 文件
  env = aliasEnv(env)
  let conf = getBabelAssetconf(env)
  if (!conf) {
    return Promise.resolve()
  }

  let compiler = webpack(conf)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('babel-asset', 12)}]`), err)
        reject(err)
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('babel-asset', 12)}]`), stats.toString({
          children: false,
          colors: true,
          modules: false
        }))
        resolve()
      }
    })
  })
}