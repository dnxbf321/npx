/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:03:13
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:43:30
*/
const getConfig = require('../util/config')

module.exports = key => {
  var keyChain = key.split('.')
  var v = getConfig()

  for (let i = 0, len = keyChain.length; i < len; i++) {
    v = v[keyChain[i]]
  }
  return v
}
