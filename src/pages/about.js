// 关于页模块
export function renderAboutPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page about-page">
      <header class="page-header">
        <h1 class="page-title">关于 MBTI</h1>
      </header>

      <main class="page-main">
        <div class="about-content">
          <details class="about-accordion" open>
            <summary class="section-title">什么是 MBTI？</summary>
            <p class="about-text">
              MBTI（Myers-Briggs Type Indicator）是一种常见的性格评估工具，基于荣格心理学理论。
              它通过四个维度的偏好，组合成 16 种人格类型。
            </p>
          </details>

          <details class="about-accordion">
            <summary class="section-title">四个维度</summary>
            <div class="dimensions-list compact-grid">
              <div class="dimension-item">
                <h3 class="dimension-title">外向 (E) vs 内向 (I)</h3>
                <p class="dimension-desc">
                  能量来源与社交偏好。
                </p>
              </div>

              <div class="dimension-item">
                <h3 class="dimension-title">实感 (S) vs 直觉 (N)</h3>
                <p class="dimension-desc">
                  关注现实细节或未来可能。
                </p>
              </div>

              <div class="dimension-item">
                <h3 class="dimension-title">思考 (T) vs 情感 (F)</h3>
                <p class="dimension-desc">
                  决策更偏逻辑或价值取向。
                </p>
              </div>

              <div class="dimension-item">
                <h3 class="dimension-title">判断 (J) vs 感知 (P)</h3>
                <p class="dimension-desc">
                  计划结构或灵活开放。
                </p>
              </div>
            </div>
          </details>

          <details class="about-accordion">
            <summary class="section-title">免责声明</summary>
            <div class="disclaimer-box">
              <p class="disclaimer-text">本测试仅供娱乐与自我探索参考，不能替代专业评估。</p>
              <p class="disclaimer-text">请勿将测试结果用于医疗诊断、雇佣决策或其他重要决策。</p>
              <p class="disclaimer-text">人格是复杂且多面的，结果仅供理解自己的一种视角。</p>
            </div>
          </details>

          <details class="about-accordion">
            <summary class="section-title">常见问题</summary>
            <div class="faq-list">
              <div class="faq-item">
                <h3 class="faq-question">为什么我的测试结果会变化？</h3>
                <p class="faq-answer">
                  性格会随经历和环境变化，不同阶段出现不同结果很正常。
                </p>
              </div>

              <div class="faq-item">
                <h3 class="faq-question">如何正确看待测试结果？</h3>
                <p class="faq-answer">
                  把它当作理解自己的起点，而不是限制自己的标签。
                </p>
              </div>

              <div class="faq-item">
                <h3 class="faq-question">MBTI 有科学依据吗？</h3>
                <p class="faq-answer">
                  MBTI 在学界存在争议，建议作为自我探索工具使用。
                </p>
              </div>
            </div>
          </details>
        </div>
      </main>

      <footer class="page-footer">
        <button id="back-btn" class="btn btn-secondary">返回首页</button>
      </footer>
    </div>
  `;

  // 绑定事件
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.hash = '/home';
    });
  }
}
