import { useState } from 'react'

export default function ReminderSettings({ reminders, setReminders, onBack }) {
  const [permission, setPermission] = useState(() => typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)
  const update = (key, patch) => setReminders((current) => ({
    ...current,
    [key]: { ...current[key], ...patch },
  }))

  return (
    <section className="profile-panel reminder-panel">
      <header className="panel-head">
        <button type="button" onClick={onBack} aria-label="뒤로가기">‹</button>
        <div><h1>리마인더 설정</h1><p>필요한 순간에만 가볍게 알려드려요.</p></div>
      </header>

      <div className="reminder-card">
        <label className="reminder-main">
          <span><i>🌱</i><b>오늘의 목표</b><small>지정 시간까지 Daily Goal을 하나도 완료하지 않았을 때만 알려요.</small></span>
          <input type="checkbox" checked={reminders.daily.enabled} onChange={(event) => update('daily', { enabled: event.target.checked })} />
        </label>
        <label className="time-row"><span>알림 시간</span><input type="time" value={reminders.daily.time} disabled={!reminders.daily.enabled} onChange={(event) => update('daily', { time: event.target.value })} /></label>
      </div>

      <div className="reminder-card">
        <label className="reminder-main">
          <span><i>🌙</i><b>하루 마무리</b><small>완료 여부와 관계없이 오늘의 작은 발걸음을 돌아볼 시간을 알려요.</small></span>
          <input type="checkbox" checked={reminders.evening.enabled} onChange={(event) => update('evening', { enabled: event.target.checked })} />
        </label>
        <label className="time-row"><span>알림 시간</span><input type="time" value={reminders.evening.time} disabled={!reminders.evening.enabled} onChange={(event) => update('evening', { time: event.target.value })} /></label>
      </div>

      {permission !== 'granted' && <button type="button" className="notification-permission" disabled={permission === 'unsupported'} onClick={async () => setPermission(await Notification.requestPermission())}>{permission === 'unsupported' ? '이 브라우저는 알림을 지원하지 않아요' : '브라우저 알림 허용하기'}</button>}

      <p className="reminder-note">Special Quest에는 리마인더를 보내지 않아요. 현재 웹 버전의 알림은 My Pace가 실행 중일 때 작동하며, 백그라운드 알림은 추후 네이티브 앱에서 연결할 예정이에요.</p>
    </section>
  )
}
