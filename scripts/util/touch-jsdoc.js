/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:16:46
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 10:17:16
*/
const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

const npxRoot = path.join(__dirname, '../../')
const projectRoot = process.cwd()

module.exports = () => {
  try {
    fs.accessSync(path.join(projectRoot, '.jsdoc.json'))
  } catch (e) {
    console.log('[task          pre] .jsdoc.json can not access, ncp one copy from npx')
    ncp(path.join(npxRoot, '.jsdoc.json'), path.join(projectRoot, '.jsdoc.json'))
  }
}
