var webpack = require('webpack')
var colors = require('colors')
var getDevConf = require('../webpack-conf/webpack-dev-conf')
var getProdConf = require('../webpack-conf/webpack-prod-conf')
var aliasEnv = require('../util/alias-env')

module.exports = function(env) {
  switch (env) {
    case 'development':
    case 'dev':
      conf = getDevConf('development')
      break
    case 'experiment':
    case 'exp':
      conf = getProdConf('experiment')
      break
    case 'production':
    case 'prod':
    default:
      conf = getProdConf('production')
  }
  webpack(conf, (err, stats) => {
    if (err) {
      console.log(colors.bgRed('[task webpack]'), ' ', err)
    } else {
      console.log(colors.bgGreen('[task webpack]'), ' ', stats.toString('normal'))
    }
  })
}