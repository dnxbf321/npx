import extend from 'extend'
import postcssEasyImport from 'postcss-easy-import'
import stylelint from 'stylelint'
import precss from 'precss'
import postcssPxtorem from 'postcss-pxtorem'
import rucksackCss from 'rucksack-css'
import postcssAssets from 'postcss-assets'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcssRepoter from 'postcss-reporter'
import getPostcssConf from './postcss-conf'
import getConfig from './config'

export default (env) => {
  var postcssConf = getPostcssConf(env)
  var config = getConfig(env)
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
