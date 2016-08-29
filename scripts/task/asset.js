import path from 'path'
import colors from 'colors'
import { ncp } from 'ncp'

var projectRoot = process.cwd()

export default () => {
  ncp(path.join(projectRoot, 'client/asset'), path.join(projectRoot, 'client/dist/static'), (err) => {
    if (err) {
      console.log(colors.bgRed('[task asset]'), err)
    } else {
      console.log(colors.bgGreen('[task asset]'), 'done')
    }
  })
}
