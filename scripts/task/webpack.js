var webpack = require('webpack')
var ProgressPlugin = require('webpack/lib/ProgressPlugin')
var colors = require('colors')
var getProdConf = require('../webpack-conf/webpack-prod-conf')
var aliasEnv = require('../util/alias-env')

module.exports = function(env) {
  env = aliasEnv(env)
  var conf = getProdConf(env)
  var compiler = webpack(conf)
  compiler.apply(new ProgressPlugin((percentage, msg) => {
    console.log(colors.bgGreen('[task webpack]'), parseInt(percentage * 100) + '%', msg)
  }))
  compiler.run((err, stats) => {
    if (err) {
      console.log(colors.bgRed('[task webpack]'), err)
    } else {
      console.log(colors.bgGreen('[task webpack]'), stats.toString('normal'))
    }
  })
}