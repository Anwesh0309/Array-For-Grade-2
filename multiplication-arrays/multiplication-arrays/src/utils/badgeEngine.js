export const BADGES = [
  {
    id: 'array_beginner',
    label: '🏅 Array Beginner',
    description: 'Complete Wonder & Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'row_builder',
    label: '🥈 Row Builder',
    description: 'Complete all 3 simulation stations',
    condition: (s) => s.simStationsComplete && s.simStationsComplete.every(Boolean),
  },
  {
    id: 'array_master',
    label: '🥇 Array Master',
    description: 'Score 80%+ on Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_array',
    label: '💎 Perfect Array',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_legend',
    label: '🔥 Streak Legend',
    description: 'Achieve a 10-answer streak',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
];

export function checkBadges(state) {
  return BADGES.filter(b => !state.badges.includes(b.id) && b.condition(state)).map(b => b.id);
}
