import Mascot from '../components/Mascot'
import { JOURNEY_STAGES, addDays, dateKey, distance, journeyStage, startOfWeek } from '../lib/product'

export default function Journey({
  totalMeters,
  history,
  legacySpecial,
  weeklySpecials,
  now,
}) {
  const monday = startOfWeek(now)
  const currentWeekKey = dateKey(monday)
  const weeklyCompletionDate = weeklySpecials[currentWeekKey]?.completedAt
    ? dateKey(new Date(weeklySpecials[currentWeekKey].completedAt))
    : null
  const weekDays = Array.from({length: 7}, (_, index) => {
    const key = dateKey(addDays(monday, index))
    const completedDaily = Object.values(history[key] || {}).some(value => value === 'done')
    const completedSpecial = legacySpecial[key] === 'done' || weeklyCompletionDate === key
    return completedDaily || completedSpecial
  })
  const activeDays = weekDays.filter(Boolean).length
  const weekMessage = activeDays === 0
    ? '이번 주의 첫 걸음을 기다리고 있어요 🌱'
    : `이번 주 ${activeDays}일 함께 걸었어요 🌱`

  const stage = journeyStage(totalMeters)
  const nextMilestone = stage.next?.meters || JOURNEY_STAGES.at(-1).meters

  return (
    <main className="screen journey-screen">
      <section className="journey-hero">
        <div className="journey-hero-top">
          <img className="hero-logo" src={`${import.meta.env.BASE_URL}art/logo_lockup.png`} alt="My Pace — Small Steps, Big Changes" />
        </div>



        <div className="journey-walker">
          <Mascot mood="journey" size="lg" />
        </div>
      </section>

      <section className="screen-content">
        <div className="journey-copy"><h1>오늘도 한 걸음 더!</h1><p>천천히, 하지만 꾸준히 💚</p></div>
        <div className="week-card">
          <div className="week-top">
            <b>이번 주 여정</b>
            <span>{activeDays} / 7일</span>
          </div>
          <div className="week-progress" role="progressbar" aria-label="이번 주 활동한 날" aria-valuemin="0" aria-valuemax="7" aria-valuenow={activeDays}>
            <div style={{ width: `${activeDays / 7 * 100}%` }} />
          </div>
          <p className="week-message">{weekMessage}</p>
        </div>

        <div className="timeline-card">
          <h2>나의 여정 · {distance(totalMeters)}</h2>

          {JOURNEY_STAGES.slice(1, 7).map((item) => {
            const reached = totalMeters >= item.meters
            return (
              <div key={item.meters} className={`timeline-row ${reached ? 'reached' : ''}`}>
                <div className="timeline-dot">{reached ? '✓' : '○'}</div>
                <div className="timeline-copy">
                  <strong>{item.icon} {item.name} · {distance(item.meters)}</strong>
                  <small>
                    {reached ? '지나온 작은 발걸음' : '다음 풍경을 향해'}
                  </small>
                </div>
              </div>
            )
          })}
        </div>

        <div className="journey-message">
          <p>
            지금도 충분히 잘하고 있어요.
            <br />
            당신의 속도로, 계속 걸어가요. 💚
          </p>
        </div>

        <div className="next-milestone">
          {stage.next ? <>다음 단계 ‘{stage.next.name}’까지 <b>{distance(Math.max(0, nextMilestone - totalMeters))}</b></> : <b>나만의 길을 계속 걷고 있어요 🌱</b>}
        </div>
      </section>
    </main>
  )
}
