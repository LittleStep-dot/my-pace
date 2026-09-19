export const DAILY_GOAL_LIMIT = 5
export const THREE_GOAL_BONUS_METERS = 10

const PACE_STEPS = [
  [42195, 100],
  [21097.5, 80],
  [10000, 60],
  [5000, 40],
  [1000, 20],
  [0, 10],
]

export const paceForMeters = (meters = 0) =>
  PACE_STEPS.find(([unlockAt]) => meters >= unlockAt)?.[1] || 10

export const dailyRewardForCount = (completedBefore, pace) =>
  pace + (completedBefore === 2 ? THREE_GOAL_BONUS_METERS : 0)
