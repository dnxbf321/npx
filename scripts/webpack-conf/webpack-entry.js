var path = require('path')
var glob = require('glob')
var getConfig = require('../util/config')

var projectRoot = path.join(process.cwd(), 'client')
var config = getConfig()

var ret = {}
var entries = glob.sync(projectRoot + '/static/**/*.wp.js', {
  cwd: projectRoot
})

entries.forEach(function(it) {
  var filePath = path.relative(projectRoot, it)
  var entryName = filePath.slice(0, -6)
  if (config['entryPrefixer']) {
    entryName = path.dirname(entryName) + '/' + config['entryPrefixer'] + path.basename(entryName)
  }
  entryName = entryName.replace(/\\/g, '/')
  ret[entryName] = './' + filePath
})

module.exports = ret
