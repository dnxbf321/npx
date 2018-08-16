/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:02:54
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:43:50
*/
const path = require('path')
const colors = require('colors')
const leftPad = require('left-pad')
const { ncp } = require('ncp')

const projectRoot = process.cwd()
module.exports = () => {
  return new Promise((resolve, reject) => {
    ncp(
      path.join(projectRoot, 'client/asset'),
      path.join(projectRoot, 'client/dist/static'),
      err => {
        if (err) {
          console.log(colors.bgRed(`[task ${leftPad('asset', 12)}]`), err)
          reject(err)
        } else {
          console.log(colors.bgGreen(`[task ${leftPad('asset', 12)}]`), 'done')
          resolve()
        }
      }
    )
  })
}
