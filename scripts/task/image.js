import path from 'path'
import colors from 'colors'
import { ncp } from 'ncp'
import mkdirp from 'mkdirp'

const projectRoot = process.cwd()
const ncpImage = () => {
  ncp(path.join(projectRoot, 'client/static/img'), path.join(projectRoot, 'client/dist/static/img'), (err) => {
    if (err) {
      console.log(colors.bgRed('[task image]'), err)
    } else {
      console.log(colors.bgGreen('[task image]'), 'done')
    }
  })
}

export default () => {
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'))
  ncpImage()
}
