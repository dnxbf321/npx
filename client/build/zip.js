var archiver = require('archiver')
var path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
var moment = require('moment')

var codePath = process.cwd()

var package = require(path.join(codePath, 'package.json'))

mkdirp(path.join(codePath, 'zip'))

function pack(zipName, patterns, ctx) {
  patterns = [].concat(patterns)

  var zip = archiver.create('zip')
  var output = fs.createWriteStream(path.join(codePath, 'zip', moment().format('YYYY-MM-DD HH:mm:ss') + '_' + package.name + '-' + zipName))
  output.on('close', function() {
    console.log(zip.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })
  zip.on('error', function(err) {
    throw err;
  })
  zip.pipe(output)
  patterns.forEach(function(pattern) {
    zip.glob(pattern, {
      cwd: ctx
    })
  })
  zip.finalize()
}

pack('static.zip', '**/*', path.join(codePath, 'client/dist'))
pack('server.zip', ['server/**/*', 'upload/**/*', '.babelrc', '.eslintrc.js', '**.js', '**.json', '**.md'], codePath)
pack('project.zip', ['client/**/*', 'server/**/*', 'upload/**/*', '.babelrc', '.eslintrc.js', '**.js', '**.json', '**.md'], codePath)
