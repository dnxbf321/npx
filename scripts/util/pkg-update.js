var updateNotifier = require('update-notifier')
var pkg = require('../../package.json')

module.exports = function() {
  var notifier = updateNotifier({
    pkg: pkg,
    updateCheckInterval: 2 * 1000
  })
  notifier.notify()
}
