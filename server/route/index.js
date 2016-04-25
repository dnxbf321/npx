import KoaRouter from 'koa-router'
import RouterHome from './home'

class AppRouter {

  constructor() {
    this.router = new KoaRouter()
    this.routerHome = new RouterHome()
    this.onRoutes()
    this.use()
  }

  onRoutes() {
  }

  use() {
    this.router.use(
      this.routerHome.router.routes()
    )
  }

}

export default () => {
  let appRouter = new AppRouter()
  return appRouter.router
}
