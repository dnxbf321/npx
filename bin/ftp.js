var ftp = require('vinyl-ftp')
var path = require('path')
var config = require('../config.json')
var packageConfig = require('../package.json')

var codePath = path.join(__dirname, '../')

var conn = ftp.create({
  host: config.ftp.host,
  port: config.ftp.port,
  user: config.ftp.user,
  password: config.ftp.password
})

conn
  .src(['client/**/*', 'server/**/*', 'bin/**/*', '.*', '*'], {
    cwd: codePath,
    base: codePath
  })
  .pipe(conn.mode(packageConfig.name, '0777'))
  .pipe(conn.dest(packageConfig.name))