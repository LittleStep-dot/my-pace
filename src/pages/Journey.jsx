import { useState } from 'react'
import Mascot from '../components/Mascot'
import { addDays, dateKey, distance, startOfWeek } from '../lib/product'
import { JOURNEY_MILESTONES, journeyScene, nextMilestone } from '../data/milestones'

export default function Journey({ totalMeters, history, legacySpecial, weeklySpecials, now, discoveredIds }) {
  const [showCollection, setShowCollection] = useState(false)
  const monday = startOfWeek(now)
  const currentWeekKey = dateKey(monday)
  const weeklyCompletionDate = weeklySpecials[currentWeekKey]?.completedAt ? dateKey(new Date(weeklySpecials[currentWeekKey].completedAt)) : null
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const key = dateKey(addDays(monday, index))
    return Object.values(history[key] || {}).some((value) => value === 'done') || legacySpecial[key] === 'done' || weeklyCompletionDate === key
  })
  const activeDays = weekDays.filter(Boolean).length
  const next = nextMilestone(totalMeters)
  const discovered = JOURNEY_MILESTONES.filter((item) => discoveredIds.includes(item.id))
  const scene = journeyScene(totalMeters)
  const previousThreshold = discovered.at(-1)?.meters || 0
  const progress = next ? Math.min(100, ((totalMeters - previousThreshold) / Math.max(1, next.meters - previousThreshold)) * 100) : 100

  if (showCollection) return <main className="screen journey-screen collection-screen">
    <section className="collection-head"><button onClick={() => setShowCollection(false)} aria-label="뒤로가기">‹</button><div><small>JOURNEY COLLECTION</small><h1>나의 발자취</h1><p>{discovered.length} / {JOURNEY_MILESTONES.length} 발견</p></div></section>
    <section className="screen-content collection-grid">
      {JOURNEY_MILESTONES.map((item, index) => {
        const unlocked = discoveredIds.includes(item.id)
        const isNext = !unlocked && item.id === next?.id
        return <article key={item.id} className={`collection-card ${unlocked ? 'unlocked' : 'locked'}`}><span>{unlocked || isNext ? item.icon : '?'}</span><small>{unlocked ? item.region : isNext ? '다음 발견' : '아직 먼 발자취'}</small><b>{unlocked ? item.name : '???'}</b><em>{unlocked ? distance(item.meters) : isNext ? `${distance(item.meters - totalMeters)} 남음` : `발자취 ${index + 1}`}</em>{unlocked && <p>{item.description}</p>}</article>
      })}
    </section>
  </main>

  const captions = { neighborhood: '우리 동네에서 시작한 길', city: '도시를 향해 이어지는 길', nature: '초록 풍경을 지나는 길', mountain: '산과 능선을 만나는 길', coast: '바다까지 이어진 길', world: '더 넓은 세계로 향하는 길' }
  return <main className={`screen journey-screen scene-${scene}`}>
    <section className="journey-hero">
      <div className="journey-hero-top"><span className="hero-logo-surface"><img className="hero-logo" src={`${import.meta.env.BASE_URL}art/logo_lockup.png`} alt="My Pace — Small Steps, Big Changes" /></span></div>
      <div className="journey-walker"><Mascot mood="journey" size="lg" /></div>
      <div className="scene-caption">{captions[scene]}</div>
    </section>
    <section className="screen-content">
      <div className="journey-copy"><small>나의 여정</small><h1>{distance(totalMeters)}</h1><p>작은 목표들이 이만큼의 길을 만들었어요.</p></div>
      <div className="next-discovery-card">{next ? <><div><small>다음 Discovery</small><b>{next.icon} {next.name}</b><p><strong>{distance(next.meters - totalMeters)}</strong> 남았어요</p></div><span className="next-silhouette">{next.icon}</span><div className="discovery-progress"><i style={{ width: `${progress}%` }} /></div></> : <div><small>모든 발자취 발견</small><b>나만의 길은 계속돼요 🌍</b></div>}</div>
      <button className="collection-entry" onClick={() => setShowCollection(true)}><span>🧭</span><div><b>나의 발자취</b><small>발견한 장소와 이야기를 다시 만나보세요</small></div><em>{discovered.length} / {JOURNEY_MILESTONES.length} ›</em></button>
      <div className="week-card"><div className="week-top"><b>이번 주 여정</b><span>{activeDays} / 7일</span></div><div className="week-progress"><div style={{ width: `${activeDays / 7 * 100}%` }} /></div><p className="week-message">{activeDays ? `이번 주 ${activeDays}일 함께 걸었어요 🌱` : '이번 주의 첫 걸음을 기다리고 있어요 🌱'}</p></div>
      {discovered.length > 0 && <div className="recent-discoveries"><div className="section-head"><h2>최근 발견</h2><button onClick={() => setShowCollection(true)}>모두 보기</button></div><div>{discovered.slice(-3).reverse().map((item) => <article key={item.id}><span>{item.icon}</span><b>{item.name}</b><small>{distance(item.meters)}</small></article>)}</div></div>}
    </section>
  </main>
}
