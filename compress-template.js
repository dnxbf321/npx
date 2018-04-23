#!/usr/bin/env node

const archiver = require('archiver')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')

const tplFolder = path.join(process.cwd(), 'template')
const patterns = ['.*', '*', '*/**/*']

function compress(tplName) {
  return new Promise((resolve, reject) => {
    let zip = archiver('zip', {
      level: 9
    })

    let output = fs.createWriteStream(path.join(tplFolder, tplName + '.zip'))
    output.on('close', () => {
      console.log(tplName + ' has been finalized. ' + zip.pointer() + ' total bytes')
      resolve()
    })

    zip.on('error', err => {
      console.log(colors.bgRed(`[task ${leftPad('pack', 12)}]`), err)
      reject(err)
    })

    zip.pipe(output)

    patterns.forEach(pattern => {
      zip.glob(pattern, {
        cwd: path.join(process.cwd(), 'example', tplName),
        ignore: [
          '*.log*',
          'node_modules',
          'node_modules/**/*',
          '*/dist',
          '*/dist/**/*',
          'zip',
          'zip/**/*',
          'log',
          'log/**/*',
          'tmp',
          'tmp/**/*',
          '.git',
          '.git/**/*'
        ]
      })
    })

    zip.finalize()
  })
}

rimraf.sync(tplFolder)
mkdirp.sync(tplFolder)
compress('normal(react)')
compress('vue@1')
compress('vue@2')
