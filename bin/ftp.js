var scp = require('scp2')
var glob = require('glob')
var extend = require('extend')
var fs = require('fs')
var path = require('path')
var config = require('../config.json')
var packageConfig = require('../package.json')

var codePath = path.join(__dirname, '../')
var remotePath = path.resolve(config.ftp.remotePath, packageConfig.name)
var options = {
  port: 22,
  host: config.ftp.host,
  username: config.ftp.username,
  password: config.ftp.password
}

var paths = []
var patterns = ['*', '.*']

patterns.forEach(function(pattern) {
  var _paths = glob.sync(pattern, {
    cwd: codePath,
    ignore: ['.git', '*.log*', 'node_modules', 'zip', 'log']
  })
  paths = paths.concat(_paths)
})

var time = Date.now()
var client = new scp.Client(options)
client.mkdir(remotePath, function() {
  paths.forEach(function(itPath, idx) {
    var itLocalPath = path.resolve(codePath, itPath)
    var itRemotePath
    var stats = fs.statSync(itLocalPath)
    if (stats.isFile()) {
      itRemotePath = path.dirname(path.resolve(remotePath, itPath))
    } else if (stats.isDirectory()) {
      itRemotePath = path.resolve(remotePath, itPath)
    }

    scp.scp(itLocalPath, extend(options, {
      path: itRemotePath
    }), function(err) {
      if (err) {
        console.error(err)
      }
      if (idx === paths.length - 1) {
        console.log('[task ftp] upload all files in ' + (Date.now() - time)/1000 + 's')
        client.close()
      }
    })
  })
})

