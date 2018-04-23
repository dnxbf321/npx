/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:13:12
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 19:51:01
*/
const extend = require('extend')
const path = require('path')
const requireUncached = require('require-uncached')
const configJson = require('../../npx.json')

const projectRoot = process.cwd()
let projectConf = {}

try {
  projectConf = requireUncached(path.join(projectRoot, 'npx.json'))
} catch (e) {
  projectConf = {}
}

let config = extend(true, {}, configJson, projectConf)

module.exports = (env, isDefinition) => {
  env = env || global.NODE_ENV || process.env.NODE_ENV
  let defaultConfig = config['default']
  let envConfig = extend(true, {}, defaultConfig, config[env || 'production'] || {}, {
    'process.env': {
      NODE_ENV: env
    },
    version: Date.now()
  })
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
