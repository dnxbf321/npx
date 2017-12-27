const getConfig = require('../util/config')

module.exports = key => {
  var keyChain = key.split('.')
  var v = getConfig()

  for (let i = 0, len = keyChain.length; i < len; i++) {
    v = v[keyChain[i]]
  }
  return v
}
