var extend = require('extend')
var postcssEasyImport = require('postcss-easy-import')
var stylelint = require('stylelint')
var precss = require('precss')
var postcssPxtorem = require('postcss-pxtorem')
var rucksackCss = require('rucksack-css')
var postcssAssets = require('postcss-assets')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var postcssRepoter = require('postcss-reporter')
var getPostcssConf = require('./postcss-conf')
var config = require('../../config.json')

module.exports = function(env) {
  var postcssConf = getPostcssConf(env)

  var enableConfig = extend({
    'postcss-easy-import': true,
    'stylelint': false,
    'precss': true,
    'postcss-pxtorem': true,
    'rucksack-css': true,
    'postcss-assets': true,
    'autoprefixer': true,
    'cssnano': env !== 'development',
    'postcss-reporter': true
  }, config['postcss'] || {})

  var plugins = []
  if (enableConfig['postcss-easy-import']) {
    plugins.push(postcssEasyImport(postcssConf['postcss-easy-import'] || {}))
  }
  if (enableConfig['stylelint']) {
    plugins.push(stylelint(postcssConf.stylelint || {}))
  }
  if (enableConfig['precss']) {
    plugins.push(precss(postcssConf.precss || {}))
  }
  if (enableConfig['postcss-pxtorem']) {
    plugins.push(postcssPxtorem(postcssConf['postcss-pxtorem'] || {}))
  }
  if (enableConfig['rucksack-css']) {
    plugins.push(rucksackCss(postcssConf['rucksack-css'] || {}))
  }
  if (enableConfig['postcss-assets']) {
    plugins.push(postcssAssets(postcssConf['postcss-assets'] || {}))
  }
  if (enableConfig['autoprefixer']) {
    plugins.push(autoprefixer(postcssConf.autoprefixer || {}))
  }
  if (enableConfig['cssnano']) {
    plugins.push(cssnano(postcssConf.cssnano || {}))
  }
  if (enableConfig['postcss-reporter']) {
    plugins.push(postcssRepoter(postcssConf['postcss-reporter'] || {}))
  }

  return plugins
}
