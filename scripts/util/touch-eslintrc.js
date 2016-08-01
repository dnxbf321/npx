var path = require('path')
var fs = require('fs')
var colors = require('colors')
var ncp = require('ncp').ncp

var cliRoot = path.join(__dirname, '../../')
var projectRoot = process.cwd()

module.exports = function() {
  try {
    fs.accessSync(path.join(projectRoot, '.eslintrc.js'))
  } catch ( e ) {
    console.log(colors.bgGreen('[task pre]'), '.eslintrc.js can not access, ncp one copy from npx')
    ncp(path.join(cliRoot, '.eslintrc.js'), path.join(projectRoot, '.eslintrc.js'))
  }
}
