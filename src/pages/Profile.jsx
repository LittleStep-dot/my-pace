import { useRef, useState } from 'react'
import GoalManager from '../components/GoalManager'
import Mascot from '../components/Mascot'
import ReportPanel from '../components/ReportPanel'
import ReminderSettings from '../components/ReminderSettings'
import DataManager from '../components/DataManager'
import { distance, inclusiveDaysSince, journeyStage } from '../lib/product'

export default function Profile({
  profile, totalMeters, theme, setTheme, setProfile, history, legacySpecial,
  weeklySpecials, completionLog, now, reminders, setReminders, restartOnboarding, resetAll, view, setView,
}) {
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(profile.name)
  const [photoError, setPhotoError] = useState('')
  const photoInput = useRef(null)
  const stage = journeyStage(totalMeters)
  const togetherDays = inclusiveDaysSince(profile.journeyStartedAt, now)
  const back = () => window.history.back()
  const saveName = () => {
    const next = name.trim()
    if (!next) return
    setProfile({ ...profile, name: next })
    setEditingName(false)
  }
  const choosePhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setPhotoError('이미지 파일을 선택해주세요.'); return }
    try {
      const bitmap = await createImageBitmap(file)
      const size = Math.min(bitmap.width, bitmap.height)
      const canvas = document.createElement('canvas')
      canvas.width = 512; canvas.height = 512
      const context = canvas.getContext('2d')
      context.drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, 512, 512)
      bitmap.close?.()
      setProfile({ ...profile, avatar: { type: 'photo', value: canvas.toDataURL('image/jpeg', 0.82) } })
      setPhotoError('')
      window.history.back()
    } catch {
      setPhotoError('사진을 불러오지 못했어요. 다른 사진을 선택해주세요.')
    }
  }

  if (view === 'goals') return <main className="screen profile-screen"><GoalManager profile={profile} save={(next) => { setProfile(next); back() }} cancel={back} /></main>
  if (view === 'report') return <main className="screen profile-screen"><ReportPanel records={completionLog} history={history} legacySpecial={legacySpecial} weeklySpecials={weeklySpecials} now={now} onBack={back} /></main>
  if (view === 'reminders') return <main className="screen profile-screen"><ReminderSettings reminders={reminders} setReminders={setReminders} onBack={back} /></main>
  if (view === 'data') return <main className="screen profile-screen"><DataManager onBack={back} onGoals={() => setView('goals')} onOnboarding={restartOnboarding} onResetAll={resetAll} /></main>
  if (view === 'avatar') return <main className="screen profile-screen"><section className="profile-head sub-head"><button onClick={back} aria-label="뒤로가기">‹</button><h1>프로필 사진</h1></section><section className="screen-content avatar-settings"><div className="avatar-preview"><img src={profile.avatar?.type === 'photo' ? profile.avatar.value : `${import.meta.env.BASE_URL}art/avatar-profile.png`} alt="현재 프로필" /></div><h2>나를 보여주는 사진을 골라보세요</h2><p>선택한 사진은 이 기기에만 저장돼요.</p><button className="avatar-choice" onClick={() => { setProfile({ ...profile, avatar: { type: 'default' } }); setPhotoError(''); window.history.back() }}><span>🌱</span><b>기본 아바타 사용</b></button><button className="avatar-choice" onClick={() => photoInput.current?.click()}><span>🖼️</span><b>휴대폰 사진에서 선택</b></button><input ref={photoInput} hidden type="file" accept="image/*" onChange={choosePhoto} />{photoError && <p className="avatar-error">{photoError}</p>}</section></main>

  return (
    <main className="screen profile-screen">
      <section className="profile-head"><h1>마이페이지</h1></section>
      <section className="screen-content">
        <div className="profile-identity">
          <button className="profile-avatar" onClick={() => setView('avatar')} aria-label="프로필 사진 변경"><img src={profile.avatar?.type === 'photo' ? profile.avatar.value : `${import.meta.env.BASE_URL}art/avatar-profile.png`} alt="" /><span>✎</span></button>
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
          <button className="settings-row" onClick={() => setView('goals')}><i>🎯</i><span>내 목표</span><b>›</b></button>
          <button className="settings-row" onClick={() => setView('report')}><i>📊</i><span>통계 리포트</span><b>›</b></button>
          <button className="settings-row" onClick={() => setView('reminders')}><i>🔔</i><span>리마인더 설정</span><b>›</b></button>
          <div className="settings-row theme-row"><i>🎨</i><span>테마 설정</span><select aria-label="테마 설정" value={theme} onChange={(event) => setTheme(event.target.value)}><option value="auto">자동</option><option value="light">라이트</option><option value="dark">다크</option></select></div>
          <button className="settings-row" onClick={() => setView('data')}><i>💾</i><span>데이터 관리</span><b>›</b></button>
        </div>

        <div className="profile-landscape">
          <div className="profile-rest-slogan" aria-label="Better Than Yesterday"><b>Better</b><b>Than</b><b>Yesterday</b><span>♡</span></div>
          <div className="profile-rest-copy"><b>충분히<br />쉬는 것도<br />중요해요.</b><span>♡</span></div>
          <div className="profile-sleep-mascot"><Mascot mood="sleep" size="sm" className="sleep-character-wrap" /></div>
        </div>
      </section>
    </main>
  )
}
