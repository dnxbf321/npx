import webpack from 'webpack'
import colors from 'colors'
import leftPad from 'left-pad'
import getProdConf from '../webpack-conf/webpack-prod-conf'
import aliasEnv from '../util/alias-env'

export default (env) => {
  env = aliasEnv(env)

  var conf = getProdConf(env)
  if (!conf) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    var compiler = webpack(conf)
    compiler.run((err, stats) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('webpack', 12)}]`), err)
        reject()
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('webpack', 12)}]`), stats.toString('normal'))
        resolve()
      }
    })
  })
}