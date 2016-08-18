var clone = require('git-clone')
var colors = require('colors')
var glob = require('glob')
var rimraf = require('rimraf')
var path = require('path')

module.exports = function() {
  var found = glob.sync('@(*|.*)')

  if (found.length) {
    console.log(colors.bgRed('[task init]'), 'this folder is not empty')
  } else {
    console.log(colors.bgGreen('[task init]'), 'wait seconds to download the template')
    clone('https://github.com/dnxbf321/npx-template.git', process.cwd(), function(err) {
      if (err) {
        console.log(colors.bgRed('[task init]'), err)
      } else {
        rimraf.sync(path.join(process.cwd(), '.git'))
        console.log(colors.bgGreen('[task init]'), 'done')
      }
    })
  }
}
