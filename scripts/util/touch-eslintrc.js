const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

const cliRoot = path.join(__dirname, '../../')
const projectRoot = process.cwd()

module.exports = () => {
  try {
    fs.accessSync(path.join(projectRoot, '.eslintrc.js'))
  } catch (e) {
    console.log(
      '[task          pre] eslintrc.js can not access, ncp one copy from npx'
    )
    ncp(
      path.join(cliRoot, '.eslintrc.js'),
      path.join(projectRoot, '.eslintrc.js')
    )
  }
}
