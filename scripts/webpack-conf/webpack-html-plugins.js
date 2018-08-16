/*
* @Author: dengjiayao
* @Date:   2018-02-08 17:43:09
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:43:19
*/
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const path = require('path')
const getEntry = require('./webpack-entry')
const getConfig = require('../util/config')

const projectRoot = path.join(process.cwd(), 'client')

const minify = {
  // 行内元素内容至多保留一个空格
  collapseBooleanAttributes: true, // disabled="disabled" => disabled
  collapseInlineTagWhitespace: true, // display:inline element collapseWhitespace=true
  collapseWhitespace: true, // <div> <p>    foo </p>    </div> => <div><p>foo</p></div>
  conservativeCollapse: true, // collapse to 1 space (never remove it entirely)
  preserveLineBreaks: true, // collapse to 1 line break (never remove it entirely)

  quoteCharacter: '"',

  removeComments: true, // 删除注释
  removeScriptTypeAttributes: true, // remove type="text/javascript"
  removeStyleLinkTypeAttributes: true, // remove type="text/css"
  useShortDoctype: true // html5 doctype
}

let htmlsInFolders = glob.sync('!(partial)/**/*', {
  cwd: projectRoot + '/static/html'
})
let htmlsInCurDir = glob.sync('*.@(html|hbs)', {
  cwd: projectRoot + '/static/html'
})
let all = [].concat(htmlsInFolders, htmlsInCurDir)

module.exports = (env, filter) => {
  let config = getConfig(env)
  let chunks = getEntry(env, filter)

  let entryPrefixer = config.entryPrefixer || ''
  let webpackNoCommon = config.webpack['no-common'] || false
  let webpackNoHtmlInject = config.webpack['no-html-inject'] || false

  let chunkNames = []
  for (let name in chunks) {
    chunkNames.push(name)
  }

  if (filter) {
    let filterRegExps = filter.split(',').map(it => {
      let fixStr = it.replace('.wp.js', '').replace(/[\/]/g, '\\/')
      return new RegExp(fixStr, 'i')
    })

    all = all.filter(name => {
      return filterRegExps.some(re => {
        return re.test(name)
      })
    })
  }

  let plugins = []

  all.forEach(it => {
    let withoutExt = it.replace(path.extname(it), '')
    let chunkMatch = chunkNames.find(chunk => {
      return chunk === path.join('static/js', entryPrefixer + withoutExt).replace(/\\/g, '/')
    })

    let plugin = {}
    plugin.filename = withoutExt + '.html'
    plugin.template = 'static/html/' + it
    plugin.inject = !webpackNoHtmlInject
    plugin.minify = minify
    if (chunkMatch) {
      plugin.chunks = [chunkMatch]
      if (!webpackNoCommon) {
        plugin.chunks.unshift('static/js/' + entryPrefixer + 'common')
      }
    } else {
      plugin.chunks = []
    }

    plugins.push(new HtmlWebpackPlugin(plugin))
  })

  return plugins
}
