export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  const selected = Object.values(byType).flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}

export function generateDistractors(correct, min = 0, max = 100, count = 3) {
  const distractors = new Set();
  let attempts = 0;
  while (distractors.size < count && attempts < 80) {
    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.ceil(Math.random() * 5));
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct) distractors.add(d);
    attempts++;
  }
  [correct - 2, correct + 2, correct + 5, correct - 3, correct + 3].forEach(d => {
    if (d >= min && d <= max && d !== correct && distractors.size < count)
      distractors.add(d);
  });
  return shuffleArray([correct, ...distractors]);
}
