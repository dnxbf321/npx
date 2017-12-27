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
