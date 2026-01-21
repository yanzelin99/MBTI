// 结果页模块
import store from '../store.js';
import { calculateResults, generateMBTIType, isAllAnswered } from '../scoring.js';
import { getMBTIResult, dimensionNames } from '../results.js';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

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
        <div class="result-content" id="result-content">
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
        <button id="save-share-btn" class="btn btn-primary">
          保存分享
        </button>
      </footer>
    </div>
  `;

  // 绑定事件
  const restartBtn = document.getElementById('restart-btn');
  const saveShareBtn = document.getElementById('save-share-btn');

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      store.clearProgress();
      window.location.hash = '/home';
    });
  }

  if (saveShareBtn) {
    saveShareBtn.addEventListener('click', () => {
      saveAsImage(mbtiType, resultData.name, dimensionResults);
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

async function saveAsImage(type, name, dimensionResults) {
  showToast('正在生成图片...');

  const resultContent = document.getElementById('result-content');

  try {
    // 生成二维码
    const qrCodeDataUrl = await QRCode.toDataURL('https://mbti.9912.xin', {
      width: 120,
      margin: 1,
      color: {
        dark: '#1d1d1f',
        light: '#ffffff'
      }
    });

    // 创建临时容器用于截图
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 800px;
      background: linear-gradient(135deg, rgba(31, 77, 95, 0.95), rgba(210, 122, 82, 0.95));
      padding: 40px;
      border-radius: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
    `;

    // 克隆结果内容
    const clone = resultContent.cloneNode(true);
    clone.style.cssText = `
      background: rgba(255, 250, 244, 0.95);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 20px;
    `;

    // 添加分享二维码区域
    const shareSection = document.createElement('div');
    shareSection.style.cssText = `
      background: rgba(255, 250, 244, 0.95);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    `;

    shareSection.innerHTML = `
      <div style="flex: 1;">
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1d1d1f;">
          扫码分享给朋友
        </div>
        <div style="font-size: 14px; color: #6e6e73;">
          让他们也来测测自己的 MBTI 性格类型吧！
        </div>
      </div>
      <img src="${qrCodeDataUrl}" alt="分享二维码" style="width: 120px; height: 120px; border-radius: 8px; border: 2px solid #1d1d1f;" />
    `;

    container.appendChild(clone);
    container.appendChild(shareSection);
    document.body.appendChild(container);

    // 使用 html2canvas 生成图片
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false
    });

    // 移除临时容器
    document.body.removeChild(container);

    // 下载图片
    const link = document.createElement('a');
    link.download = `MBTI-${type}-${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('图片已保存！');
  } catch (error) {
    console.error('保存图片失败:', error);
    showToast('保存失败，请重试');
  }
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