var extend = require('extend')
var path = require('path')
var config = require('../../config.json')

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
  env = env || 'production'
  var envConfig = extend(true, {}, config['default'], config[env])

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
      selectorBlackList: [/^html$/]
    },
    'rucksack-css': {
      fallbacks: true
    },
    'postcss-assets': {
      loadPaths: [path.join(process.cwd(), 'client/static/img')],
      basePath: 'client',
      baseUrl: envConfig.client.publicPath,
      cachebuster: true
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
