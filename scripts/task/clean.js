/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:04:44
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:44:00
*/
const rimraf = require('rimraf')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')

const projectRoot = process.cwd()
module.exports = () => {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))
  rimraf.sync(path.join(projectRoot, 'zip'))

  console.log(colors.bgGreen(`[task ${leftPad('clean', 12)}]`), 'done')
  return Promise.resolve()
}
