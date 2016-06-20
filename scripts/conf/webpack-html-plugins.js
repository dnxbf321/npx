var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require('glob')
var path = require('path')
var projectRoot = path.join(process.cwd(), 'client/static')
var chunks = require('./webpack-entry')

var chunkNames = []
for (var name in chunks) {
  chunkNames.push(name)
}

var htmlsInFolders = glob.sync('!(partial)/**/*', {
  cwd: projectRoot + '/html'
})
var htmlsInCurDir = glob.sync('*.@(html|hbs)', {
  cwd: projectRoot + '/html'
})
var all = [].concat(htmlsInFolders, htmlsInCurDir)

var plugins = []

all.forEach(function(it) {
  var withoutExt = it.replace(path.extname(it), '')
  var chunkMatch = chunkNames.find(function(chunk) {
    return chunk === 'js/' + withoutExt
  })

  var plugin = {}
  plugin.filename = withoutExt + '.html'
  plugin.template = 'html/' + it
  plugin.inject = true
  if (chunkMatch) {
    plugin.chunks = ['js/common.js', chunkMatch]
  } else {
    plugin.chunks = []
  }

  plugins.push(new HtmlWebpackPlugin(plugin))
})

module.exports = plugins
