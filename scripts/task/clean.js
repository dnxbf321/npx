import rimraf from 'rimraf'
import colors from 'colors'
import leftPad from 'left-pad'
import path from 'path'

var projectRoot = process.cwd()

export default () => {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))
  rimraf.sync(path.join(projectRoot, 'zip'))

  console.log(colors.bgGreen(`[task ${leftPad('clean', 12)}]`), 'done')
  return Promise.resolve()
}
