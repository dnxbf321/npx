# npx

npx 是一个集成 ECMAScript 6、webpack、vue、postcss、imagemin、koa、scp、handlebars 等技术于一体的构建前端项目的工具，提供了一套较为完整的打包流程。

通过编写 npm scripts 将 npx 与项目结合在一起，开发测试将变得十分简便。

# [使用指南 Document](https://dnxbf321.gitbooks.io/node-project-template/content/)

## change log

### v3.0.0
- 提供 cli

### v2.0.0
- 功能已很完善
- 优化 webpack 配置，提高 build 性能
- 版本号将不需要手动更新，每次 build 都是新版本

### v1.4.4
- 增加 css 代码风格检查，参见 [css rules](https://github.com/stylelint/stylelint-config-standard#suggested-additions)

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
