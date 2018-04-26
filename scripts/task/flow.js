/*
* @Author: dengjiayao
* @Date:   2018-04-26 14:15:51
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 15:31:06
*/
const inquirer = require('inquirer')
const taskWebpack = require('./webpack')
const taskPre = require('./pre')
const taskClean = require('./clean')
const taskPack = require('./pack')
const taskDeploy = require('./deploy')
const taskAsset = require('./asset')
const taskImage = require('./image')
const taskBabelAsset = require('./babel-asset')
const taskServeClient = require('./serve-client')
const taskPostcss = require('./postcss')

async function exec(tasks, env) {
  while (tasks.length) {
    let task = tasks.shift()
    await task(env)
  }
}

module.exports = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'flow',
        message: 'Choose a workflow:',
        choices: [
          {
            value: 0,
            name: 'local development (本地开发服务)'
          },
          { value: 1, name: 'build:development (项目编译：测试环境)' },
          { value: 2, name: 'build:experiment (项目编译：预发环境)' },
          { value: 3, name: 'build:production (项目编译：生产环境)' },
          { value: 4, name: 'pack (项目打包)' },
          { value: 5, name: 'deploy to remote server (部署到远程服务器)' },
          { value: 6, name: 'clean (清理)' }
        ]
      }
    ])
    .then(answers => {
      try {
        switch (answers.flow) {
          case 0:
            exec([taskPre, taskAsset, taskBabelAsset, taskImage, taskServeClient], 'development')
            break
          case 1:
            exec(
              [taskPre, taskAsset, taskBabelAsset, taskImage, taskWebpack, taskPostcss],
              'development'
            )
            break
          case 2:
            exec(
              [taskPre, taskAsset, taskBabelAsset, taskImage, taskWebpack, taskPostcss],
              'experiment'
            )
            break
          case 3:
            exec(
              [taskPre, taskAsset, taskBabelAsset, taskImage, taskWebpack, taskPostcss],
              'production'
            )
            break
          case 4:
            exec([taskPack])
            break
          case 5:
            exec([taskUpload])
            break
          case 6:
            exec([taskClean])
            break
          default:
        }
      } catch (err) {
        throw new Error(err)
      }
    })
}
