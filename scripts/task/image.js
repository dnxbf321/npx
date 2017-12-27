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
