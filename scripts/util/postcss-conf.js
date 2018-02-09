/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:14:56
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:45:06
*/
const extend = require('extend')
const path = require('path')
const getConfig = require('./config')

const pluginList = [
  'postcss-easy-import',
  'precss',
  'postcss-pxtorem',
  'rucksack-css',
  'postcss-assets',
  'autoprefixer',
  'cssnano',
  'postcss-reporter'
]

module.exports = env => {
  let config = getConfig(env)
  let postcss = config['postcss'] || {}

  let usePlugins = pluginList.filter(pluginName => {
    return postcss[pluginName] === undefined ? true : !!postcss[pluginName]
  })

  for (let name in postcss) {
    if (Object.prototype.toString.call(postcss[name]) !== '[object Object]') {
      postcss[name] = {}
    }
  }

  return {
    use: usePlugins,
    'postcss-easy-import': extend(
      true,
      {
        prefix: '_'
      },
      postcss['postcss-easy-import']
    ),
    precss: extend(
      true,
      {
        import: {
          disable: true
        }
      },
      postcss['precss']
    ),
    'postcss-pxtorem': extend(
      true,
      {
        propWhiteList: [],
        selectorBlackList: [/^html$/, /\.norem/]
      },
      postcss['postcss-pxtorem']
    ),
    'rucksack-css': extend(
      true,
      {
        fallbacks: true
      },
      postcss['rucksack-css']
    ),
    'postcss-assets': extend(
      true,
      {
        loadPaths: [path.join(process.cwd(), 'client/static/img')],
        basePath: 'client',
        baseUrl: config.client.publicPath,
        cachebuster: true,
        relative: true
      },
      postcss['postcss-assets']
    ),
    autoprefixer: extend(
      true,
      {
        browsers: [
          'last 2 versions',
          '> 5%',
          'safari >= 5',
          'ie >= 8',
          'opera >= 12',
          'Firefox ESR',
          'iOS >= 6',
          'android >= 4'
        ]
      },
      postcss['autoprefixer']
    ),
    cssnano: extend(
      true,
      {
        safe: true,
        discardComments: {
          removeAll: true
        },
        filterPlugins: false
      },
      postcss['cssnano']
    ),
    'postcss-reporter': extend(
      true,
      {
        clearMessages: true
      },
      postcss['postcss-reporter']
    )
  }
}
