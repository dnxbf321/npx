var path = require('path')
var glob = require('glob')

module.exports = function(ctx) {
  var entries = glob.sync(ctx + '/**/*.wp.js', {
    cwd: ctx
  })
  var ret = {}
  entries.forEach(function(it) {
    var filePath = path.relative(ctx, it)
    var entryName = filePath.slice(0, -6)
    ret[entryName] = './' + filePath
  })
  return ret
}