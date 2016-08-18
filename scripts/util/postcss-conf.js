var extend = require('extend')
var path = require('path')
var getConfig = require('./config')

var pluginList = [
  'postcss-easy-import',
  'stylelint',
  'precss',
  'postcss-pxtorem',
  'rucksack-css',
  'postcss-assets',
  'autoprefixer',
  'cssnano',
  'postcss-reporter'
]

module.exports = function(env) {
  var config = getConfig(env)

  var usePlugins = pluginList.filter(function(pluginName) {
    return config['postcss'][pluginName] === undefined ? true : !!config['postcss'][pluginName]
  })

  return {
    use: usePlugins,
    'postcss-easy-import': {
      prefix: '_'
    },
    stylelint: {
      config: {
        extends: 'stylelint-config-standard',
        rules: {}
      }
    },
    precss: {
      import: {
        disable: true
      }
    },
    'postcss-pxtorem': {
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
      browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
    },
    cssnano: {
      safe: true
    },
    'postcss-reporter': {
      clearMessages: true
    }
  }
}
