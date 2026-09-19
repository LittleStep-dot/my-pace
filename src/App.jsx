import { useEffect, useMemo, useRef, useState } from 'react'
import './styles/app.css'
import './styles/integration.css'
import { CATEGORIES, GOAL_LIBRARY, SPECIAL_QUESTS } from './data/goals'
import Today from './pages/Today'
import Journey from './pages/Journey'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'
import Mascot from './components/Mascot'
import { MILESTONES, buildCompletionRecords, dateKey, distance, journeyStage, weekKey } from './lib/product'
import useJourneyDiscoveries from './hooks/useJourneyDiscoveries'
import DiscoveryModal from './components/DiscoveryModal'
import { discoveredMilestones } from './data/milestonesV2'
import { dailyRewardForCount, paceForMeters } from './lib/pace'

export { MILESTONES, distance, journeyStage }

const STORAGE = {
  profile: 'myPaceV2Profile', history: 'myPaceV2History', weekly: 'myPaceV2Weekly', monthly: 'myPaceV2Monthly',
  special: 'myPaceV2Special', theme: 'myPaceV2Theme', completionLog: 'myPaceV3CompletionLog',
  weeklySpecials: 'myPaceV3WeeklySpecials', reminders: 'myPaceV3Reminders',
  discoveries: 'myPaceV4Discoveries', journeyMeters: 'myPaceV5JourneyMeters',
}
const DEFAULT_REMINDERS = { daily: { enabled: false, time: '20:00' }, evening: { enabled: false, time: '22:00' } }
const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback } catch { return fallback } }
const findGoal = (id) => GOAL_LIBRARY.find((goal) => goal.id === id)
const doneCount = (value) => Object.values(value || {}).reduce((sum, entry) => sum + (entry === 'done' ? 1 : entry && typeof entry === 'object' ? Object.values(entry).filter((item) => item === 'done').length : 0), 0)
const questIndex = (key) => Math.abs([...key].reduce((sum, char) => ((sum * 31) + char.charCodeAt(0)) | 0, 7)) % SPECIAL_QUESTS.length
const questStateFor = (key) => ({ questId: SPECIAL_QUESTS[questIndex(key)].id, changed: false, completedAt: null })
const legacyJourneyMeters = (history, weekly, monthly, legacySpecial, weeklySpecials) => {
  let meters = 0
  Object.values(history).forEach((day) => { const count = Object.values(day || {}).filter((value) => value === 'done').length; meters += count * 20 + (count >= 3 ? 10 : 0) })
  return meters + doneCount(weekly) * 100 + doneCount(monthly) * 500 + Object.values(legacySpecial).filter((value) => value === 'done').length * 50 + Object.values(weeklySpecials).filter((state) => state?.completedAt && !state.legacyReward).length * 50
}

export const iconFor = (goal) => ({ g02: '🔤', c04: '🎧' }[goal?.id] || goal?.icon || '🌱')

function normalizeProfile(profile, history, legacySpecial) {
  if (!profile) return null
  const activityDates = [...Object.keys(history || {}), ...Object.keys(legacySpecial || {})].filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key)).sort()
  return {
    ...profile,
    dailyGoalIds: profile.dailyGoalIds || [], weeklyGoalIds: profile.weeklyGoalIds || [], monthlyGoalIds: profile.monthlyGoalIds || [],
    journeyStartedAt: profile.journeyStartedAt || profile.createdAt || (activityDates[0] ? `${activityDates[0]}T12:00:00` : new Date().toISOString()),
  }
}

