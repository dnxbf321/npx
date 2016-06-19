var colors = require('colors')

console.log(colors.green.bold('你可以使用如下的scripts，使用方法：\`npm run [scriptName]\`'))

console.log(`
dev         启动静态资源服务&后台。
            如果不需要后台，请将\`scripts.dev\`改成
            \`npm-run-all pre --parallel asset image serve-client\`

build-dev   编译静态文件，process.env.NODE_NEV=development
build-exp   编译静态文件，process.env.NODE_NEV=experiment
build       编译静态文件，process.env.NODE_NEV=production

serve-dev   启动后台服务，process.env.NODE_NEV=development
serve-exp   启动后台服务，process.env.NODE_NEV=experiment
serve       启动后台服务，process.env.NODE_NEV=production

pack        打包项目。注：请先运行\`npm run build\`

upload      scp文件到服务器。可能你的服务器需要重启

clean       删除编译的静态文件&打包文件

`)