import clone from 'git-clone'
import colors from 'colors'
import glob from 'glob'
import rimraf from 'rimraf'
import path from 'path'

export default () => {
  var found = glob.sync('@(*|.*)')

  if (found.length) {
    console.log(colors.bgRed('[task init]'), 'this folder is not empty')
  } else {
    console.log(colors.bgGreen('[task init]'), 'wait seconds to download the template')
    clone('https://github.com/dnxbf321/npx-template.git', process.cwd(), (err) => {
      if (err) {
        console.log(colors.bgRed('[task init]'), err)
      } else {
        rimraf.sync(path.join(process.cwd(), '.git'))
        console.log(colors.bgGreen('[task init]'), 'done')
      }
    })
  }
}
