const getConfig = require('../util/config')

function formatDefinitions(obj) {
  const dealKV = (vObj, comb) => {
    Object.keys(vObj).forEach(k => {
      let v = vObj[k]
      let kComb = comb ? [comb, k].join('.') : k
      obj[kComb] = JSON.stringify(v)
      if (Object.prototype.toString.call(v) === '[object Object]') {
        dealKV(v, kComb)
      }
    })
  }
  dealKV(obj)
  return obj
}

module.exports = env => {
  var envConfig = getConfig(env, 'isDefinition')
  envConfig = formatDefinitions(envConfig)
  return envConfig
}
