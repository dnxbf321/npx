require('eventsource-polyfill')

// path = 'http://127.0.0.1:' + config['default'].client.port
// 因为 require 不支持变量，此处需要手动需改
var hotClient = require('webpack-hot-middleware/client?path=http://127.0.0.1:9000/__webpack_hmr&noInfo=true&reload=true')

hotClient.subscribe(function(event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
