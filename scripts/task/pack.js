import archiver from 'archiver'
import mkdirp from 'mkdirp'
import colors from 'colors'
import leftPad from 'left-pad'
import moment from 'moment'
import path from 'path'
import fs from 'fs'

var projectRoot = process.cwd()

export default () => {
  var packageConfig = require(path.join(projectRoot, 'package.json'))

  mkdirp(path.join(projectRoot, 'zip'))

  function pack(zipName, patterns, ctx) {
    return new Promise((resolve, reject) => {
      patterns = [].concat(patterns)

      var zip = archiver.create('zip')
      var outputFilename = moment().format('YYYY-MM-DD HH-mm-ss') + '_' + packageConfig.name + '-' + zipName
      var output = fs.createWriteStream(path.join(projectRoot, 'zip', outputFilename))
      output.on('close', () => {
        console.log(colors.bgGreen(`[task ${leftPad('pack', 12)}]`), outputFilename + ' has been finalized. ' + zip.pointer() + ' total bytes')
        resolve()
      })
      zip.on('error', (err) => {
        console.log(colors.bgRed(`[task ${leftPad('pack', 12)}]`), err)
        reject()
      })
      zip.pipe(output)
      patterns.forEach((pattern) => {
        zip.glob(pattern, {
          cwd: ctx,
          ignore: ['*.log*', 'node_modules', 'node_modules/**/*', 'zip', 'zip/**/*', 'log', 'log/**/*', 'tmp', 'tmp/**/*', '.git', '.git/**/*']
        })
      })
      zip.finalize()
    })
  }

  var pack1 = pack('static.zip', '**/*', path.join(projectRoot, 'client/dist'))
  var pack2 = pack('source.zip', ['.*', '*', '*/**/*', 'client/**/*'], projectRoot)
  return Promise.all([pack1, pack2])
}
