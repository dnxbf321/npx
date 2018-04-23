import React from 'react'
import ReactDom from 'react-dom'
import App from './app.jsx'

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

ReactDom.render(<App />, document.querySelector('#react-app'))
