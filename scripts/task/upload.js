const scp = require('scp2')
const glob = require('glob')
const extend = require('extend')
const colors = require('colors')
const leftPad = require('left-pad')
const fs = require('fs')
const path = require('path')
const getConfig = require('../util/config')

const codePath = process.cwd()
let config = getConfig('development')
let remotePath = config.ftp.remotePath
let options = {
  port: 22,
  host: config.ftp.host,
  username: config.ftp.username,
  password: config.ftp.password
}

let client = new scp.Client(options)
let idx = 0
let time = Date.now()

let paths = []
let patterns = config.ftp.patterns || ['*', '.*']
patterns.forEach(pattern => {
  let _paths = glob.sync(pattern, {
    cwd: codePath,
    ignore: ['.git', '*.log*', 'node_modules', 'zip', 'log', 'tmp']
  })
  paths = paths.concat(_paths)
})

function step() {
  let local = path.resolve(codePath, paths[idx])
  let remote
  let stats = fs.statSync(local)
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
    scp.scp(
      local,
      extend(options, {
        path: remote
      }),
      err => {
        if (err) {
          console.log(colors.bgRed(`[task ${leftPad('upload', 12)}]`), err)
          reject(err)
        } else {
          console.log(
            colors.bgCyan.bold(`[task ${leftPad('upload', 12)}]`),
            local + ' => ' + remote
          )
          resolve()
        }
      }
    )
  })
}

module.exports = async () => {
  await client.mkdir(remotePath)
  while (idx < paths.length) {
    await step()
    idx += 1
  }
  client.close()
  console.log(
    colors.bgCyan.bold(`[task ${leftPad('upload', 12)}]`),
    'done in ' + (Date.now() - time) / 1000 + 's'
  )
}
