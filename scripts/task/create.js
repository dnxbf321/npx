/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:06:03
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 10:51:15
*/
const colors = require('colors')
const leftPad = require('left-pad')
const DecompressZip = require('decompress-zip')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')

const npxRoot = path.join(__dirname, '../../')

function createProjectFolder(projectRoot) {
  if (fs.existsSync(projectRoot)) {
    let stats = fs.statSync(projectRoot)
    if (stats.isDirectory()) {
      throw new Error(`${projectRoot} is already exists`)
    }
  }
  mkdirp.sync(projectRoot, {})
}

function makeFile(tpl, projectRoot) {
  let zipFile = path.join(npxRoot, 'template/' + tpl + '.zip')
  let unzipper = new DecompressZip(zipFile)
  unzipper.on('error', err => {
    throw new Error(err)
  })
  unzipper.on('extract', () => {
    console.log(colors.bgGreen(`[task ${leftPad('create', 12)}]`), 'done')
  })
  unzipper.extract({
    path: projectRoot
  })
}

/**
 * 新建项目
 *  step 1: 命名
 *  step 2: 选取模板
 */
module.exports = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'pkg',
        message: 'Name the project:'
      },
      {
        type: 'list',
        name: 'tpl',
        message: 'Choose a template:',
        choices: [
          {
            name: 'normal (compatible with react.js)',
            value: 'normal(react)'
          },
          { name: 'vue@2.x', value: 'vue@2' }
        ]
      }
    ])
    .then(answers => {
      const projectRoot = path.join(process.cwd(), answers.pkg)
      try {
        createProjectFolder(projectRoot)
        makeFile(answers.tpl, projectRoot)
      } catch (err) {
        console.log(colors.bgRed(`[task ${leftPad('create', 12)}]`), err)
      }
    })
}
