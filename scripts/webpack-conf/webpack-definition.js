import getConfig from '../util/config'

function formatDefinitions(obj) {
  const dealKV = (vObj, comb) => {
    Object.keys(vObj).forEach((k) => {
      let v = vObj[k]
      let kComb = comb ? [comb, k].join('.') : k
      switch (Object.prototype.toString.call(v)) {
        case '[object Number]':
        case '[object String]': // define plugin 把 string 当做可执行代码
          obj[kComb] = JSON.stringify(v)
          break
        case '[object Object]':
          dealKV(v, kComb)
          obj[kComb] = JSON.stringify(kComb + ' is not a leaf node, you can use like \`' + kComb + '.' + Object.keys(v)[0] + '\`')
          break
        default:
      }
    })
  }
  dealKV(obj)
  return obj
}

export default (env) => {
  var envConfig = getConfig(env, 'isDefinition')
  envConfig = formatDefinitions(envConfig)
  return envConfig
}