export default function App() {
  const initialHistory = useMemo(() => safeParse(localStorage.getItem(STORAGE.history), {}), [])
  const initialLegacySpecial = useMemo(() => safeParse(localStorage.getItem(STORAGE.special), {}), [])
  const [now, setNow] = useState(new Date())
  const [profile, setProfile] = useState(() => normalizeProfile(safeParse(localStorage.getItem(STORAGE.profile), null), initialHistory, initialLegacySpecial))
  const [history, setHistory] = useState(initialHistory)
  const [weekly, setWeekly] = useState(() => safeParse(localStorage.getItem(STORAGE.weekly), {}))
  const [monthly, setMonthly] = useState(() => safeParse(localStorage.getItem(STORAGE.monthly), {}))
  const [legacySpecial, setLegacySpecial] = useState(initialLegacySpecial)
  const [weeklySpecials, setWeeklySpecials] = useState(() => safeParse(localStorage.getItem(STORAGE.weeklySpecials), {}))
  const [journeyMeters, setJourneyMeters] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE.journeyMeters))
    return Number.isFinite(saved) && saved >= 0 ? saved : legacyJourneyMeters(initialHistory, safeParse(localStorage.getItem(STORAGE.weekly), {}), safeParse(localStorage.getItem(STORAGE.monthly), {}), initialLegacySpecial, safeParse(localStorage.getItem(STORAGE.weeklySpecials), {}))
  })
  const [completionLog, setCompletionLog] = useState(() => safeParse(localStorage.getItem(STORAGE.completionLog), []))
  const [reminders, setReminders] = useState(() => {
    const saved = safeParse(localStorage.getItem(STORAGE.reminders), {})
    return { daily: { ...DEFAULT_REMINDERS.daily, ...saved.daily }, evening: { ...DEFAULT_REMINDERS.evening, ...saved.evening } }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE.theme) || 'auto')
  const [tab, setTab] = useState('today')
  const [profileView, setProfileView] = useState('main')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const notificationRef = useRef(new Set())

  const navigate = (nextTab, nextProfileView = 'main', { replace = false } = {}) => {
    const state = { myPace: true, tab: nextTab, profileView: nextProfileView }
    if (replace) window.history.replaceState(state, '')
    else window.history.pushState(state, '')
    setTab(nextTab)
    setProfileView(nextProfileView)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id) }, [])
  useEffect(() => {
    window.history.replaceState({ myPace: true, tab: 'today', profileView: 'main' }, '')
    const onPopState = (event) => {
      const state = event.state
      if (!state?.myPace) return
      setTab(state.tab || 'today')
      setProfileView(state.profileView || 'main')
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => { document.documentElement.dataset.theme = theme === 'auto' ? (media.matches ? 'dark' : 'light') : theme }
    apply(); localStorage.setItem(STORAGE.theme, theme); media.addEventListener?.('change', apply)
    return () => media.removeEventListener?.('change', apply)
  }, [theme])
  useEffect(() => localStorage.setItem(STORAGE.history, JSON.stringify(history)), [history])
  useEffect(() => localStorage.setItem(STORAGE.weekly, JSON.stringify(weekly)), [weekly])
  useEffect(() => localStorage.setItem(STORAGE.monthly, JSON.stringify(monthly)), [monthly])
  useEffect(() => localStorage.setItem(STORAGE.special, JSON.stringify(legacySpecial)), [legacySpecial])
  useEffect(() => localStorage.setItem(STORAGE.weeklySpecials, JSON.stringify(weeklySpecials)), [weeklySpecials])
  useEffect(() => localStorage.setItem(STORAGE.completionLog, JSON.stringify(completionLog)), [completionLog])
  useEffect(() => localStorage.setItem(STORAGE.reminders, JSON.stringify(reminders)), [reminders])
  useEffect(() => localStorage.setItem(STORAGE.journeyMeters, String(journeyMeters)), [journeyMeters])
  useEffect(() => { if (profile) localStorage.setItem(STORAGE.profile, JSON.stringify(profile)) }, [profile])

  const currentWeek = weekKey(now)
  useEffect(() => {
    setWeeklySpecials((current) => {
      if (current[currentWeek]) return current
      const legacyDate = Object.keys(legacySpecial).find((key) => key >= currentWeek && key <= dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - ((now.getDay() + 6) % 7) - 1))) && legacySpecial[key] === 'done')
      if (!legacyDate) return { ...current, [currentWeek]: questStateFor(currentWeek) }
      const dayNumber = Math.floor(new Date(`${legacyDate}T12:00:00`).getTime() / 86400000)
      return { ...current, [currentWeek]: { questId: SPECIAL_QUESTS[Math.abs(dayNumber) % SPECIAL_QUESTS.length].id, changed: true, completedAt: `${legacyDate}T12:00:00`, legacyReward: true } }
    })
  }, [currentWeek, legacySpecial, now])
  useEffect(() => {
    const migrated = buildCompletionRecords({ history, legacySpecial, weeklySpecials, goals: GOAL_LIBRARY, specials: SPECIAL_QUESTS })
    setCompletionLog((current) => {
      const merged = new Map(migrated.map((record) => [record.id, record]))
      current.forEach((record) => { if (merged.has(record.id)) merged.set(record.id, { ...merged.get(record.id), ...record }) })
      const next = [...merged.values()].sort((a, b) => a.completedAt.localeCompare(b.completedAt))
      return JSON.stringify(next) === JSON.stringify(current) ? current : next
    })
  }, [history, legacySpecial, weeklySpecials])

  const totalMeters = journeyMeters
  const discoveries = useJourneyDiscoveries(totalMeters)

  const today = dateKey(now)
  const dailyGoals = (profile?.dailyGoalIds || []).map(findGoal).filter(Boolean)
  const todayState = history[today] || {}
  const completedCount = dailyGoals.filter((goal) => todayState[goal.id] === 'done').length
  const specialState = weeklySpecials[currentWeek] || questStateFor(currentWeek)
  const weeklySpecial = SPECIAL_QUESTS.find((quest) => quest.id === specialState.questId) || SPECIAL_QUESTS[0]

  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted' || !profile) return
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const notify = (kind, title, body) => {
      const id = `${today}:${kind}`
      if (notificationRef.current.has(id)) return
      notificationRef.current.add(id)
      new Notification(title, { body, icon: `${import.meta.env.BASE_URL}brand-mark.svg` })
    }
    if (reminders.daily.enabled && reminders.daily.time === currentTime && completedCount === 0) notify('daily', '오늘의 목표 🌱', '오늘도 작은 한 걸음 어때요?')
    if (reminders.evening.enabled && reminders.evening.time === currentTime) notify('evening', '하루 마무리 🌙', '오늘도 수고했어요. 오늘의 작은 발걸음을 돌아볼까요?')
  }, [now, reminders, completedCount, profile, today])

  const showFeedback = (next) => { setFeedback(next); window.setTimeout(() => setFeedback(null), next.detail ? 2200 : 900) }
  const toggleDaily = (goalId) => {
    const goal = findGoal(goalId)
    setHistory((current) => {
      const day = current[today] || {}
      const completing = day[goalId] !== 'done'
      const before = Object.values(day).filter((value) => value === 'done').length
      const nextDay = { ...day }
      if (completing) nextDay[goalId] = 'done'; else delete nextDay[goalId]
      const after = Object.values(nextDay).filter((value) => value === 'done').length
      setCompletionLog((records) => completing ? [...records.filter((record) => record.id !== `daily:${today}:${goalId}`), {
        id: `daily:${today}:${goalId}`, date: today, goalId, title: goal?.title || '이전 Daily Goal', category: goal?.category || 'legacy',
        type: 'daily', rewardMeters: 20, completedAt: new Date().toISOString(),
      }] : records.filter((record) => record.id !== `daily:${today}:${goalId}`))
      if (completing) {
        const pace = paceForMeters(totalMeters)
        setJourneyMeters((meters) => meters + dailyRewardForCount(before, pace))
        const firstEver = !Object.values(current).some((record) => Object.values(record || {}).some((value) => value === 'done'))
        if (before < 3 && after >= 3) showFeedback({ meters: 30, title: '오늘의 작은 성공! ✨', detail: '세 걸음을 쌓았어요. 더 하지 않아도 충분해요.' })
        else if (firstEver) showFeedback({ meters: 20, title: '첫 20m를 걸었어요! 🌱', detail: '작은 행동 하나가 My Pace에서는 한 걸음이 돼요.' })
        else showFeedback({ meters: 20 })
      }
      if (!completing) setJourneyMeters((meters) => Math.max(0, meters - dailyRewardForCount(before - 1, paceForMeters(Math.max(0, meters - 1)))))
      return { ...current, [today]: nextDay }
    })
  }

  const toggleWeeklySpecial = () => {
    const completing = !specialState.completedAt
    const completedAt = completing ? new Date().toISOString() : null
    setWeeklySpecials((current) => ({ ...current, [currentWeek]: { ...specialState, completedAt } }))
    setJourneyMeters((meters) => Math.max(0, meters + (completing ? 50 : -50)))
    setCompletionLog((records) => completing ? [...records.filter((record) => record.id !== `weekly-special:${currentWeek}`), {
      id: `weekly-special:${currentWeek}`, date: today, goalId: weeklySpecial.id, title: weeklySpecial.title,
      category: 'special', type: 'special', rewardMeters: 50, completedAt,
    }] : records.filter((record) => record.id !== `weekly-special:${currentWeek}`))
    if (completing) showFeedback({ meters: 50 })
  }
  const changeWeeklySpecial = () => {
    if (specialState.changed || specialState.completedAt) return
    if (!window.confirm('다른 퀘스트로 바꿀까요?\n이번 주에는 한 번만 변경할 수 있어요.')) return
    const currentIndex = SPECIAL_QUESTS.findIndex((quest) => quest.id === specialState.questId)
    const next = SPECIAL_QUESTS[(currentIndex + 1 + questIndex(`${currentWeek}:change`)) % SPECIAL_QUESTS.length]
    setWeeklySpecials((current) => ({ ...current, [currentWeek]: { questId: next.id, changed: true, completedAt: null } }))
  }

  const finishOnboarding = (next) => {
    setProfile({ ...next, journeyStartedAt: profile?.journeyStartedAt || next.journeyStartedAt || new Date().toISOString(), createdAt: profile?.createdAt || next.createdAt || new Date().toISOString(), weeklyGoalIds: profile?.weeklyGoalIds || [], monthlyGoalIds: profile?.monthlyGoalIds || [] })
    setShowOnboarding(false)
  }
  const resetAll = () => {
    if (!window.confirm('모든 기록과 설정을 삭제할까요?\n이 작업은 되돌릴 수 없어요.')) return
    Object.values(STORAGE).forEach((key) => localStorage.removeItem(key))
    discoveries.clearDiscoveries()
    setProfile(null); setHistory({}); setWeekly({}); setMonthly({}); setLegacySpecial({}); setWeeklySpecials({}); setJourneyMeters(0); setCompletionLog([]); setReminders(DEFAULT_REMINDERS); setTheme('auto'); navigate('today', 'main', { replace: true })
  }

  if (!profile || showOnboarding) return <Onboarding initialProfile={profile} onFinish={finishOnboarding} onCancel={profile ? () => setShowOnboarding(false) : null} />
  const actualDiscoveries = useMemo(() => discoveredMilestones(discoveries.discoveredIds), [discoveries.discoveredIds])
  const shared = { profile, dailyGoals, totalMeters, currentPace: paceForMeters(totalMeters), history, legacySpecial, weeklySpecials, completionLog, now, discoveredIds: discoveries.discoveredIds, actualDiscoveries }
  return <div className="app app-shell"><div className="viewport">
    {tab === 'today' && <Today {...shared} todayState={todayState} completedCount={completedCount} weeklySpecial={weeklySpecial} specialState={specialState} toggleDaily={toggleDaily} toggleSpecial={toggleWeeklySpecial} changeSpecial={changeWeeklySpecial} />}
    {tab === 'journey' && <Journey {...shared} {...discoveries} />}
    {tab === 'profile' && <Profile {...shared} view={profileView} setView={(view) => navigate('profile', view)} theme={theme} setTheme={setTheme} setProfile={setProfile} reminders={reminders} setReminders={setReminders} restartOnboarding={() => setShowOnboarding(true)} resetAll={resetAll} />}
  </div>{feedback && <div className={`gain ${feedback.detail ? 'gain-detail' : ''}`}><b>+{feedback.meters}m 🌱</b>{feedback.title && <strong>{feedback.title}</strong>}{feedback.detail && <span>{feedback.detail}</span>}</div>}<DiscoveryModal discovery={discoveries.discovery} onClose={discoveries.dismissDiscovery} onOpenJourney={() => navigate('journey')} /><BottomNav tab={tab} setTab={(next) => navigate(next)} /></div>
}

