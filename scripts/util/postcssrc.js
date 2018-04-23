/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:15:48
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 19:42:46
*/
const extend = require('extend')
const postcssEasyImport = require('postcss-easy-import')
const precss = require('precss')
const postcssPxtorem = require('postcss-pxtorem')
const rucksackCss = require('rucksack-css')
const postcssAssets = require('postcss-assets')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssRepoter = require('postcss-reporter')
const getConfig = require('./config')
const getPostcssDefault = require('./postcssrc-default')

const pkgs = {
  'postcss-easy-import': postcssEasyImport,
  precss: precss,
  'postcss-pxtorem': postcssPxtorem,
  'rucksack-css': rucksackCss,
  'postcss-assets': postcssAssets,
  autoprefixer: autoprefixer,
  cssnano: cssnano,
  'postcss-reporter': postcssRepoter
}

module.exports = env => {
  let { postcss: postcssConf } = getConfig(env)
  let postcssDefault = getPostcssDefault(env)

  let enable = {
    'postcss-easy-import': true,
    precss: true,
    'postcss-pxtorem': true,
    'rucksack-css': true,
    'postcss-assets': true,
    autoprefixer: true,
    cssnano: env !== 'development',
    'postcss-reporter': true
  }
  Object.keys(enable).forEach(key => {
    enable[key] = key in postcssConf ? !!postcssConf[key] : enable[key]
  })

  let plugins = []
  ;[
    'postcss-easy-import',
    'precss',
    'postcss-pxtorem',
    'rucksack-css',
    'postcss-assets',
    'autoprefixer',
    'cssnano',
    'postcss-reporter'
  ].forEach(key => {
    if (enable[key]) {
      let conf = extend(true, {}, postcssDefault[key], postcssConf[key] || {})
      let plugin = pkgs[key](conf)
      plugins.push(plugin)
    }
  })

  return { plugins }
}
