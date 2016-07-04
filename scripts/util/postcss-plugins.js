var postcssEasyImport = require('postcss-easy-import')
var stylelint = require('stylelint')
var precss = require('precss')
var postcssPxtorem = require('postcss-pxtorem')
var rucksackCss = require('rucksack-css')
var postcssAssets = require('postcss-assets')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var postcssConf = require('../conf/postcss')

var postcssPlugins = [
  postcssEasyImport(postcssConf['postcss-easy-import'] || {}),
  stylelint(postcssConf.stylelint || {}),
  precss(postcssConf.precss || {}),
  postcssPxtorem(postcssConf['postcss-pxtorem'] || {}),
  rucksackCss(postcssConf['rucksack-css'] || {}),
  postcssAssets(postcssConf['postcss-assets'] || {}),
  autoprefixer(postcssConf.autoprefixer || {}),
  cssnano(postcssConf.cssnano || {})
]

module.exports = postcssPlugins
