var postcssEasyImport = require('postcss-easy-import')
var stylelint = require('stylelint')
var precss = require('precss')
var rucksackCss = require('rucksack-css')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var postcssConf = require('../conf/postcss.json')

var postcssPlugins = [
  postcssEasyImport(postcssConf['postcss-easy-import'] || {}),
  stylelint(postcssConf.stylelint || {}),
  precss(postcssConf.precss || {}),
  rucksackCss(postcssConf['rucksack-css'] || {}),
  autoprefixer(postcssConf.autoprefixer || {}),
  cssnano(postcssConf.cssnano || {})
]

module.exports = postcssPlugins
