const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

const cliRoot = path.join(__dirname, '../../')
const projectRoot = process.cwd()

module.exports = () => {
  try {
    fs.accessSync(path.join(projectRoot, '.jsdoc.json'))
  } catch (e) {
    console.log(
      '[task          pre] .jsdoc.json can not access, ncp one copy from npx'
    )
    ncp(
      path.join(cliRoot, '.jsdoc.json'),
      path.join(projectRoot, '.jsdoc.json')
    )
  }
}
