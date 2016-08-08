var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require('glob')
var path = require('path')
var chunks = require('./webpack-entry')
var getConfig = require('../util/config')

var projectRoot = path.join(process.cwd(), 'client')
var entryPrefixer = getConfig().entryPrefixer || ''

var chunkNames = []
for (var name in chunks) {
  chunkNames.push(name)
}

var minify = {
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

var htmlsInFolders = glob.sync('!(partial)/**/*', {
  cwd: projectRoot + '/static/html'
})
var htmlsInCurDir = glob.sync('*.@(html|hbs)', {
  cwd: projectRoot + '/static/html'
})
var all = [].concat(htmlsInFolders, htmlsInCurDir)

var plugins = []

all.forEach(function(it) {
  var withoutExt = it.replace(path.extname(it), '')
  var chunkMatch = chunkNames.find(function(chunk) {
    chunk = path.dirname(chunk) + '/' + entryPrefixer + path.basename(chunk)
    return chunk.replace(/\\/g, '/') === path.join('static/js', withoutExt).replace(/\\/g, '/')
  })

  var plugin = {}
  plugin.filename = withoutExt + '.html'
  plugin.template = 'static/html/' + it
  plugin.inject = true
  plugin.minify = minify
  if (chunkMatch) {
    plugin.chunks = ['static/js/' + entryPrefixer + 'common', chunkMatch]
  } else {
    plugin.chunks = []
  }

  plugins.push(new HtmlWebpackPlugin(plugin))
})

module.exports = plugins
