export const MILESTONES = [100, 500, 1000, 3000, 5000, 10000, 15000, 21100, 30000, 42195, 50000, 75000, 100000]

export const JOURNEY_STAGES = [
  { meters: 0, icon: '🌱', name: '첫걸음' },
  { meters: 100, icon: '🌿', name: '산책 시작' },
  { meters: 500, icon: '☘️', name: '작은 산책가' },
  { meters: 1000, icon: '👟', name: '꾸준한 산책가' },
  { meters: 3000, icon: '🎒', name: '동네 탐험가' },
  { meters: 5000, icon: '🌳', name: '길 위의 친구' },
  { meters: 10000, icon: '⛰️', name: '작은 모험가' },
  { meters: 15000, icon: '🌲', name: '숲길 산책가' },
  { meters: 21100, icon: '🏞️', name: '긴 여정의 사람' },
  { meters: 30000, icon: '🧭', name: '먼 길 탐험가' },
  { meters: 42195, icon: '🏅', name: '마라톤 여정' },
  { meters: 50000, icon: '🗺️', name: '길을 만든 사람' },
  { meters: 75000, icon: '🌄', name: '깊어진 발걸음' },
  { meters: 100000, icon: '🌍', name: '나만의 길' },
]

export const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function fromDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  next.setDate(next.getDate() + amount)
  return next
}

export function startOfWeek(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

export const weekKey = (date = new Date()) => dateKey(startOfWeek(date))

export const distance = (meters) => meters < 1000
  ? `${meters} m`
  : `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : meters < 10000 ? 2 : 1)} km`

export function journeyStage(totalMeters) {
  const current = [...JOURNEY_STAGES].reverse().find((stage) => totalMeters >= stage.meters) || JOURNEY_STAGES[0]
  const index = JOURNEY_STAGES.indexOf(current)
  const next = JOURNEY_STAGES[index + 1] || null
  const span = next ? next.meters - current.meters : 1
  const progress = next ? Math.min(100, ((totalMeters - current.meters) / span) * 100) : 100
  return { current, next, progress }
}

export function inclusiveDaysSince(startedAt, now = new Date()) {
  if (!startedAt) return 1
  const start = new Date(startedAt)
  if (Number.isNaN(start.getTime())) return 1
  const first = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(1, Math.floor((today - first) / 86400000) + 1)
}

export function goalStreak(history, goalId, now = new Date()) {
  let count = 0
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  while (history[dateKey(cursor)]?.[goalId] === 'done') {
    count += 1
    cursor = addDays(cursor, -1)
  }
  return count
}

export function dayReward(history, legacySpecial, weeklySpecials, key) {
  const dailyCount = Object.values(history[key] || {}).filter((value) => value === 'done').length
  const mondayKey = weekKey(fromDateKey(key))
  const weekly = weeklySpecials[mondayKey]
  const weeklyCompletedOn = weekly?.completedAt ? dateKey(new Date(weekly.completedAt)) : null
  return dailyCount * 20 + (dailyCount >= 3 ? 10 : 0) + (legacySpecial[key] === 'done' ? 50 : 0) + (weeklyCompletedOn === key && !weekly?.legacyReward ? 50 : 0)
}

export function buildCompletionRecords({ history, legacySpecial, weeklySpecials, goals, specials }) {
  const goalMap = new Map(goals.map((goal) => [goal.id, goal]))
  const specialMap = new Map(specials.map((quest) => [quest.id, quest]))
  const records = []

  Object.entries(history).forEach(([date, state]) => {
    Object.entries(state || {}).forEach(([goalId, value]) => {
      if (value !== 'done') return
      const goal = goalMap.get(goalId)
      records.push({
        id: `daily:${date}:${goalId}`,
        date,
        goalId,
        title: goal?.title || '이전 Daily Goal',
        category: goal?.category || 'legacy',
        type: 'daily',
        rewardMeters: 20,
        completedAt: `${date}T12:00:00`,
      })
    })
  })

  Object.entries(legacySpecial).forEach(([date, value]) => {
    if (value !== 'done') return
    const dayNumber = Math.floor(fromDateKey(date).getTime() / 86400000)
    const quest = specials[Math.abs(dayNumber) % specials.length]
    records.push({
      id: `legacy-special:${date}`,
      date,
      goalId: quest?.id || 'legacy-special',
      title: quest?.title || '이전 Special Quest',
      category: 'special',
      type: 'special',
      rewardMeters: 50,
      completedAt: `${date}T12:00:00`,
    })
  })

  Object.entries(weeklySpecials).forEach(([week, state]) => {
    if (!state?.completedAt || state.legacyReward) return
    const quest = specialMap.get(state.questId)
    records.push({
      id: `weekly-special:${week}`,
      date: dateKey(new Date(state.completedAt)),
      goalId: state.questId,
      title: quest?.title || 'Special Quest',
      category: 'special',
      type: 'special',
      rewardMeters: 50,
      completedAt: state.completedAt,
    })
  })

  return records.sort((a, b) => a.completedAt.localeCompare(b.completedAt))
}
