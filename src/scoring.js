// 计分模块 - 计算MBTI类型和维度百分比
import store from './store.js';

// 维度配置
const dimensions = ['EI', 'SN', 'TF', 'JP'];

// 计算单个维度的得分
function calculateDimensionScore(dimension, answers, questionOrder) {
  let leftScore = 0; // 左侧字母得分（E/S/T/J）
  let rightScore = 0; // 右侧字母得分（I/N/F/P）
  let totalWeight = 0;

  questionOrder.forEach(question => {
    if (question.dimension === dimension) {
      const rawAnswer = answers[question.id];
      if (rawAnswer !== undefined && rawAnswer !== null) {
        const answer = question.reverse ? 6 - rawAnswer : rawAnswer;
        const weight = question.weight ?? 1;
        totalWeight += weight;

        // polarity: 1 表示倾向左侧，-1 表示倾向右侧
        if (question.polarity === 1) {
          // 题目倾向左侧，答案越大，左侧得分越高
          leftScore += answer * weight;
        } else {
          // 题目倾向右侧，答案越大，右侧得分越高
          rightScore += answer * weight;
        }
      }
    }
  });

  return { leftScore, rightScore, totalWeight };
}

// 计算维度百分比
function calculateDimensionPercentage(leftScore, rightScore) {
  const total = leftScore + rightScore;
  if (total === 0) {
    return { left: 50, right: 50 };
  }

  const leftPercent = Math.round((leftScore / total) * 100);
  const rightPercent = 100 - leftPercent;

  return { left: leftPercent, right: rightPercent };
}

// 确定维度倾向
function determineDimensionTendency(leftPercent, rightPercent, dimension) {
  const [leftLetter, rightLetter] = dimension.split('');
  return leftPercent >= rightPercent ? leftLetter : rightLetter;
}

// 计算所有维度的结果
export function calculateResults(answers, questionOrder) {
  const results = {};

  dimensions.forEach(dimension => {
    const { leftScore, rightScore, totalWeight } = calculateDimensionScore(dimension, answers, questionOrder);
    const { left, right } = calculateDimensionPercentage(leftScore, rightScore);
    const tendency = determineDimensionTendency(left, right, dimension);

    results[dimension] = {
      leftPercent: left,
      rightPercent: right,
      tendency,
      leftScore,
      rightScore,
      totalWeight
    };
  });

  return results;
}

// 生成MBTI类型字符串
export function generateMBTIType(results) {
  return dimensions.map(dimension => results[dimension].tendency).join('');
}

// 验证是否所有题目都已回答
export function isAllAnswered(answers, questionOrder) {
  return questionOrder.every(question => answers[question.id] !== undefined && answers[question.id] !== null);
}

// 获取已回答题目数量
export function getAnsweredCount(answers, questionOrder) {
  return questionOrder.filter(question => answers[question.id] !== undefined && answers[question.id] !== null).length;
}
