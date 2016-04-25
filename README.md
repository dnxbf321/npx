# npm script template

npm script 模板，使用 webpack 打包 js，imagemin 压缩处理图片，sass 编译样式文件

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
./client/asset -> ./client/dist/static
./client/static -> ./client/dist/static
```

## 静态资源
```
./client/dist
```

## 其他

`npm run dev`，js 资源通过 8080 端口获取，可修改 `./client/build/dev-server.js` 更改端口号
