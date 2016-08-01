var getConfig = require('../util/config')

module.exports = function(key) {
  var keyChain = key.split('.')
  var v = getConfig('development')

  for (var i = 0, len = keyChain.length; i < len; i++) {
    v = v[keyChain[i]]
  }
  return v
}
