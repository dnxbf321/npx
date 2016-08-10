#!/usr/bin/env node --harmony

var commander = require('commander')

var pkgUpdate = require('../scripts/util/pkg-update')
var taskWebpack = require('../scripts/task/webpack')
var taskPre = require('../scripts/task/pre')
var taskClean = require('../scripts/task/clean')
var taskPack = require('../scripts/task/pack')
var taskUpload = require('../scripts/task/upload')
var taskAsset = require('../scripts/task/asset')
var taskImage = require('../scripts/task/image')
var taskBabelAsset = require('../scripts/task/babel-asset')
var taskServeClient = require('../scripts/task/serve-client')
var taskPostcss = require('../scripts/task/postcss')

pkgUpdate()

// webpack 任务
// 根据环境定义取不同的 config 值
commander
  .command('webpack')
  .description('webpack files')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskWebpack(options['node_env'])
  })

// pre 任务
commander
  .command('pre')
  .description('remove tmp folders, make dist folders')
  .action(() => {
    taskPre()
  })

// clean 任务
commander
  .command('clean')
  .description('remove all tmp folders')
  .action(() => {
    taskClean()
  })

// pack 任务
commander
  .command('pack')
  .description('pack dist files')
  .action(() => {
    taskPack()
  })

// upload 任务
commander
  .command('upload')
  .description('upload dist files to remote server')
  .action(() => {
    taskUpload()
  })

// 拷贝 asset 任务
commander
  .command('asset')
  .description('ncp asset to dist')
  .action(() => {
    taskAsset()
  })

// image 任务
commander
  .command('image')
  .description('ncp image to dist')
  .action(() => {
    taskImage()
  })

// babel-asset 任务，将 client/asset 中 *.bl.js 文件通过 babel 进行转换
// 根据环境定义取不同的 config 值
commander
  .command('babel-asset')
  .description('use babel to compile js files those end with .bl.js in asset folder')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskBabelAsset(options['node_env'])
  })

// serve-client 任务，启动静态资源服务器
// 根据环境定义取不同的 config 值
commander
  .command('serve-client')
  .description('serve static files')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskServeClient(options['node_env'])
  })

// postcss 任务
// 根据环境定义取不同的 config 值
commander
  .command('postcss')
  .description('compile sass-like stylesheet files')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskPostcss(options['node_env'])
  })

commander.parse(process.argv)
