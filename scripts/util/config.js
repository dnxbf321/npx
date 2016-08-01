var extend = require('extend')
var path = require('path')
var fs = require('fs')

var config = require('../../config.json')
var projectRoot = process.cwd()
var projectConf = {}

/*var fileStat = fs.statSync(path.join(projectRoot, 'config.json'))
if (fileStat.isFile()) {
  projectConf = fs.readFileSync(path.join(projectRoot, 'config.json'), {
    encoding: 'utf8'
  })
  projectConf = JSON.parse(projectConf.toString())
}*/

config = extend(true, {}, config, projectConf)

module.exports = function(env) {
  env = env || process.env.NODE_ENV
  var defaultConfig = config['default']
  var envConfig = extend(true, {}, defaultConfig, config[env || 'production'] || {}, {
    ftp: config['ftp'],
    postcss: config['postcss'],
    version: Date.now()
  })
  return envConfig
}
