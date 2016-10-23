import path from 'path'
import colors from 'colors'
import leftPad from 'left-pad'
import { ncp } from 'ncp'

var projectRoot = process.cwd()

export default () => {
  return new Promise((resolve, reject) => {
    ncp(path.join(projectRoot, 'client/asset'), path.join(projectRoot, 'client/dist/static'), (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('asset', 12)}]`), err)
        reject()
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('asset', 12)}]`), 'done')
        resolve()
      }
    })
  })
}
