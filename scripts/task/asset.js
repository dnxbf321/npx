var path = require('path')
var colors = require('colors')
var ncp = require('ncp').ncp

var projectRoot = process.cwd()

module.exports = function() {
  ncp(path.join(projectRoot, 'client/asset'), path.join(projectRoot, 'client/dist/static'), function(err) {
    if (err) {
      console.log(colors.bgRed('[task asset]'), err)
    } else {
      console.log(colors.bgGreen('[task asset]'), 'done')
    }
  })
}
