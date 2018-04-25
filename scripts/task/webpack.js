/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:10:39
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-25 17:31:43
*/
const webpack = require('webpack')
const colors = require('colors')
const leftPad = require('left-pad')
const getProdConf = require('../webpack-conf/webpack-prod-conf')
const aliasEnv = require('../util/alias-env')

module.exports = env => {
  env = aliasEnv(env)

  let conf = getProdConf(env)
  if (!conf) {
    return Promise.resolve()
  }

  let compiler = webpack(conf)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('webpack', 12)}]`), err)
        reject()
      } else {
        console.log(
          colors.bgGreen(`[task ${leftPad('webpack', 12)}]`),
          stats.toString({
            children: false,
            colors: true,
            entrypoints: false,
            modules: false
          })
        )
        resolve()
      }
    })
  })
}
