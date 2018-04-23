/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:06:03
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 17:33:38
*/
const colors = require('colors')
const leftPad = require('left-pad')
const glob = require('glob')
const path = require('path')
const DecompressZip = require('decompress-zip')
const inquirer = require('inquirer')

const projectRoot = process.cwd()
const cliRoot = path.join(__dirname, '../../')

function makeFile(tpl) {
  let found = glob.sync('@(*|.*)')
  if (found.length) {
    console.log(colors.bgRed(`[task ${leftPad('init', 12)}]`), projectRoot + ' is not empty')
  } else {
    let zipFile = path.join(cliRoot, 'template/' + tpl + '.zip')
    let unzipper = new DecompressZip(zipFile)
    unzipper.on('error', err => {
      console.log(colors.bgRed(`[task ${leftPad('init', 12)}]`), err)
    })
    unzipper.on('extract', () => {
      console.log(colors.bgGreen(`[task ${leftPad('init', 12)}]`), 'done')
    })
    unzipper.extract({
      path: projectRoot
    })
  }
}

module.exports = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'tpl',
        message: '选择项目模板：',
        choices: ['normal(react)', 'vue@1', 'vue@2']
      }
    ])
    .then(answers => {
      makeFile(answers.tpl)
    })
}
