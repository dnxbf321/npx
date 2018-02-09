/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:12:16
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:44:50
*/
const fs = require('fs')
const path = require('path')

const cliRoot = path.join(__dirname, '../../')

let babelrc = fs.readFileSync(path.join(cliRoot, '.babelrc'), {
  encoding: 'utf8'
})
babelrc = JSON.parse(babelrc.toString())

babelrc.presets = babelrc.presets.map(it => {
  if (typeof it === 'string') {
    return require.resolve('babel-preset-' + it)
  } else {
    return [require.resolve('babel-preset-' + it[0]), it[1]]
  }
})
babelrc.plugins = babelrc.plugins.map(it => {
  if (typeof it === 'string') {
    return it.indexOf('react-hot-loader') > -1
      ? require.resolve(it)
      : require.resolve('babel-plugin-' + it)
  } else {
    return [require.resolve('babel-plugin-' + it[0]), it[1]]
  }
})

module.exports = babelrc
