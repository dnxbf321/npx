var extend = require('extend')
var config = require('../../config.json')

module.exports = function(env) {
  var defaultConfig = config['default']
  var envConfig = extend(true, {}, defaultConfig, config[env || 'production'] || {}, {
    version: Date.now()
  })
  return envConfig
}
