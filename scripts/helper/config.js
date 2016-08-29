import getConfig from '../util/config'

export default (key) => {
  var keyChain = key.split('.')
  var v = getConfig()

  for (let i = 0, len = keyChain.length; i < len; i++) {
    v = v[keyChain[i]]
  }
  return v
}
