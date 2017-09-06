import updateNotifier from 'update-notifier'
import pkg from '../../package.json'

export default () => {
  var notifier = updateNotifier({
    pkg: pkg,
    updateCheckInterval: 2 * 1000
  })
  notifier.notify()
}
