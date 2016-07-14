var extend = require('extend')
var config = require('../../config.json')

module.exports = function(key) {
  var keyChain = key.split('.')
  var env = process.env.NODE_ENV
  var defaultConfig = config['default']
  var v = extend(true, {}, {
    'process.env': {
      NODE_ENV: env || 'production'
    }
  }, defaultConfig, config[env] || {}, {
    version: Date.now()
  })
  for (var i = 0, len = keyChain.length; i < len; i++) {
    v = v[keyChain[i]]
  }
  return v
}
