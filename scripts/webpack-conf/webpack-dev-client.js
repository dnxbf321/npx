/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:22:01
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:45:37
*/
require('eventsource-polyfill')
const hotClient = require('webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=true&reload=true')

hotClient.subscribe(event => {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
