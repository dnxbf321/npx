import archiver from 'archiver'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import moment from 'moment'
import colors from 'colors'

var projectRoot = process.cwd()

export default () => {
  var packageConfig = require(path.join(projectRoot, 'package.json'))

  mkdirp(path.join(projectRoot, 'zip'))

  function pack(zipName, patterns, ctx) {
    patterns = [].concat(patterns)

    var zip = archiver.create('zip')
    var outputFilename = moment().format('YYYY-MM-DD HH-mm-ss') + '_' + packageConfig.name + '-' + zipName
    var output = fs.createWriteStream(path.join(projectRoot, 'zip', outputFilename))
    output.on('close', () => {
      console.log(colors.bgCyan.bold('[task pack]'), zip.pointer() + ' total bytes')
      console.log(colors.bgCyan.bold('[task pack]'), outputFilename + ' has been finalized and the output file descriptor has closed.')
    })
    zip.on('error', (err) => {
      throw err;
    })
    zip.pipe(output)
    patterns.forEach((pattern) => {
      zip.glob(pattern, {
        cwd: ctx,
        ignore: ['*.log*', 'node_modules', 'node_modules/**/*', 'zip', 'zip/**/*', 'log', 'log/**/*', 'tmp', 'tmp/**/*', '.git', '.git/**/*']
      })
    })
    zip.finalize()
  }

  pack('static.zip', '**/*', path.join(projectRoot, 'client/dist'))
  pack('source.zip', ['.*', '*', '*/**/*', 'client/**/*'], projectRoot)
}
