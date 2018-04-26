/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:22:50
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 17:06:34
*/
const path = require('path')
const glob = require('glob')
const getConfig = require('../util/config')

const projectRoot = path.join(process.cwd(), 'client')

function collectJses(filters) {
  let jses = glob.sync(projectRoot + '/static/**/*.wp.js', {
    cwd: projectRoot
  })

  let ret = []
  if (filters.length) {
    while (filters.length) {
      let filter = filters.shift()
      let reg = new RegExp(filter, 'i')
      ret = ret.concat(
        jses.filter(name => {
          return reg.test(name)
        })
      )
    }
  } else {
    ret = jses
  }
  return ret
}

module.exports = env => {
  let config = getConfig(env)
  let entryPrefixer = config.webpack['entry-prefixer'] || ''
  let entryFilter = config.webpack['entry-filter'] || []

  let jses = collectJses(entryFilter)
  let ret = {}
  for (let it of jses) {
    let filePath = path.relative(projectRoot, it)
    let entryName = filePath.slice(0, -6)
    if (entryPrefixer) {
      entryName = path.dirname(entryName) + '/' + entryPrefixer + path.basename(entryName)
    }
    entryName = entryName.replace(/\\/g, '/')
    ret[entryName] = './' + filePath
  }

  return ret
}
