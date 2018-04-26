#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const pkgUpdate = require('../scripts/util/pkg-update')
const taskCreate = require('../scripts/task/create')
const taskWebpack = require('../scripts/task/webpack')
const taskPre = require('../scripts/task/pre')
const taskClean = require('../scripts/task/clean')
const taskPack = require('../scripts/task/pack')
const taskUpload = require('../scripts/task/upload')
const taskAsset = require('../scripts/task/asset')
const taskImage = require('../scripts/task/image')
const taskBabelAsset = require('../scripts/task/babel-asset')
const taskServeClient = require('../scripts/task/serve-client')
const taskPostcss = require('../scripts/task/postcss')

pkgUpdate()

function list(val) {
  return val.split(',')
}

function keyMapTask(key) {
  switch (key) {
    case 'create':
      return taskCreate
    case 'pre':
      return taskPre
    case 'webpack':
      return taskWebpack
    case 'clean':
      return taskClean
    case 'upload':
      return taskClean
    case 'pack':
      return taskPack
    case 'asset':
      return taskAsset
    case 'image':
      return taskImage
    case 'babel-asset':
      return taskBabelAsset
    case 'serve-client':
      return taskServeClient
    case 'postcss':
      return taskPostcss
    default:
  }
}

program.version(pkg.version)

// 新建项目
// 项目命名，生成模板文件
program.command('create').action(() => {
  taskCreate()
})

// webpack 任务
// 根据环境定义取不同的 config 值
program
  .command('webpack')
  .description('webpack files')
  .action(() => {
    taskWebpack(program['node_env'])
  })

// pre 任务
program
  .command('pre')
  .description('remove tmp folders, make dist folders')
  .action(() => {
    taskPre()
  })

// clean 任务
program
  .command('clean')
  .description('remove all tmp folders')
  .action(() => {
    taskClean()
  })

// pack 任务
program
  .command('pack')
  .description('pack dist files')
  .action(() => {
    taskPack()
  })

// upload 任务
program
  .command('upload')
  .description('upload dist files to remote server')
  .action(() => {
    taskUpload()
  })

// 拷贝 asset 任务
program
  .command('asset')
  .description('ncp asset to dist')
  .action(() => {
    taskAsset()
  })

// image 任务
program
  .command('image')
  .description('ncp image to dist')
  .action(() => {
    taskImage()
  })

// babel-asset 任务，将 client/asset 中 *.bl.js 文件通过 babel 进行转换
// 根据环境定义取不同的 config 值
program
  .command('babel-asset')
  .description('use babel to compile js files those end with .bl.js in asset folder')
  .action(() => {
    taskBabelAsset(program['node_env'])
  })

// serve-client 任务，启动静态资源服务器
// 根据环境定义取不同的 config 值
program
  .command('serve-client')
  .description('serve static files')
  .action(() => {
    taskServeClient(program['node_env'])
  })

// postcss 任务
// 根据环境定义取不同的 config 值
program
  .command('postcss')
  .description('compile sass-like stylesheet files')
  .action(() => {
    taskPostcss(program['node_env'])
  })

program
  .option('-t, --tasks <items>', 'list tasks to exec', list)
  .option(
    '-e, --node_env [env]',
    'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"'
  )
  .option(
    '--filter [filter]',
    'filter webpack entry, an array of path string those files end with *.wp.js'
  )

program.parse(process.argv)

if (program.tasks) {
  let taskChain = program.tasks
  let env = program['node_env']
  let filter = program['filter']
  let idx = 0
  let exec = async () => {
    try {
      await keyMapTask(taskChain[idx])(env, filter)
      idx += 1
      if (idx < taskChain.length) {
        exec()
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  exec()
}
