var archiver = require('archiver')
var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
var moment = require('moment')
var colors = require('colors')

var projectRoot = process.cwd()

var packageConfig = require(path.join(projectRoot, 'package.json'))

module.exports = function() {
  mkdirp(path.join(projectRoot, 'zip'))

  function pack(zipName, patterns, ctx) {
    patterns = [].concat(patterns)

    var zip = archiver.create('zip')
    var outputFilename = moment().format('YYYY-MM-DD HH-mm-ss') + '_' + packageConfig.name + '-' + zipName
    var output = fs.createWriteStream(path.join(projectRoot, 'zip', outputFilename))
    output.on('close', function() {
      console.log(colors.bgCyan.bold('[task pack]'), zip.pointer() + ' total bytes')
      console.log(colors.bgCyan.bold('[task pack]'), outputFilename + ' has been finalized and the output file descriptor has closed.')
    })
    zip.on('error', function(err) {
      throw err;
    })
    zip.pipe(output)
    patterns.forEach(function(pattern) {
      zip.glob(pattern, {
        cwd: ctx,
        ignore: ['*.log*', 'node_modules', 'zip', 'log', 'tmp']
      })
    })
    zip.finalize()
  }

  pack('static.zip', 'static/**/*', path.join(projectRoot, 'client/dist'))
  pack('html.zip', ['**/*.html'], path.join(projectRoot, 'client/dist'))
  pack('source.zip', ['.*', '*', 'client/**/*'], projectRoot)
}
