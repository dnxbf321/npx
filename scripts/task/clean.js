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