function Onboarding({ initialProfile, onFinish, onCancel }) {
  const [step, setStep] = useState(0), [name, setName] = useState(initialProfile?.name || ''), [categories, setCategories] = useState(initialProfile?.categoryIds || []), [dailyIds, setDailyIds] = useState(initialProfile?.dailyGoalIds || [])
  const dailyOptions = GOAL_LIBRARY.filter((goal) => goal.cadence === 'daily' && categories.includes(goal.category)).sort((a, b) => Number(b.starter) - Number(a.starter))
  const toggle = (items, setItems, id) => setItems(items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  const toggleCategory = (id) => {
    const removing = categories.includes(id)
    toggle(categories, setCategories, id)
    if (removing) setDailyIds((current) => current.filter((goalId) => findGoal(goalId)?.category !== id))
  }
  const canContinue = step === 0 || (step === 1 && name.trim()) || (step === 2 && categories.length > 0) || step === 3
  const next = () => { if (canContinue) step === 3 ? onFinish({ ...initialProfile, name: name.trim(), categoryIds: categories, dailyGoalIds: dailyIds }) : setStep((current) => current + 1) }
  return <form className="simple-onboard" onSubmit={(event) => { event.preventDefault(); next() }}><div className="on-progress"><i style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
    {step === 0 && <section className="on-welcome"><img className="on-logo" src={`${import.meta.env.BASE_URL}art/logo_lockup.png`} alt="My Pace — Small Steps, Big Changes" /><div className="on-mascot"><Mascot mood="onboarding" size="lg" /></div><h1>작은 오늘이,<br />더 나은 나를 만들어요.</h1><p>완벽하지 않아도 괜찮아요.<br />내 페이스로, 조금씩.</p></section>}
    {step === 1 && <section><small className="on-step">1 / 3</small><h1>어떻게 불러드릴까요?</h1><p>이름을 적고 Enter를 누르면 바로 다음으로 갈 수 있어요.</p><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="이름 또는 닉네임" /></section>}
    {step === 2 && <section><small className="on-step">2 / 3</small><h1>어떤 부분을 조금<br />바꿔보고 싶나요?</h1><p>관심 있는 분야를 하나 이상 골라주세요.</p><div className="on-categories">{CATEGORIES.map((category) => <button type="button" key={category.id} className={categories.includes(category.id) ? 'selected' : ''} onClick={() => toggleCategory(category.id)}><span>{category.icon}</span><b>{category.name}</b><small>{category.description}</small></button>)}</div></section>}
    {step === 3 && <section><small className="on-step">3 / 3</small><h1>매일 함께할 작은 목표를 골라볼까요?</h1><p>3개 정도면 충분해요. 지금은 0개로 시작해도 괜찮아요.</p><div className="selection-count">{dailyIds.length}개 선택</div>{dailyIds.length > 5 && <div className="goal-warning">🌿 5개를 넘으면 부담이 될 수 있어요. 오래 이어갈 수 있는 만큼을 추천해요.</div>}<div className="on-goals">{dailyOptions.map((goal) => <button type="button" key={goal.id} className={dailyIds.includes(goal.id) ? 'selected' : ''} onClick={() => toggle(dailyIds, setDailyIds, goal.id)}><i>{iconFor(goal)}</i><span><b>{goal.title}</b><small>{goal.description}</small></span><em>{dailyIds.includes(goal.id) ? '✓' : '○'}</em></button>)}</div></section>}
    <div className="on-actions">{onCancel && step === 0 && <button className="ghost" type="button" onClick={onCancel}>취소</button>}{step > 0 && <button className="ghost" type="button" onClick={() => setStep((current) => current - 1)}>이전</button>}<button className="primary" type="submit" disabled={!canContinue}>{step === 0 ? '시작하기' : step === 3 ? 'My Pace 시작하기' : '다음'}</button></div>
  </form>
}
