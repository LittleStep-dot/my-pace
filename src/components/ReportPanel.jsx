import { useMemo, useState } from 'react'
import { addDays, dateKey, dayReward, distance, fromDateKey, startOfWeek } from '../lib/product'

const dayNames = ['일', '월', '화', '수', '목', '금', '토']

function summarize(records, from, to, history, legacySpecial, weeklySpecials) {
  const start = dateKey(from)
  const end = dateKey(to)
  const items = records.filter((record) => record.date >= start && record.date <= end)
  const activeDates = [...new Set(items.map((record) => record.date))]
  const distanceMeters = activeDates.reduce(
    (sum, key) => sum + dayReward(history, legacySpecial, weeklySpecials, key),
    0,
  )
  const counts = items.reduce((map, record) => {
    if (record.type === 'daily') map.set(record.title, (map.get(record.title) || 0) + 1)
    return map
  }, new Map())
  const favorite = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '아직 기록이 없어요'
  return { activeDays: activeDates.length, goals: items.length, distanceMeters, favorite }
}

export default function ReportPanel({ records, history, legacySpecial, weeklySpecials, now, onBack }) {
  const [tab, setTab] = useState('history')
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(dateKey(now))
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const monday = startOfWeek(now)
  const sunday = addDays(monday, 6)
  const summary = useMemo(
    () => tab === 'weekly'
      ? summarize(records, monday, sunday, history, legacySpecial, weeklySpecials)
      : summarize(records, monthStart, monthEnd, history, legacySpecial, weeklySpecials),
    [tab, records, history, legacySpecial, weeklySpecials, monday.getTime(), month.getTime()],
  )

  const calendarDays = useMemo(() => {
    const leading = monthStart.getDay()
    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: monthEnd.getDate() }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)),
    ]
  }, [month.getTime()])
  const selectedRecords = records.filter((record) => record.date === selectedDate)
  const selectedReward = dayReward(history, legacySpecial, weeklySpecials, selectedDate)
  const selected = fromDateKey(selectedDate)

  return (
    <section className="profile-panel report-panel">
      <header className="panel-head">
        <button type="button" onClick={onBack} aria-label="뒤로가기">‹</button>
        <div><h1>통계 리포트</h1><p>내가 걸어온 작은 발걸음을 돌아봐요.</p></div>
      </header>
      <div className="report-tabs" role="tablist" aria-label="리포트 기간">
        {[
          ['history', '히스토리'],
          ['weekly', '주간'],
          ['monthly', '월간'],
        ].map(([key, label]) => <button type="button" key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>)}
      </div>

      {tab === 'history' ? <>
        <div className="calendar-card">
          <div className="calendar-head">
            <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="이전 달">‹</button>
            <b>{month.getFullYear()}년 {month.getMonth() + 1}월</b>
            <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="다음 달">›</button>
          </div>
          <div className="calendar-grid calendar-weekdays">{dayNames.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarDays.map((date, index) => date ? (() => {
              const key = dateKey(date)
              const active = records.some((record) => record.date === key)
              return <button type="button" key={key} className={`${selectedDate === key ? 'selected' : ''} ${active ? 'active-day' : ''}`} onClick={() => setSelectedDate(key)}><span>{date.getDate()}</span>{active && <i aria-label="활동 기록 있음">🌱</i>}</button>
            })() : <span key={`empty-${index}`} />)}
          </div>
        </div>
        <div className="day-detail">
          <h2>{selected.getMonth() + 1}월 {selected.getDate()}일 {dayNames[selected.getDay()]}요일</h2>
          {selectedRecords.length ? selectedRecords.map((record) => <div className="history-row" key={record.id}><span>✓</span><b>{record.title}</b><em>+{record.rewardMeters}m</em></div>) : <p>아직 기록된 발걸음이 없어요.</p>}
          {Object.values(history[selectedDate] || {}).filter((value) => value === 'done').length >= 3 && <div className="history-row bonus"><span>🌱</span><b>오늘의 작은 성공</b><em>+10m</em></div>}
          <strong className="day-distance">이날 걸은 거리 <b>{distance(selectedReward)}</b></strong>
        </div>
      </> : <>
        <div className="summary-period">{tab === 'weekly' ? `${monday.getMonth() + 1}월 ${monday.getDate()}일 – ${sunday.getMonth() + 1}월 ${sunday.getDate()}일` : `${month.getFullYear()}년 ${month.getMonth() + 1}월`}</div>
        <div className="report-summary">
          <div><span>🌱</span><b>{summary.activeDays}일</b><small>활동한 날</small></div>
          <div><span>✓</span><b>{summary.goals}개</b><small>완료한 목표</small></div>
          <div><span>🚶</span><b>{distance(summary.distanceMeters)}</b><small>걸은 거리</small></div>
          <div className="favorite"><span>🌿</span><b>{summary.favorite}</b><small>가장 많이 한 목표</small></div>
        </div>
      </>}
    </section>
  )
}
