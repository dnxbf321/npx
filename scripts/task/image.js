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
  return new Promise((resolve, reject) => {
    ncp(path.join(projectRoot, 'client/static/img'), path.join(projectRoot, 'client/dist/static/img'), function(err) {
      if (err) {
        console.log(colors.bgRed('[task image]'), ' ', err)
      } else {
        console.log(colors.bgGreen('[task image]'), ' ', 'done ncp')
        resolve()
      }
    })
  })
}

function optimizeImage() {
  console.log(colors.bgGreen('[task image]'), ' ', 'start imagemin')
  imagemin([path.join(projectRoot, 'client/dist/static/img') + '/**/*.{jpg,png,svg}'], path.join(projectRoot, 'client/dist/static/img'), {
    plugins: [
      jpegtran(),
      optipng({
        optimizationLevel: 4
      }),
      svgo()
    ]
  })
    .then((imgs) => {
      console.log(colors.bgGreen('[task image]'), ' ', 'done imagemin')
    })
}

module.exports = function(optimizeFlag) {
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'))
  if (optimizeFlag) {
    ncpImage()
      .then(() => {
        optimizeImage()
      })
  } else {
    ncpImage()
  }
}
