const extend = require('extend')
const postcssEasyImport = require('postcss-easy-import')
const precss = require('precss')
const postcssPxtorem = require('postcss-pxtorem')
const rucksackCss = require('rucksack-css')
const postcssAssets = require('postcss-assets')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssRepoter = require('postcss-reporter')
const getPostcssConf = require('./postcss-conf')
const getConfig = require('./config')

module.exports = env => {
  let postcssConf = getPostcssConf(env)
  let config = getConfig(env)
  let enableConfig = extend(
    {
      'postcss-easy-import': true,
      precss: true,
      'postcss-pxtorem': true,
      'rucksack-css': true,
      'postcss-assets': true,
      autoprefixer: true,
      cssnano: env !== 'development',
      'postcss-reporter': true
    },
    config['postcss'] || {}
  )

  let plugins = []
  if (enableConfig['postcss-easy-import']) {
    plugins.push(postcssEasyImport(postcssConf['postcss-easy-import'] || {}))
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
