// 测试页模块
import store from '../store.js';
import { likertOptions } from '../questions.js';
import { getAnsweredCount, isAllAnswered } from '../scoring.js';

export function renderTestPage() {
  const app = document.getElementById('app');
  const questionOrder = store.getQuestionOrder();

  if (!questionOrder) {
    window.location.hash = '/home';
    return;
  }

  const currentQuestionIndex = store.getCurrentQuestion();
  const currentQuestion = questionOrder[currentQuestionIndex];

  const totalQuestions = questionOrder.length;
  const answeredCount = getAnsweredCount(store.getProgress()?.answers || {}, questionOrder);
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  app.innerHTML = `
    <div class="page test-page">
      <header class="page-header">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">
          <span>已回答 ${answeredCount}/${totalQuestions} 题</span>
        </div>
      </header>

      <main class="page-main">
        <div class="question-card">
          <div class="question-number">第 ${currentQuestionIndex + 1} 题</div>
          <h2 class="question-text">${currentQuestion.text}</h2>

          <form id="question-form" class="question-form">
            <fieldset class="options-fieldset">
              <legend class="sr-only">选择你的答案</legend>
              ${likertOptions.map(option => `
                <label class="option-label">
                  <input
                    type="radio"
                    name="answer"
                    value="${option.value}"
                    class="option-radio"
                    ${store.getAnswer(currentQuestion.id) === option.value ? 'checked' : ''}
                  >
                  <span class="option-text">${option.label}</span>
                </label>
              `).join('')}
            </fieldset>
          </form>
        </div>
      </main>

      <footer class="page-footer page-footer-actions">
        <button id="prev-btn" class="btn btn-secondary" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
          上一题
        </button>
        <button id="exit-btn" class="btn btn-ghost">
          退出并保存
        </button>
        <button id="next-btn" class="btn btn-primary">
          ${currentQuestionIndex === totalQuestions - 1 ? '查看结果' : '下一题'}
        </button>
      </footer>
    </div>
  `;

  // 绑定事件
  const form = document.getElementById('question-form');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const exitBtn = document.getElementById('exit-btn');

  // 答案选择事件
  const radioInputs = form.querySelectorAll('input[name="answer"]');
  radioInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      store.saveAnswer(currentQuestion.id, parseInt(e.target.value));
      autoAdvance();
    });
  });

  // 上一题
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        store.saveCurrentQuestion(currentQuestionIndex - 1);
        updatePage();
      }
    });
  }

  // 下一题
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // 检查是否已回答
      if (!store.getAnswer(currentQuestion.id)) {
        showToast('请先选择一个答案');
        return;
      }
      goNext();
    });
  }

  // 退出并保存
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      window.location.hash = '/home';
    });
  }
}

function updatePage() {
  renderTestPage();
}

function goNext() {
  const progress = store.getProgress();
  const questionOrder = progress?.questionOrder;
  const answers = progress?.answers || {};
  const currentQuestionIndex = store.getCurrentQuestion();
  const totalQuestions = questionOrder?.length || 0;

  if (!questionOrder || totalQuestions === 0) {
    showToast('进度异常，请重新开始');
    window.location.hash = '/home';
    return;
  }

  if (currentQuestionIndex < totalQuestions - 1) {
    store.saveCurrentQuestion(currentQuestionIndex + 1);
    updatePage();
  } else {
    if (!isAllAnswered(answers, questionOrder)) {
      const firstMissingIndex = questionOrder.findIndex(
        question => answers[question.id] === undefined || answers[question.id] === null
      );
      if (firstMissingIndex >= 0) {
        store.saveCurrentQuestion(firstMissingIndex);
        showToast('还有未完成的题目');
        updatePage();
        return;
      }
    }
    // 显示结果
    window.location.hash = '/result';
  }
}

function autoAdvance() {
  const progress = store.getProgress();
  const questionOrder = progress?.questionOrder;
  const currentQuestionIndex = store.getCurrentQuestion();
  const totalQuestions = questionOrder?.length || 0;

  if (!questionOrder || totalQuestions === 0) {
    return;
  }

  // 给点击反馈留一点时间
  setTimeout(() => {
    if (currentQuestionIndex < totalQuestions) {
      goNext();
    }
  }, 150);
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
