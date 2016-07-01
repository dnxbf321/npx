var extend = require('extend')
var path = require('path')
var config = require('../../config.json')

var env = process.env.NODE_ENV || 'production'
var envConfig = extend(true, {}, config['default'], config[env])

module.exports = {
  use: ['postcss-easy-import', 'stylelint', 'precss', 'rucksack-css', 'postcss-assets', 'autoprefixer', 'cssnano', 'postcss-reporter'],
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
