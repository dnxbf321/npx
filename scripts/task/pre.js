import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import colors from 'colors'
import leftPad from 'left-pad'
import path from 'path'
import touchJsdoc from '../util/touch-jsdoc'
import touchEslintrc from '../util/touch-eslintrc'

var projectRoot = process.cwd()

export default () => {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))

  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'), {})
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/css'), {})
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/js'), {})

  touchJsdoc()
  touchEslintrc()

  console.log(colors.bgGreen(`[task ${leftPad('pre', 12)}]`), 'done')
  return Promise.resolve()
}
