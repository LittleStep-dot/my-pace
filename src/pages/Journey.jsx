import { useMemo, useState } from 'react'
import Mascot from '../components/Mascot'
import MilestoneIcon from '../components/MilestoneIcon'
import { addDays, dateKey, distance, startOfWeek } from '../lib/product'
import { discoveredMilestones, JOURNEY_MILESTONES, journeyScene, nextMilestone } from '../data/milestonesV2'

const formatDate = (value) => value ? new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value)) : '업데이트 전 기록'

export default function Journey({ totalMeters, currentPace, history, legacySpecial, weeklySpecials, now, discoveredIds, actualDiscoveries, discoveryRecords = [] }) {
  const [view, setView] = useState('main')
  const [selected, setSelected] = useState(null)
  const monday = startOfWeek(now)
  const week = dateKey(monday)
  const weeklyDate = weeklySpecials[week]?.completedAt ? dateKey(new Date(weeklySpecials[week].completedAt)) : null
  const dailyGoalCount = (meters) => Math.ceil(Math.max(0, meters) / (currentPace || 20))
  const activeDays = Array.from({ length: 7 }, (_, index) => {
    const key = dateKey(addDays(monday, index))
    return Object.values(history[key] || {}).some((value) => value === 'done') || legacySpecial[key] === 'done' || weeklyDate === key
  }).filter(Boolean).length
  const next = nextMilestone(totalMeters)
  const records = useMemo(() => new Map(discoveryRecords.map((record) => [record.id, record])), [discoveryRecords])
  const discovered = actualDiscoveries || discoveredMilestones(discoveredIds)
  const previous = discovered.at(-1)?.meters || 0
  const progress = next ? Math.min(100, ((totalMeters - previous) / Math.max(1, next.meters - previous)) * 100) : 100
  const captions = { neighborhood: '우리 동네에서 시작한 길', city: '도시를 향해 이어지는 길', nature: '초록 풍경을 지나는 길', mountain: '산과 능선을 만나는 길', coast: '바다까지 이어진 길', world: '더 넓은 세계로 향하는 길' }

  if (view === 'detail' && selected) {
    const record = records.get(selected.id)
    const collectionNumber = JOURNEY_MILESTONES.findIndex((item) => item.id === selected.id) + 1
    return <main className="screen journey-screen milestone-detail-screen">
      <section className="collection-head detail-head">
        <button className="icon-back" onClick={() => setView('collection')} aria-label="나의 발자취로 돌아가기"><svg viewBox="0 0 24 24"><path d="m14.5 5-7 7 7 7" /></svg></button>
        <div><small>{selected.type === 'achievement' ? 'PERSONAL MILESTONE' : 'JOURNEY LANDMARK'}</small><h1>{selected.name}</h1><p>{selected.region}</p></div>
      </section>
      <section className="screen-content milestone-detail">
        <div className="collection-showcase">
          <small>COLLECTION {String(collectionNumber).padStart(2, '0')}</small>
          <span className="detail-icon"><MilestoneIcon milestone={selected} /></span>
          <strong>{distance(selected.meters)}</strong>
        </div>
        <p className="detail-description">{selected.description}</p>
        <article><small>발견한 순간</small><b>{record?.totalMeters ? distance(record.totalMeters) : distance(selected.meters)}</b><p>{formatDate(record?.discoveredAt)}</p></article>
        <article><small>Daily Goal로 환산하면</small><b>약 {dailyGoalCount(selected.meters)}개</b><p>현재 Pace {currentPace || 20}m / Goal 기준의 단순 환산이에요.</p></article>
        <aside><b>💡 잠깐 상식</b><p>{selected.fact}</p></aside>
      </section>
    </main>
  }

  if (view === 'collection') return <main className="screen journey-screen collection-screen">
    <section className="collection-head"><button className="icon-back" onClick={() => setView('main')} aria-label="여정으로 돌아가기"><svg viewBox="0 0 24 24"><path d="m14.5 5-7 7 7 7" /></svg></button><div><small>JOURNEY COLLECTION</small><h1>나의 발자취</h1><p>{discovered.length}개 발견</p></div></section>
    <section className="screen-content collection-grid">{discovered.map((item) => <button key={item.id} className="collection-card unlocked" onClick={() => { setSelected(item); setView('detail') }}><span><MilestoneIcon milestone={item} /></span><small>{item.type === 'achievement' ? '나의 성취' : item.region}</small><b>{item.name}</b><em>{distance(item.meters)}</em><p>{item.description}</p></button>)}{next && <article className="collection-card locked next-card"><span>?</span><small>다음 Discovery</small><b>???</b><em>{distance(next.meters - totalMeters)} 남음</em><p>Daily Goal 기준 약 {dailyGoalCount(next.meters - totalMeters)}개 남았어요.</p></article>}</section>
  </main>

  return <main className={`screen journey-screen scene-${journeyScene(totalMeters)}`}>
    <section className="journey-hero"><div className="journey-hero-top"><img className="hero-logo journey-logo" src={`${import.meta.env.BASE_URL}art/logo_lockup.png`} alt="My Pace — Small Steps, Big Changes" /></div><div className="journey-walker"><Mascot mood="journey" size="lg" /></div><div className="scene-caption">{captions[journeyScene(totalMeters)]}</div></section>
    <section className="screen-content"><div className="journey-copy"><small>나의 여정</small><h1>{distance(totalMeters)}</h1><p>작은 목표들이 이만큼의 길을 만들었어요.</p></div><div className="next-discovery-card">{next ? <><div><small>다음 Discovery</small><b>{next.name}</b><p><strong>{distance(next.meters - totalMeters)}</strong> 남았어요</p><em>Daily Goal 기준 약 {dailyGoalCount(next.meters - totalMeters)}개</em></div><span className="next-silhouette"><MilestoneIcon milestone={next} /></span><div className="discovery-progress"><i style={{ width: `${progress}%` }} /></div></> : <div><small>모든 발자취 발견</small><b>나만의 길은 계속돼요 🌍</b></div>}</div><button className="collection-entry" onClick={() => setView('collection')}><span>🧭</span><div><b>나의 발자취</b><small>발견한 장소와 이야기를 다시 만나보세요</small></div><em>{discovered.length}개 ›</em></button><div className="week-card"><div className="week-top"><b>이번 주 여정</b><span>{activeDays} / 7일</span></div><div className="week-progress"><div style={{ width: `${activeDays / 7 * 100}%` }} /></div><p className="week-message">{activeDays ? `이번 주 ${activeDays}일 함께 걸었어요 🌱` : '이번 주의 첫 걸음을 기다리고 있어요 🌱'}</p></div>{discovered.length > 0 && <div className="recent-discoveries"><div className="section-head"><h2>최근 발견</h2><button onClick={() => setView('collection')}>모두 보기</button></div><div>{discovered.slice(-3).reverse().map((item) => <button key={item.id} onClick={() => { setSelected(item); setView('detail') }}><span><MilestoneIcon milestone={item} /></span><b>{item.name}</b><small>{distance(item.meters)}</small></button>)}</div></div>}</section>
  </main>
}
