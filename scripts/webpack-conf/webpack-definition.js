import getConfig from '../util/config'

function formatDefinitions(obj) {
  Object.keys(obj).forEach((k) => {
    let v = obj[k]
    let typeV = Object.prototype.toString.call(v)
    switch (typeV) {
      case '[object Number]':
      case '[object String]': // define plugin 把 string 当做可执行代码
        obj[k] = JSON.stringify(v)
        break
      case '[object Object]':
        obj[k] = formatDefinitions(v)
        break
      default:
    }
  })
  return obj
}

export default (env) => {
  var envConfig = getConfig(env)
  envConfig = formatDefinitions(envConfig)
  return envConfig
}
