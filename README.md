# npm script template

npm script 模板，使用 webpack 打包 js，imagemin 压缩处理图片，sass 编译样式文件。使用 koa 作为 server 端框架。

## 使用
```
# 开发环境运行项目
npm run dev

# 编译生产环境文件
npm run prod

# 生产环境启动服务
npm run serve
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
