import { useState } from 'react'
import GoalManager from '../components/GoalManager'
import Mascot from '../components/Mascot'
import ReportPanel from '../components/ReportPanel'
import ReminderSettings from '../components/ReminderSettings'
import DataManager from '../components/DataManager'
import { distance, inclusiveDaysSince, journeyStage } from '../lib/product'

export default function Profile({
  profile, totalMeters, theme, setTheme, setProfile, history, legacySpecial,
  weeklySpecials, completionLog, now, reminders, setReminders, restartOnboarding, resetAll,
}) {
  const [view, setView] = useState('main')
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(profile.name)
  const stage = journeyStage(totalMeters)
  const togetherDays = inclusiveDaysSince(profile.journeyStartedAt, now)
  const back = () => setView('main')
  const saveName = () => {
    const next = name.trim()
    if (!next) return
    setProfile({ ...profile, name: next })
    setEditingName(false)
  }

  if (view === 'goals') return <main className="screen profile-screen"><GoalManager profile={profile} save={(next) => { setProfile(next); back() }} cancel={back} /></main>
  if (view === 'report') return <main className="screen profile-screen"><ReportPanel records={completionLog} history={history} legacySpecial={legacySpecial} weeklySpecials={weeklySpecials} now={now} onBack={back} /></main>
  if (view === 'reminders') return <main className="screen profile-screen"><ReminderSettings reminders={reminders} setReminders={setReminders} onBack={back} /></main>
  if (view === 'data') return <main className="screen profile-screen"><DataManager onBack={back} onGoals={() => setView('goals')} onOnboarding={restartOnboarding} onResetAll={resetAll} /></main>

  return (
    <main className="screen profile-screen">
      <section className="profile-head"><h1>마이페이지</h1></section>
      <section className="screen-content">
        <div className="profile-identity">
          <div className="profile-avatar"><Mascot mood="profile" size="md" /></div>
          <div className="profile-copy">
            {editingName ? <form className="name-edit" onSubmit={(event) => { event.preventDefault(); saveName() }}><input autoFocus value={name} onChange={(event) => setName(event.target.value)} aria-label="이름 수정" /><button type="submit" aria-label="이름 저장">✓</button></form> : <h2>{profile.name}님</h2>}
            <p>나만의 속도로, 꾸준히 🌱</p>
          </div>
          {!editingName && <button className="edit-btn" aria-label="이름 수정" onClick={() => { setName(profile.name); setEditingName(true) }}>✎</button>}
        </div>

        <div className="profile-stats">
          <div><span>{stage.current.icon}</span><b className="profile-stage-name">{stage.current.name}</b><small>현재 단계</small></div>
          <div><span>🌱</span><b className="journey-distance-stat">{distance(totalMeters)}</b><small>지금까지의 여정</small></div>
          <div><span>🗓️</span><b>{togetherDays}일</b><small>함께한 날</small></div>
        </div>

        <div className="settings-card">
          <button onClick={() => setView('goals')}><i>🎯</i><span>내 목표</span><b>›</b></button>
          <button onClick={() => setView('report')}><i>📊</i><span>통계 리포트</span><b>›</b></button>
          <button onClick={() => setView('reminders')}><i>🔔</i><span>리마인더 설정</span><b>›</b></button>
          <div className="theme-row"><i>🎨</i><span>테마 설정</span><select aria-label="테마 설정" value={theme} onChange={(event) => setTheme(event.target.value)}><option value="auto">자동</option><option value="light">라이트</option><option value="dark">다크</option></select></div>
          <button onClick={() => setView('data')}><i>💾</i><span>데이터 관리</span><b>›</b></button>
        </div>

        <div className="profile-landscape">
          <div className="profile-rest-slogan" aria-label="Better Than Yesterday"><b>Better</b><b>Than</b><b>Yesterday</b><span>♡</span></div>
          <div className="profile-rest-copy"><b>충분히<br />쉬는 것도<br />중요해요.</b><span>♡</span></div>
          <div className="profile-sleep-mascot"><Mascot mood="sleep" size="sm" /></div>
        </div>
      </section>
    </main>
  )
}
