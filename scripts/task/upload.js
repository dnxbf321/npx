var scp = require('scp2')
var glob = require('glob')
var extend = require('extend')
var colors = require('colors')
var fs = require('fs')
var path = require('path')
var getConfig = require('../util/config')

var codePath = process.cwd()
var config = getConfig('development')
var remotePath = config.ftp.remotePath
var options = {
  port: 22,
  host: config.ftp.host,
  username: config.ftp.username,
  password: config.ftp.password
}

var client = new scp.Client(options)
var paths = []
var patterns = config.ftp.patterns || ['*', '.*']
var idx = 0
var time = Date.now()

function step() {
  var local = path.resolve(codePath, paths[idx])
  var remote
  var stats = fs.statSync(local)
  if (config.ftp.keepFinder) {
    if (stats.isFile()) {
      remote = path.dirname(path.resolve(remotePath, paths[idx]))
    } else if (stats.isDirectory()) {
      remote = path.resolve(remotePath, paths[idx])
    }
  } else {
    remote = remotePath
  }

  return new Promise(function(resolve, reject) {
    scp.scp(local, extend(options, {
      path: remote
    }), function(err) {
      if (err) {
        console.error(err)
        reject()
      } else {
        console.log(colors.bgCyan.bold('[task upload] '), local + ' => ' + remote)
        resolve()
      }
    })
  })
}

function run() {
  return step()
    .then(function() {
      idx += 1
      if (idx < paths.length) {
        return run()
      } else {
        client.close()
        console.log(colors.bgCyan.bold('[task upload]'), 'done in ' + (Date.now() - time) / 1000 + 's')
      }
    })
}

module.exports = function() {
  patterns.forEach(function(pattern) {
    var _paths = glob.sync(pattern, {
      cwd: codePath,
      ignore: ['.git', '*.log*', 'node_modules', 'zip', 'log', 'tmp']
    })
    paths = paths.concat(_paths)
  })
  client.mkdir(remotePath, function() {
    if (paths.length) {
      run()
    }
  })
}
