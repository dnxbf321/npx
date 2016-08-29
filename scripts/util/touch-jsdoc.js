import path from 'path'
import fs from 'fs'
import colors from 'colors'
import { ncp } from 'ncp'

var cliRoot = path.join(__dirname, '../../')
var projectRoot = process.cwd()

export default () => {
  try {
    fs.accessSync(path.join(projectRoot, '.jsdoc.json'))
  } catch ( e ) {
    console.log(colors.bgGreen('[task pre]'), '.jsdoc.json can not access, ncp one copy from npx')
    ncp(path.join(cliRoot, '.jsdoc.json'), path.join(projectRoot, '.jsdoc.json'))
  }
}
