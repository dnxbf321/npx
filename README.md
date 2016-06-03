# node project template

node 项目模板。技术采用 koa 作为 server 端框架，用 webpack 打包 js，imagemin 压缩处理图片，postcss 编译样式文件。client 端、node 端均可直接使用 ECMAScript 6 语法，转换过程就交给 Babel 自动完成吧。

## 使用
```
# 开发环境运行项目
npm run dev

# 编译生产环境文件
npm run build

# 编译预发环境文件
npm run build-exp

# 生产环境启动服务
npm run serve

# 预发环境启动服务
npm run serve-exp
```

## 编译路径
```
./client/asset 复制到 ./client/dist/static
./client/static/css/**/[^_]*.scss 通过 sass、autoprefixer 编译到 ./client/dist/static/css
./client/static/js/**/*.wp.js 通过 webpack 打包到 ./client/dist/static/js
./client/static/img/* 通过 imagemin 压缩打包到 ./client/dist/static/img
```

## 访问静态资源

执行 `npm run dev` 时，js、css 并不会输出到 dist 目录，通过以下路径获得
```
// 8080 端口号在 /config.json 中 client.port 配置
// main.js 原文件名为 main.wp.js
http://127.0.0.1:8080/static/js/main.js
http://127.0.0.1:8080/static/css/style.css
```

## 配置不同环境下的变量

修改 config.json 文件，将配置分别填入 experiment、production 中，没有声明的项使用默认配置

## change log

### v1.1.0

- 支持环境变量
- 打包新增全部文件打包

### v1.0.1

- 添加打包功能，`npm run pack`，client/dist 目录将打包成 static.zip，其他目录（除 node_modules、log、client）将打包在 server.zip

### v1.0.0

- scss 自动编译成 css 文件并执行 autoprefixer，文件名以 _ 开头不会进行编译；开发阶段，无需预编译 scss 文件，程序将在请求时输出编译的文本
- 图片自动优化压缩；开发阶段，图片只复制到 dist 目录
- js 支持 ecmascript 6 语法，支持 sourcemap，支持 uglify；开发阶段，js 将编译到内存中，并不会生成真实可见的文件
- 如果你有其他类型的文件，放在 client/asset 目录中，编译时将原封不懂的复制到 dist 目录且保留文件夹结构
- 完整的 koa 后台服务示例
