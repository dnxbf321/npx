/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:22:50
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:45:45
*/
const path = require('path')
const glob = require('glob')
const getConfig = require('../util/config')

const projectRoot = path.join(process.cwd(), 'client')

module.exports = (env, filter) => {
  let config = getConfig(env)

  let ret = {}
  let entries = glob.sync(projectRoot + '/static/**/*.wp.js', {
    cwd: projectRoot
  })

  if (filter) {
    let filterRegExps = filter.split(',').map(it => {
      let fixStr = it.replace('.wp.js', '').replace(/[\/]/g, '\\/')
      return new RegExp(fixStr, 'i')
    })

    entries = entries.filter(name => {
      return filterRegExps.some(re => {
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
