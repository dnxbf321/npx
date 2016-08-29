import webpack from 'webpack'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
import colors from 'colors'
import getProdConf from '../webpack-conf/webpack-prod-conf'
import aliasEnv from '../util/alias-env'

export default (env) => {
  env = aliasEnv(env)
  var conf = getProdConf(env)
  var compiler = webpack(conf)
  compiler.apply(new ProgressPlugin((percentage, msg) => {
    console.log(colors.bgGreen('[task webpack]'), parseInt(percentage * 100) + '%', msg)
  }))
  compiler.run((err, stats) => {
    if (err) {
      console.log(colors.bgRed('[task webpack]'), err)
    } else {
      console.log(colors.bgGreen('[task webpack]'), stats.toString('normal'))
    }
  })
}