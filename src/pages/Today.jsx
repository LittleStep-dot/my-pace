import Mascot from '../components/Mascot'
import { iconFor } from '../App'
import { distance, goalStreak, journeyStage } from '../lib/product'

export default function Today({
  profile, dailyGoals, todayState, completedCount, toggleDaily, weeklySpecial,
  specialState, toggleSpecial, changeSpecial, now, totalMeters, history,
}) {
  const greeting = now.getHours() < 12 ? '좋은 아침이에요,' : now.getHours() < 18 ? '좋은 오후예요,' : '좋은 저녁이에요,'
  const stage = journeyStage(totalMeters)
  const specialDone = Boolean(specialState.completedAt)
  const mood = completedCount >= 3 ? 'reward' : completedCount === 2 ? 'cheer' : completedCount === 1 ? 'idle' : 'think'
  const encouragement = completedCount >= 3
    ? '오늘의 작은 성공! 더 하지 않아도 충분해요. 💚'
    : completedCount === 2 ? '조금씩 쌓이고 있어요! ✨'
    : completedCount === 1 ? '좋아요, 첫 걸음을 내디디셨어요! 🌱'
    : '오늘은 어떤 한 걸음부터 시작해볼까요?'

  return (
    <main className="screen today-screen">
      <section className="today-hero">
        <div className="hero-top"><img className="hero-logo" src={`${import.meta.env.BASE_URL}logo-final.svg`} alt="My Pace" /><div className="hero-actions"><button aria-label="알림">🔔</button></div></div>
        <div className="hero-copy"><small>{greeting}</small><h1>{profile.name}님!</h1><p>오늘도, 당신의 속도로 💚</p></div>
      </section>

      <section className="screen-content">
        <div className="stats-row">
          <div className="stat-card"><span>🌱 Journey Distance</span><b>{distance(totalMeters)}</b><div className="stat-bar"><div style={{ width: `${stage.progress}%` }} /></div></div>
          <div className="stat-card"><span>{stage.current.icon} 현재 여정 단계</span><b className="stage-name">{stage.current.name}</b><div className="stat-bar yellow"><div style={{ width: `${stage.progress}%` }} /></div></div>
        </div>

        <div className="today-status">
          <Mascot mood={mood} size="sm" />
          <div><b>{encouragement}</b><small>오늘 {completedCount * 20 + (completedCount >= 3 ? 10 : 0)}m 걸었어요 · {completedCount} / {dailyGoals.length} 완료</small></div>
        </div>

        <div className="section-head"><h2>오늘의 목표</h2><span>{completedCount} / {dailyGoals.length} 완료</span></div>
        <div className="goal-list">
          {dailyGoals.map((goal) => {
            const done = todayState[goal.id] === 'done'
            const streak = goalStreak(history, goal.id, now)
            return <button key={goal.id} className={`goal-row ${done ? 'done' : ''}`} aria-pressed={done} onClick={() => toggleDaily(goal.id)}>
              <div className="goal-check">{done ? '✓' : ''}</div><div className="goal-emoji">{iconFor(goal)}</div>
              <div className="goal-copy"><div className="goal-title"><strong>{goal.title}</strong>{streak >= 2 && <span className="streak-badge">🌱 {streak}일째</span>}</div><small>{goal.description} · <em className="goal-reward">+20m</em></small></div><div className="goal-arrow">›</div>
            </button>
          })}
          {dailyGoals.length === 0 && <div className="empty-goals">지금은 선택한 Daily Goal이 없어요.<br />프로필에서 작은 목표를 추가할 수 있어요.</div>}
        </div>

        <div className={`special-card weekly-special ${specialDone ? 'done' : ''}`}>
          <button type="button" className="special-complete" aria-pressed={specialDone} disabled={specialState.legacyReward} onClick={toggleSpecial}>
            <span>{specialDone ? '✓ 이번 주 Special Quest' : '✨ 이번 주 Special Quest'}</span><b>{weeklySpecial.title}</b>
            <small>{specialDone ? '완료했어요! +50m' : '약 20분 · 이번 주 편한 날에 · +50m'}</small>
          </button>
          {!specialDone && <button type="button" className="change-quest" disabled={specialState.changed} onClick={changeSpecial}>{specialState.changed ? '이번 주 변경 완료' : '다른 퀘스트 보기 ↻'}</button>}
          <p>안 해도 괜찮아요. 이번 주 내 페이스에 맞으면 선택해요.</p>
        </div>
      </section>
    </main>
  )
}
