var sass = require('node-sass')
var path = require('path')
var fs = require('fs')

var ctx = path.join(__dirname, '../static')
sass.render({
  file: path.join(ctx, 'css/style.scss'),
  outFile: path.join(ctx, '../dist/static', 'css/style.css'),
  outputStyle: 'compressed',
  sourceMap: 'string'
}, function(err, result) {
  if (!err) {
    fs.writeFile(path.join(ctx, '../dist/static', 'css/style.css'), result.css, function(err) {
      if (err) {
        console.error(err)
      }
    });
  } else {
    console.error(err)
  }
})