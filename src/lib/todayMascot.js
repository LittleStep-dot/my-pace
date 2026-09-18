export const TODAY_MASCOT_STATES = {
  thinking: { asset: 'mascot-thinking.png', label: '준비 중' },
  start: { asset: 'mascot-start.png', label: '첫 걸음' },
  cheer: { asset: 'mascot-cheer.png', label: '잘 하고 있어요' },
  star: { asset: 'mascot-star.png', label: '거의 다 왔어요' },
  heart: { asset: 'mascot-heart.png', label: '오늘의 완성' },
}

export function todayMascotState(completedCount, dailyGoalCount) {
  if (!dailyGoalCount || !completedCount) return 'thinking'
  const progress = completedCount / dailyGoalCount
  if (progress >= 1) return 'heart'
  if (progress >= 0.7) return 'star'
  if (progress >= 0.4) return 'cheer'
  return 'start'
}
