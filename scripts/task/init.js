var clone = require('git-clone')
var colors = require('colors')

module.exports = function() {
  clone('https://github.com/dnxbf321/npx-template.git', process.cwd(), function() {
    console.log(colors.bgGreen('[task init]'), 'done')
  })
}
