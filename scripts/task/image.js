/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:05:17
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:44:05
*/
const path = require('path')
const { ncp } = require('ncp')
const mkdirp = require('mkdirp')
const colors = require('colors')
const leftPad = require('left-pad')

const projectRoot = process.cwd()
module.exports = () => {
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'))
  return new Promise((resolve, reject) => {
    ncp(
      path.join(projectRoot, 'client/static/img'),
      path.join(projectRoot, 'client/dist/static/img'),
      err => {
        if (err) {
          console.log(colors.bgRed(`[task ${leftPad('image', 12)}]`), err)
          reject(err)
        } else {
          console.log(colors.bgGreen(`[task ${leftPad('image', 12)}]`), 'done')
          resolve()
        }
      }
    )
  })
}
