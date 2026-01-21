// 结果页模块
import store from '../store.js';
import { calculateResults, generateMBTIType, isAllAnswered } from '../scoring.js';
import { getMBTIResult, dimensionNames } from '../results.js';

export function renderResultPage() {
  const app = document.getElementById('app');
  const progress = store.getProgress();

  if (!progress) {
    window.location.hash = '/home';
    return;
  }

  const { answers, questionOrder } = progress;

  // 检查是否所有题目都已回答
  if (!isAllAnswered(answers, questionOrder)) {
    window.location.hash = '/test';
    return;
  }

  // 计算结果
  const dimensionResults = calculateResults(answers, questionOrder);
  const mbtiType = generateMBTIType(dimensionResults);
  const resultData = getMBTIResult(mbtiType);

  app.innerHTML = `
    <div class="page result-page">
      <header class="page-header">
        <h1 class="page-title">测试结果</h1>
      </header>

      <main class="page-main">
        <div class="result-content">
          <!-- MBTI 类型展示 -->
          <div class="type-section">
            <div class="type-badge">${mbtiType}</div>
            <h2 class="type-name">${resultData.name}</h2>
            <p class="type-description">${resultData.description}</p>
          </div>

          <!-- 维度百分比 -->
          <div class="dimensions-section">
            <h3 class="section-title">性格维度分析</h3>
            ${renderDimensionBars(dimensionResults)}
          </div>

          <!-- 详细分析 -->
          <div class="analysis-section">
            <div class="analysis-card">
              <h3 class="analysis-title">优势</h3>
              <ul class="analysis-list">
                ${resultData.strengths.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>

            <div class="analysis-card">
              <h3 class="analysis-title">盲点</h3>
              <ul class="analysis-list">
                ${resultData.weaknesses.map(w => `<li>${w}</li>`).join('')}
              </ul>
            </div>

            <div class="analysis-card">
              <h3 class="analysis-title">建议</h3>
              <ul class="analysis-list">
                ${resultData.suggestions.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer class="page-footer page-footer-actions">
        <button id="restart-btn" class="btn btn-secondary">
          重新测试
        </button>
        <button id="share-btn" class="btn btn-primary">
          复制分享文案
        </button>
      </footer>
    </div>
  `;

  // 绑定事件
  const restartBtn = document.getElementById('restart-btn');
  const shareBtn = document.getElementById('share-btn');

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      store.clearProgress();
      window.location.hash = '/home';
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      shareResult(mbtiType, resultData.name, dimensionResults);
    });
  }
}

function renderDimensionBars(dimensionResults) {
  return Object.entries(dimensionResults).map(([dimension, result]) => {
    const names = dimensionNames[dimension];
    const isLeft = result.tendency === dimension[0];
    const tendencyLabel = isLeft ? names.left : names.right;
    const tendencyDesc = isLeft ? names.leftDesc : names.rightDesc;
    return `
      <div class="dimension-bar">
        <div class="dimension-labels">
          <span class="dimension-label-left">${names.left}</span>
          <span class="dimension-label-right">${names.right}</span>
        </div>
        <div class="bar-container">
          <div class="bar-fill bar-left" style="width: ${result.leftPercent}%"></div>
          <div class="bar-fill bar-right" style="width: ${result.rightPercent}%"></div>
        </div>
        <div class="dimension-percentages">
          <span class="percentage-left">${result.leftPercent}%</span>
          <span class="percentage-right">${result.rightPercent}%</span>
        </div>
        <div class="dimension-desc">倾向：${tendencyLabel} — ${tendencyDesc}</div>
      </div>
    `;
  }).join('');
}

function shareResult(type, name, dimensionResults) {
  const shareText = `🧠 我的 MBTI 性格类型是：${type} - ${name}\n\n` +
    `维度分析：\n` +
    `E/I: ${dimensionResults.EI.leftPercent}% / ${dimensionResults.EI.rightPercent}%\n` +
    `S/N: ${dimensionResults.SN.leftPercent}% / ${dimensionResults.SN.rightPercent}%\n` +
    `T/F: ${dimensionResults.TF.leftPercent}% / ${dimensionResults.TF.rightPercent}%\n` +
    `J/P: ${dimensionResults.JP.leftPercent}% / ${dimensionResults.JP.rightPercent}%\n\n` +
    `快来测测你的性格类型吧！`;

  navigator.clipboard.writeText(shareText).then(() => {
    showToast('分享文案已复制到剪贴板');
  }).catch(() => {
    showToast('复制失败，请手动复制');
  });
}

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
