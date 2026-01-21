// 路由模块 - 处理hash路由
class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    const raw = window.location.hash.slice(1);
    const normalized = raw.startsWith('/') ? raw.slice(1) : raw;
    const hash = normalized || 'home';
    const route = this.routes[hash];

    if (route) {
      this.currentRoute = { path: hash, component: route };
      route();
    } else {
      window.location.hash = '/home';
    }
  }

  navigate(path) {
    const target = path.startsWith('/') ? path : `/${path}`;
    window.location.hash = target;
  }
}

export default Router;
