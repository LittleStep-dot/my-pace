import Mascot from '../components/Mascot'
import { iconFor } from '../App'

export default function Today({
  profile,
  dailyGoals,
  todayState,
  completedCount,
  toggleDaily,
  dailySpecial,
  specialDone,
  toggleSpecial,
  now,
  weeklyGoals, weeklyState, toggleWeekly,
  monthlyGoals, monthlyState, toggleMonthly,
}) {
  const greetingHour = now.getHours()

  const greeting =
    greetingHour < 12
      ? '좋은 아침이에요,'
      : greetingHour < 18
      ? '좋은 오후예요,'
      : '좋은 저녁이에요,'

  const faceScore = Math.min(100, 68 + completedCount * 4)
  const level = Math.max(1, Math.floor(completedCount / 2) + 1)

  const mood =
    completedCount >= dailyGoals.length && dailyGoals.length > 0
      ? 'reward'
      : completedCount >= 3
      ? 'cheer'
      : 'idle'

  return (
    <main className="screen today-screen">
      <section className="today-hero">
        <div className="hero-top">
          <img className="hero-logo" src={`${import.meta.env.BASE_URL}logo-final.svg`} alt="My Pace" />
          <div className="hero-actions">
            <button aria-label="알림">🔔</button>
            <button aria-label="설정">⚙️</button>
          </div>
        </div>

        <div className="hero-copy">
          <small>{greeting}</small>
          <h1>{profile.name}님!</h1>
          <p>오늘도, 당신의 속도로 💚</p>
        </div>
      </section>

      <section className="screen-content">
        <div className="stats-row">
          <div className="stat-card">
            <span>🌱 Face Score</span>
            <b>
              {faceScore}
              <small>/100</small>
            </b>
            <div className="stat-bar">
              <div style={{ width: `${faceScore}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <span>👑 Journey Level</span>
            <b>Lv. {level}</b>
            <div className="stat-bar yellow">
              <div style={{ width: '54%' }} />
            </div>
          </div>
        </div>

        <div className="section-head">
          <h2>오늘의 목표</h2>
          <span>{completedCount} / {dailyGoals.length} 완료</span>
        </div>

        <div className="goal-list">
          {dailyGoals.map((goal) => {
            const done = todayState[goal.id] === 'done'
            return (
              <button
                key={goal.id}
                className={`goal-row ${done ? 'done' : ''}`}
                aria-pressed={done}
                onClick={() => toggleDaily(goal.id)}
              >
                <div className="goal-check">{done ? '✓' : ''}</div>
                <div className="goal-emoji">{iconFor(goal)}</div>
                <div className="goal-copy">
                  <strong>{goal.title}</strong>
                  <small>{goal.description}</small>
                </div>
                <div className="goal-arrow">›</div>
              </button>
            )
          })}
        </div>

        <PeriodGoals title="이번 주 목표" goals={weeklyGoals} state={weeklyState} onToggle={toggleWeekly} reward={100} />
        <PeriodGoals title="이번 달 목표" goals={monthlyGoals} state={monthlyState} onToggle={toggleMonthly} reward={500} />

        {dailySpecial && (
          <button
            className={`special-card ${specialDone ? 'done' : ''}`}
            aria-pressed={specialDone}
            onClick={toggleSpecial}
          >
            <span>✨ 오늘의 Special</span>
            <b>{dailySpecial.title}</b>
            <small>
              {specialDone
                ? '완료했어요! +50m'
                : '가볍게 도전해볼까요? · +50m'}
            </small>
          </button>
        )}

        <div className="today-encourage">
          <Mascot mood={mood} size="sm" />
          <p>
            작은 실천이 오늘을 바꾸고,
            <br />
            내일의 내가 됩니다. 💚
          </p>
        </div>
      </section>
    </main>
  )
}

function PeriodGoals({ title, goals, state, onToggle, reward }) {
  if (!goals.length) return null
  const completed = goals.filter(goal => state[goal.id] === 'done').length
  return <section aria-label={title}>
    <div className="section-head"><h2>{title}</h2><span>{completed} / {goals.length} 완료</span></div>
    <div className="goal-list">{goals.map(goal => {
      const done = state[goal.id] === 'done'
      return <button key={goal.id} className={`goal-row ${done ? 'done' : ''}`} aria-pressed={done} onClick={() => onToggle(goal.id)}>
        <div className="goal-check">{done ? '✓' : ''}</div>
        <div className="goal-emoji">{iconFor(goal)}</div>
        <div className="goal-copy"><strong>{goal.title}</strong><small>{goal.description} · +{reward}m</small></div>
        <div className="goal-arrow">›</div>
      </button>
    })}</div>
  </section>
}
