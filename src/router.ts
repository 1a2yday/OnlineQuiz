import type { PageName } from './types';

type RouteHandler = () => void;

const routes: Map<PageName, RouteHandler> = new Map();
let currentPage: PageName = 'home';

export function registerRoute(page: PageName, handler: RouteHandler): void {
  routes.set(page, handler);
}

export function navigateTo(page: PageName): void {
  currentPage = page;
  // 同步更新 hash，支持浏览器前进/后退
  if (window.location.hash !== `#${page}`) {
    window.location.hash = page;
  }
  const handler = routes.get(page);
  if (handler) {
    handler();
    window.scrollTo(0, 0);
  }
}

/** 监听浏览器前进/后退按钮 */
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') as PageName;
  if (hash && routes.has(hash) && hash !== currentPage) {
    currentPage = hash;
    routes.get(hash)!();
    window.scrollTo(0, 0);
  }
});

export function getCurrentPage(): PageName {
  return currentPage;
}