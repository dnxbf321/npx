/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:10:55
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:44:46
*/
module.exports = env => {
  switch (env) {
    case 'development':
    case 'dev':
      env = 'development'
      break
    case 'experiment':
    case 'exp':
      env = 'experiment'
      break
    case 'production':
    case 'prod':
    default:
      env = 'production'
  }
  global.NODE_ENV = env
  return env
}
