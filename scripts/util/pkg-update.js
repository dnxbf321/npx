const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

module.exports = () => {
  let notifier = updateNotifier({
    pkg: pkg,
    updateCheckInterval: 2 * 1000
  })
  notifier.notify()
}
