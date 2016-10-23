import scp from 'scp2'
import glob from 'glob'
import extend from 'extend'
import colors from 'colors'
import leftPad from 'left-pad'
import fs from 'fs'
import path from 'path'
import getConfig from '../util/config'

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
var idx = 0
var time = Date.now()

var paths = []
var patterns = config.ftp.patterns || ['*', '.*']
patterns.forEach((pattern) => {
  var _paths = glob.sync(pattern, {
    cwd: codePath,
    ignore: ['.git', '*.log*', 'node_modules', 'zip', 'log', 'tmp']
  })
  paths = paths.concat(_paths)
})

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

  return new Promise((resolve, reject) => {
    scp.scp(local, extend(options, {
      path: remote
    }), (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('upload', 12)}]`), err)
        reject()
      } else {
        console.log(colors.bgCyan.bold(`[task ${leftPad('upload', 12)}]`), local + ' => ' + remote)
        resolve()
      }
    })
  })
}

function run() {
  return step()
    .then(() => {
      idx += 1
      if (idx < paths.length) {
        return run()
      } else {
        client.close()
        console.log(colors.bgCyan.bold(`[task ${leftPad('upload', 12)}]`), 'done in ' + (Date.now() - time) / 1000 + 's')
      }
    })
}

export default () => {
  return new Promise((resolve, reject) => {
    client.mkdir(remotePath, () => {
      if (paths.length) {
        run()
          .then(() => {
            resolve()
          })
          .catch(() => {
            reject()
          })
      }
    })
  })
}
