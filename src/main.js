// 主入口文件
import Router from './router.js';
import { renderHomePage } from './pages/home.js';
import { renderTestPage } from './pages/test.js';
import { renderResultPage } from './pages/result.js';
import { renderAboutPage } from './pages/about.js';

// 定义路由
const routes = {
  'home': renderHomePage,
  'test': renderTestPage,
  'result': renderResultPage,
  'about': renderAboutPage
};

// 初始化路由
const router = new Router(routes);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('MBTI 性格测试网站已启动');
  console.log('当前路由:', router.currentRoute?.path || 'home');
});