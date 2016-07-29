var rimraf = require('rimraf')
var path = require('path')

var projectRoot = process.cwd()

module.exports = function() {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))
  rimraf.sync(path.join(projectRoot, 'zip'))
}
