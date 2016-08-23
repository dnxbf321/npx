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
  var postcss = config['postcss'] || {}

  var usePlugins = pluginList.filter(function(pluginName) {
    return postcss[pluginName] === undefined ? true : !!postcss[pluginName]
  })

  for (let name in postcss) {
    if (Object.prototype.toString.call(postcss[name]) !== '[object Object]') {
      postcss[name] = {}
    }
  }

  return {
    use: usePlugins,
    'postcss-easy-import': extend(true, {
      prefix: '_'
    }, postcss['postcss-easy-import']),
    stylelint: extend(true, {
      config: {
        extends: 'stylelint-config-standard',
        rules: {}
      }
    }, postcss['stylelint']),
    precss: extend(true, {
      import: {
        disable: true
      }
    }, postcss['precss']),
    'postcss-pxtorem': extend(true, {
      propWhiteList: [],
      selectorBlackList: [/^html$/, /\.norem/]
    }, postcss['postcss-pxtorem']),
    'rucksack-css': extend(true, {
      fallbacks: true
    }, postcss['rucksack-css']),
    'postcss-assets': extend(true, {
      loadPaths: [path.join(process.cwd(), 'client/static/img')],
      basePath: 'client',
      baseUrl: config.client.publicPath,
      cachebuster: true,
      relative: true
    }, postcss['postcss-assets']),
    autoprefixer: extend(true, {
      browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
    }, postcss['autoprefixer']),
    cssnano: extend(true, {
      safe: true
    }, postcss['cssnano']),
    'postcss-reporter': extend(true, {
      clearMessages: true
    }, postcss['postcss-reporter'])
  }
}
