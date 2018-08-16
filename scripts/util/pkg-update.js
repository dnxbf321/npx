/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:14:12
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-02-08 17:45:03
*/
const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

module.exports = () => {
  let notifier = updateNotifier({
    pkg: pkg,
    updateCheckInterval: 2 * 1000
  })
  notifier.notify()
}
