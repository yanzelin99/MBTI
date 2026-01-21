// 首页模块
import store from '../store.js';
import { getQuestionOrder } from '../questions.js';

export function renderHomePage() {
  const app = document.getElementById('app');
  const hasUnfinished = store.hasUnfinishedTest();

  app.innerHTML = `
    <div class="page home-page">
      <header class="page-header">
        <h1 class="page-title">MBTI 性格测试</h1>
        <p class="page-subtitle">探索你的真实性格类型</p>
      </header>

      <main class="page-main">
        <div class="home-content">
          <div class="hero-section">
            <h2 class="hero-title">了解你自己</h2>
            <p class="hero-description">
              通过 60 道精心设计的题目，探索你的性格类型，发现你的优势、盲点和成长建议。
            </p>
          </div>

          <div class="info-section">
            <div class="info-item">
              <span class="info-text">预计用时 5-8 分钟</span>
            </div>
            <div class="info-item">
              <span class="info-text">基于经典的 MBTI 理论</span>
            </div>
            <div class="info-item">
              <span class="info-text">获得详细的性格分析报告</span>
            </div>
          </div>

          <div class="action-section">
            ${hasUnfinished ? `
              <button id="continue-btn" class="btn btn-primary btn-large">
                继续上次测试
              </button>
              <button id="restart-btn" class="btn btn-secondary">
                重新开始
              </button>
            ` : `
              <button id="start-btn" class="btn btn-primary btn-large">
                开始测试
              </button>
            `}
          </div>
        </div>
      </main>

      <footer class="page-footer">
        <p>本测试仅供娱乐与自我探索，不用于医疗诊断或雇佣决策</p>
        <button id="about-btn" class="link-btn">了解 MBTI</button>
      </footer>
    </div>
  `;

  // 绑定事件
  const startBtn = document.getElementById('start-btn');
  const continueBtn = document.getElementById('continue-btn');
  const restartBtn = document.getElementById('restart-btn');
  const aboutBtn = document.getElementById('about-btn');

  if (startBtn) {
    startBtn.addEventListener('click', startTest);
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      window.location.hash = '/test';
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', startTest);
  }

  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      window.location.hash = '/about';
    });
  }
}

function startTest() {
  // 清除之前的进度
  store.clearProgress();

  // 生成题目顺序
  const questionOrder = getQuestionOrder();
  store.saveQuestionOrder(questionOrder);
  store.saveCurrentQuestion(0);

  // 跳转到测试页
  window.location.hash = '/test';
}
