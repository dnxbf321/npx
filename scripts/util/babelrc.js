var fs = require('fs')
var path = require('path')

var cliRoot = path.join(__dirname, '../../')

var babelrc = fs.readFileSync(path.join(cliRoot, '.babelrc'), {
  encoding: 'utf8'
})
babelrc = JSON.parse(babelrc.toString())

babelrc.presets = babelrc.presets.map((it) => {
  return require.resolve('babel-preset-' + it)
})
babelrc.plugins = babelrc.plugins.map((it) => {
  if (typeof it === 'string') {
    return require.resolve('babel-plugin-' + it)
  } else {
    return [
      require.resolve('babel-plugin-' + it[0]),
      it[1]
    ]
  }
})

module.exports = babelrc
