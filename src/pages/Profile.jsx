import { useState } from 'react'
import GoalManager from '../components/GoalManager'
import Mascot from '../components/Mascot'
import { distance } from '../App'

export default function Profile({
  profile,
  totalMeters,
  theme,
  setTheme,
  setProfile,
  history,
}) {
  const [editing, setEditing] = useState(false)
  const activeDays = Object.values(history).filter((day) =>
    Object.values(day).some((v) => v === 'done')
  ).length

  const level = Math.max(1, Math.floor(totalMeters / 500) + 1)

  if (editing) return <main className="screen profile-screen"><GoalManager profile={profile} save={next => { setProfile(next); setEditing(false) }} cancel={() => setEditing(false)} /></main>

  return (
    <main className="screen profile-screen">
      <section className="profile-head">
        <h1>마이페이지</h1>
        <button aria-label="설정">⚙️</button>
      </section>

      <section className="screen-content">
        <div className="profile-identity">
          <div className="profile-avatar">
            <Mascot mood="idle" size="md" />
          </div>

          <div className="profile-copy">
            <h2>{profile.name}님</h2>
            <p>나만의 속도로, 꾸준히 🌱</p>
          </div>

          <button className="edit-btn">✎</button>
        </div>

        <div className="profile-stats">
          <div>
            <span>👑</span>
            <b>Lv. {level}</b>
          </div>
          <div>
            <span>🌱</span>
            <b className="journey-distance-stat">{distance(totalMeters)}</b>
            <small>지금까지의 여정</small>
          </div>
          <div>
            <span>🔥</span>
            <b>{activeDays}</b>
            <small>함께한 날</small>
          </div>
        </div>

        <div className="settings-card">
          <button onClick={() => setEditing(true)}>
            <i>🎯</i>
            <span>내 목표</span>
            <b>›</b>
          </button>

          <button>
            <i>📊</i>
            <span>통계 리포트</span>
            <b>›</b>
          </button>

          <button>
            <i>🔔</i>
            <span>리마인더 설정</span>
            <b>›</b>
          </button>

          <div className="theme-row">
            <i>🎨</i>
            <span>테마 설정</span>
            <select aria-label="테마 설정" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="auto">자동</option>
              <option value="light">라이트</option>
              <option value="dark">다크</option>
            </select>
          </div>

          <button>
            <i>💾</i>
            <span>데이터 관리</span>
            <b>›</b>
          </button>
        </div>

        <div className="profile-landscape">
          <div className="profile-rest-slogan" aria-label="Better Than Yesterday">
            <b>Better</b>
            <b>Than</b>
            <b>Yesterday</b>
            <span>♡</span>
          </div>
          <div className="profile-rest-copy">
            <b>충분히<br />쉬는 것도<br />중요해요.</b>
            <span>♡</span>
          </div>

          <div className="profile-sleep-mascot">
            <Mascot mood="sleep" size="sm" />
          </div>
        </div>

        <button
          className="reset-btn"
          onClick={() => {
            if (window.confirm('온보딩을 다시 시작할까요?')) {
              localStorage.removeItem('myPaceV2Profile')
              setProfile(null)
            }
          }}
        >
          온보딩 다시 보기
        </button>
      </section>
    </main>
  )
}
