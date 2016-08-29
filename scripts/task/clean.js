import rimraf from 'rimraf'
import path from 'path'

var projectRoot = process.cwd()

export default () => {
  rimraf.sync(path.join(projectRoot, 'client/dist'))
  rimraf.sync(path.join(projectRoot, 'tmp'))
  rimraf.sync(path.join(projectRoot, 'jsdoc'))
  rimraf.sync(path.join(projectRoot, 'zip'))
}
