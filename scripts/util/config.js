var extend = require('extend')
var config = require('../../config.json')

module.exports = function() {
  var env = process.env.NODE_ENV
  var defaultConfig = config['default']
  var envConfig = extend(true, {}, defaultConfig, config[env] || {}, {
    version: Date.now()
  })
  return envConfig
}
