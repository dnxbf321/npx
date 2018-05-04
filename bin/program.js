#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const pkgUpdate = require('../scripts/util/pkg-update')
const taskCreate = require('../scripts/task/create')
const taskClean = require('../scripts/task/clean')
const taskPack = require('../scripts/task/pack')
const taskDeploy = require('../scripts/task/deploy')
const taskFlow = require('../scripts/task/flow')
const colors = require('colors')

console.log(
  colors.bgYellow.bold(
    '\n\ndeng-npx 已转移至 krau，后续更新将只发生在 krau（https://www.npmjs.com/package/krau）\n'
  )
)

pkgUpdate()

program.version(pkg.version)

// 新建项目
// 项目命名，生成模板文件
program
  .command('create')
  .description('create project')
  .action(() => {
    taskCreate()
  })

program
  .command('flow')
  .description('take workflow')
  .action(() => {
    taskFlow()
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
  .description('pack files')
  .action(() => {
    taskPack()
  })

// upload 任务
program
  .command('deploy')
  .description('deploy to remote server')
  .action(() => {
    taskDeploy()
  })

program.parse(process.argv)
