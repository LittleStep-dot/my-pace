import Mascot from '../components/Mascot'
import { distance, MILESTONES } from '../App'

export default function Journey({
  totalMeters,
  history,
  now,
}) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7)
  const weekDays = Array.from({length: 7}, (_, index) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + index)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return Object.values(history[key] || {}).some(value => value === 'done')
  })
  const activeDays = weekDays.filter(Boolean).length

  const nextMilestone = MILESTONES.find((m) => m > totalMeters) || 100000

  return (
    <main className="screen journey-screen">
      <section className="journey-hero">
        <div className="journey-hero-top">
          <img className="hero-logo" src={`${import.meta.env.BASE_URL}logo-final.svg`} alt="My Pace" />
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
          <div className="week-sprouts">
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <span
                key={n}
                className={weekDays[n] ? 'on' : ''}
              >
                🌱
              </span>
            ))}
          </div>
        </div>

        <div className="timeline-card">
          <h2>나의 여정 · {distance(totalMeters)}</h2>

          {MILESTONES.slice(0, 6).map((m) => {
            const reached = totalMeters >= m
            return (
              <div key={m} className={`timeline-row ${reached ? 'reached' : ''}`}>
                <div className="timeline-dot">{reached ? '✓' : '○'}</div>
                <div className="timeline-copy">
                  <strong>{distance(m)} 지점</strong>
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
          다음 이정표까지 <b>{distance(Math.max(0, nextMilestone - totalMeters))}</b>
        </div>
      </section>
    </main>
  )
}
