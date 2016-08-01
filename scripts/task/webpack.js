var webpack = require('webpack')
var colors = require('colors')
var getDevConf = require('../webpack-conf/webpack-dev-conf')
var getProdConf = require('../webpack-conf/webpack-prod-conf')
var aliasEnv = require('../util/alias-env')

module.exports = function(env) {
  env = aliasEnv(env)
  var conf = getProdConf(env)
  webpack(conf, (err, stats) => {
    if (err) {
      console.log(colors.bgRed('[task webpack]'), err)
    } else {
      console.log(colors.bgGreen('[task webpack]'), stats.toString('normal'))
    }
  })
}