/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:08:05
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:44:26
*/
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')
const touchJsdoc = require('../util/touch-jsdoc')
const touchEslintrc = require('../util/touch-eslintrc')

const projectRoot = process.cwd()
module.exports = () => {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))

  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'), {})
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/css'), {})
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/js'), {})

  touchJsdoc()
  touchEslintrc()

  console.log(colors.bgGreen(`[task ${leftPad('pre', 12)}]`), 'done')
  return Promise.resolve()
}
