// 状态管理模块 - localStorage封装
class Store {
  constructor() {
    this.STORAGE_KEY = 'mbti_test_progress';
  }

  // 保存测试进度
  saveProgress(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('保存进度失败:', error);
    }
  }

  // 获取测试进度
  getProgress() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('读取进度失败:', error);
      return null;
    }
  }

  // 清除测试进度
  clearProgress() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('清除进度失败:', error);
    }
  }

  // 保存答案
  saveAnswer(questionId, answer) {
    const progress = this.getProgress() || {};
    if (!progress.answers) {
      progress.answers = {};
    }
    progress.answers[questionId] = answer;
    this.saveProgress(progress);
  }

  // 获取答案
  getAnswer(questionId) {
    const progress = this.getProgress();
    return progress?.answers?.[questionId] || null;
  }

  // 保存当前题号
  saveCurrentQuestion(index) {
    const progress = this.getProgress() || {};
    progress.currentQuestion = index;
    this.saveProgress(progress);
  }

  // 获取当前题号
  getCurrentQuestion() {
    const progress = this.getProgress();
    return progress?.currentQuestion || 0;
  }

  // 保存题目顺序
  saveQuestionOrder(order) {
    const progress = this.getProgress() || {};
    progress.questionOrder = order;
    this.saveProgress(progress);
  }

  // 获取题目顺序
  getQuestionOrder() {
    const progress = this.getProgress();
    return progress?.questionOrder || null;
  }

  // 检查是否有未完成的测试
  hasUnfinishedTest() {
    const progress = this.getProgress();
    if (!progress?.answers || !progress?.questionOrder) {
      return false;
    }
    const answeredCount = Object.values(progress.answers)
      .filter(value => value !== undefined && value !== null).length;
    return answeredCount < progress.questionOrder.length;
  }
}

export default new Store();
