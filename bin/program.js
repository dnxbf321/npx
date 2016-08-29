import program from 'commander'
import pkg from '../package.json'
import pkgUpdate from '../scripts/util/pkg-update'
import taskInit from '../scripts/task/init'
import taskWebpack from '../scripts/task/webpack'
import taskPre from '../scripts/task/pre'
import taskClean from '../scripts/task/clean'
import taskPack from '../scripts/task/pack'
import taskUpload from '../scripts/task/upload'
import taskAsset from '../scripts/task/asset'
import taskImage from '../scripts/task/image'
import taskBabelAsset from '../scripts/task/babel-asset'
import taskServeClient from '../scripts/task/serve-client'
import taskPostcss from '../scripts/task/postcss'

pkgUpdate()

program.version(pkg.version)

// 初始化任务
// 将官方模板下载到本目录
program
  .command('init')
  .action(() => {
    taskInit()
  })

// webpack 任务
// 根据环境定义取不同的 config 值
program
  .command('webpack')
  .description('webpack files')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskWebpack(options['node_env'])
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
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskBabelAsset(options['node_env'])
  })

// serve-client 任务，启动静态资源服务器
// 根据环境定义取不同的 config 值
program
  .command('serve-client')
  .description('serve static files')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskServeClient(options['node_env'])
  })

// postcss 任务
// 根据环境定义取不同的 config 值
program
  .command('postcss')
  .description('compile sass-like stylesheet files')
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')
  .action((options) => {
    taskPostcss(options['node_env'])
  })

program.parse(process.argv)
