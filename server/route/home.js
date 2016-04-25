/**
 * 金贝塔介绍
 */

import KoaRouter from 'koa-router'

export default class RouterHome {

  constructor() {
    this.router = new KoaRouter()
    this.onRoutes()
  }

  onRoutes() {
    this.router
      .get('/', function*() {
        yield this.render('home')
      })
  }

}
