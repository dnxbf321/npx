import aCom from './component/a.vue'
import Vue from 'vue'

new Vue({
  el: '#vue',
  components: {
    app: aCom
  }
})

console.log('client = ', client, typeof client)
console.log('client.publicPath = ', client.publicPath)
console.log('debug = ' + debug, typeof debug)
console.log('array1 = ', array1)

let arr = [1, 2, 3]
let copyArr = [...arr]
console.log('test es6 syntax: ', copyArr)

let filed = {
  a: 1,
  b: 2
}
let obj = {
  ...filed
}
console.log('test es6 syntax: ', obj)
