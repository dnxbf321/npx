/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:04:04
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:43:55
*/
const webpack = require('webpack')
const colors = require('colors')
const leftPad = require('left-pad')
const glob = require('glob')
const rimraf = require('rimraf')
const path = require('path')
const getBabelAssetconf = require('../webpack-conf/webpack-babel-asset-conf')
const aliasEnv = require('../util/alias-env')

module.exports = env => {
  // 删除 dist 下的 .bl.js 文件
  let files = glob.sync(path.join(process.cwd(), 'client/dist/static/**/*.bl.js'))
  files.forEach(it => {
    rimraf(it, {}, () => {})
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
        console.log(
          colors.bgGreen(`[task ${leftPad('babel-asset', 12)}]`),
          stats.toString({
            children: false,
            colors: true,
            modules: false
          })
        )
        resolve()
      }
    })
  })
}
