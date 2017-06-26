import path from 'path'
import glob from 'glob'
import getConfig from '../util/config'

var projectRoot = path.join(process.cwd(), 'client')

export default (env, filter) => {
  var config = getConfig(env)

  var ret = {}
  var entries = glob.sync(projectRoot + '/static/**/*.wp.js', {
    cwd: projectRoot
  })

  if (filter) {
    let filterRegExps = filter.split(',').map((it) => {
      let fixStr = it.replace('.wp.js', '')
        .replace(/[\/]/g, '\\\/')
      return new RegExp(fixStr, 'i')
    })

    entries = entries.filter((name) => {
      return filterRegExps.some((re) => {
        return re.test(name)
      })
    })
  }

  for (let it of entries) {
    let filePath = path.relative(projectRoot, it)
    let entryName = filePath.slice(0, -6)
    if (config['entryPrefixer']) {
      entryName = path.dirname(entryName) + '/' + config['entryPrefixer'] + path.basename(entryName)
    }
    entryName = entryName.replace(/\\/g, '/')
    ret[entryName] = './' + filePath
  }

  return ret
}
