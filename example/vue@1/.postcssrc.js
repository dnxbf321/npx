/**
 * fix postcss not work in
 * vue@1.x
 * vue-loader->postcss-loader
 */
var path = require('path')
var postcssEasyImport = require('postcss-easy-import')
var precss = require('precss')
var postcssPxtorem = require('postcss-pxtorem')
var rucksackCss = require('rucksack-css')
var postcssAssets = require('postcss-assets')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var postcssReporter = require('postcss-reporter')

module.exports = function(env = 'production') {
  let plugins = [
    postcssEasyImport({
      prefix: '_'
    }),
    precss({
      import: {
        disable: true
      }
    }),
    postcssPxtorem({
      rootValue: 16,
      propWhiteList: [],
      selectorBlackList: [/^html$/, /\.norem/]
    }),
    rucksackCss({
      fallbacks: true
    }),
    postcssAssets({
      loadPaths: [path.join(process.cwd(), 'client/static/img')],
      basePath: 'client',
      cachebuster: true,
      relative: true
    }),
    autoprefixer({
      browsers: [
        'last 2 versions',
        '> 5%',
        'safari >= 8',
        'ie >= 8',
        'Firefox ESR',
        'iOS >= 8',
        'android >= 4'
      ]
    }),
    cssnano({
      safe: true,
      discardComments: {
        removeAll: true
      },
      filterPlugins: false
    }),
    postcssReporter({
      clearMessages: true
    })
  ]

  if (env === 'development') {
    plugins.splice(6, 1)
  }

  return {
    plugins
  }
}
