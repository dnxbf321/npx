# node project template

node 项目模板。技术采用 koa 作为 server 端框架，用 webpack 打包 js，imagemin 压缩处理图片，postcss 编译样式文件。client 端、node 端均可直接使用 ECMAScript 6 语法，转换过程就交给 Babel 自动完成吧。

# 安装
```bash
git clone https://github.com/dnxbf321/node-project-template.git
```

## 使用
```bash
# 查看帮助
npm run help

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

# 打包项目文件
npm run pack

# 部署代码到服务器
npm run upload

```

## 编译路径

源路径                               | 目的地                      | 中间过程
----------------------------------- | -------------------------- | ---------------------
client/asset                        | client/dist/static         | 拷贝
client/static/css/\*\*/[^_]\*.css   | client/dist/static/css     | postcss 编译，配置见 scripts/conf/postcss.json
client/static/js/\*\*/\*.wp.js      | client/dist/static/js      | webpack 打包，配置见 scripts/conf/webpack\*.js
client/static/img/\*\*/\*           | client/dist/static/img     | 开发环境拷贝，正式环境拷贝并压缩

## 访问静态资源

执行 `npm run dev` 时，js、css 并不会输出到 dist 目录，通过以下形式路径访问
```
// 8080 端口号在 /config.json 中 client.port 配置

// main.js 原文件为 client/static/js/main.wp.js
http://127.0.0.1:8080/static/js/main.js

// style.css 原文件为 client/static/css/style.css
http://127.0.0.1:8080/static/css/style.css
```

## 配置不同环境下的变量

修改 [config.json](https://github.com/dnxbf321/node-project-template/blob/master/config.json) 文件，将配置分别填入 experiment、production 中，没有声明的项使用 default 项


# 如何升级我的项目

step 1: 查看日志

step 2: 下载。下载此项目文件到你的电脑

step 3: 覆盖。使用新的文件覆盖 scripts 文件夹

step 4: 合并。合并其他根目录下的文件及 [server/config.js](https://github.com/dnxbf321/node-project-template/blob/master/server/config.js), [server/server.js](https://github.com/dnxbf321/node-project-template/blob/master/server/server.js)

# 纯静态项目 html 怎么处理

1. v1.4.3 版本以上版本支持 .html .hbs（handlebars模板文件）文件的处理。

2. [client/static/html](https://github.com/dnxbf321/node-project-template/blob/master/client/static/html) 为 .html .hbs 文件的存储目录

3. handlebars 的 helper 应放置在 [client/static/js/hbs-helper](https://github.com/dnxbf321/node-project-template/blob/master/client/static/js/hbs-helper) 中

4. 通过 `{{config 'key1.key1-2'}}` 将 config 中定义的变量输出到 html 中。如：`{{config 'client.port'}}` 得到 `8080`

使用方法可参考 [client/static/html/hbs-test.hbs](https://github.com/dnxbf321/node-project-template/blob/master/client/static/html/hbs-test.html)

## change log

### v1.4.3
- 支持纯静态项目 html 的处理

### v1.4.2
- 支持 vue
- webpack output.publicPath 使用 http 绝对路径
- js 中引入的 css 文件将输出到独立文件，与该 entry js 同名同目录，所以在 html 引入时，引用路径是 `{{global.staticRoot}}/js/[filename].css`

### v1.4.0

- 目录结构调整，npm scripts 更新。此处改动很大，请睁大眼睛对比目录变动。为什么要这么做？之后的升级将轻便，只需要将 scripts 文件夹替换，merge package.json、config.json 即可

### v1.3.0

- 增加代码上传到服务器的功能，需先配置 config.json

### v1.2.0

- postcss 代替 node-sass，client/static/\*\*/\*.scss 需重命名为 \*.css。注意：`import 'other'`，_other.css 必须是带 `_` 前缀的

### v1.1.0

- 支持环境变量
- 打包新增全部文件打包

### v1.0.1

- 添加打包功能，`npm run pack`，client/dist 目录将打包成 static.zip，其他目录（除 node_modules、log、client）将打包在 server.zip

### v1.0.0

- scss 自动编译成 css 文件并执行 autoprefixer，文件名以 _ 开头不会进行编译；开发阶段，无需预编译 scss 文件，程序将在请求时输出编译的文本
- 图片自动优化压缩；开发阶段，图片只复制到 dist 目录
- js 支持 ecmascript 6 语法，支持 sourcemap，支持 uglify；开发阶段，js 将编译到内存中，并不会生成真实可见的文件
- 如果你有其他类型的文件，放在 [client/asset](https://github.com/dnxbf321/node-project-template/blob/master/client/asset) 目录中，编译时将原封不懂的复制到 dist 目录且保留文件夹结构
- 完整的 koa 后台服务示例
