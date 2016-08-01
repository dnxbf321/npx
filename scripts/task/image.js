var path = require('path')
var colors = require('colors')
var ncp = require('ncp').ncp
var mkdirp = require('mkdirp')
var imagemin = require('imagemin')
var jpegtran = require('imagemin-jpegtran')
var optipng = require('imagemin-optipng')
var svgo = require('imagemin-svgo')

var projectRoot = process.cwd()

function ncpImage() {
  ncp(path.join(projectRoot, 'client/static/img'), path.join(projectRoot, 'client/dist/static/img'), function(err) {
    if (err) {
      console.log(colors.bgRed('[task image]'), err)
    } else {
      console.log(colors.bgGreen('[task image]'), 'done')
    }
  })
}

module.exports = function() {
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'))
  ncpImage()
}
