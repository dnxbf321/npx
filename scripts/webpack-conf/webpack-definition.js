/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:21:25
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:45:33
*/
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
