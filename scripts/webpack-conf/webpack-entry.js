import path from 'path'
import glob from 'glob'
import getConfig from '../util/config'

var projectRoot = path.join(process.cwd(), 'client')
var config = getConfig()

var ret = {}
var entries = glob.sync(projectRoot + '/static/**/*.wp.js', {
  cwd: projectRoot
})

entries.forEach((it) => {
  var filePath = path.relative(projectRoot, it)
  var entryName = filePath.slice(0, -6)
  if (config['entryPrefixer']) {
    entryName = path.dirname(entryName) + '/' + config['entryPrefixer'] + path.basename(entryName)
  }
  entryName = entryName.replace(/\\/g, '/')
  ret[entryName] = './' + filePath
})

export default ret
