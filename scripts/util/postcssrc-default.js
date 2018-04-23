/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:14:56
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 19:47:01
*/
const path = require('path')
const getConfig = require('./config')

module.exports = env => {
  let config = getConfig(env)
  return {
    'postcss-easy-import': {
      prefix: '_'
    },
    precss: {
      import: {
        disable: true
      }
    },
    'postcss-pxtorem': {
      rootValue: 16,
      propWhiteList: [],
      selectorBlackList: [/^html$/, /\.norem/]
    },
    'rucksack-css': {
      fallbacks: true
    },
    'postcss-assets': {
      loadPaths: [path.join(process.cwd(), 'client/static/img')],
      basePath: 'client',
      baseUrl: config.client.publicPath,
      cachebuster: true,
      relative: true
    },
    autoprefixer: {
      browsers: [
        'last 2 versions',
        '> 5%',
        'safari >= 8',
        'ie >= 8',
        'Firefox ESR',
        'iOS >= 8',
        'android >= 4'
      ]
    },
    cssnano: {
      safe: true,
      discardComments: {
        removeAll: true
      },
      filterPlugins: false
    },
    'postcss-reporter': {
      clearMessages: true
    }
  }
}
