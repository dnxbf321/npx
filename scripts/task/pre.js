var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var path = require('path')
var colors = require('colors')

var projectRoot = process.cwd()

module.exports = function() {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))

  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'), {})
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/css'), {})
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/js'), {})

  console.log(colors.bgGreen('[task pre]'), 'done')
}
