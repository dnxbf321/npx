import extend from 'extend'
import config from '../config.json'

export default function() {
  var env = process.env.NODE_ENV
  var defaultConfig = config['default']
  var envConfig = extend(true, {}, defaultConfig, config[env] || {}, {
    version: Date.now()
  })
  return envConfig
}
