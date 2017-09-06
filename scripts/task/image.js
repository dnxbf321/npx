import path from 'path'
import { ncp } from 'ncp'
import mkdirp from 'mkdirp'
import colors from 'colors'
import leftPad from 'left-pad'

const projectRoot = process.cwd()

export default () => {
  mkdirp.sync(path.join(projectRoot, 'client/dist/static/img'))
  return new Promise((resolve, reject) => {
    ncp(path.join(projectRoot, 'client/static/img'), path.join(projectRoot, 'client/dist/static/img'), (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('image', 12)}]`), err)
        reject(err)
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('image', 12)}]`), 'done')
        resolve()
      }
    })
  })
}
