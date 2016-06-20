var path = require('path')
var glob = require('glob')
var projectRoot = path.join(process.cwd(), 'client/static')

var ret = {}
var entries = glob.sync(projectRoot + '/**/*.wp.js', {
  cwd: projectRoot
})
entries.forEach(function(it) {
  var filePath = path.relative(projectRoot, it)
  var entryName = filePath.slice(0, -6)
  ret[entryName] = './' + filePath
})

module.exports = ret
