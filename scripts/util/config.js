const extend = require('extend')
const path = require('path')
const fs = require('fs')
const configJson = require('../../config.json')

const projectRoot = process.cwd()
let projectConf = {}

try {
  projectConf = fs.readFileSync('config.json', {
    encoding: 'utf8'
  })
  projectConf = JSON.parse(projectConf.toString())
} catch (e) {
  console.log('[npx          warn] config.json not found at current path')
}

let config = extend(true, {}, configJson, projectConf)

module.exports = (env, isDefinition) => {
  env = env || global.NODE_ENV || process.env.NODE_ENV
  let defaultConfig = config['default']
  let envConfig = extend(
    true,
    {},
    defaultConfig,
    config[env || 'production'] || {},
    {
      'process.env': env,
      version: Date.now()
    }
  )
  if (!isDefinition) {
    envConfig = extend(true, {}, envConfig, {
      ftp: config['ftp'],
      jsdoc: config['jsdoc'],
      postcss: config['postcss'],
      entryPrefixer: config['entryPrefixer'],
      webpack: config['webpack'] || {}
    })
  }
  return envConfig
}
