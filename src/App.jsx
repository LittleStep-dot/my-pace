import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CATEGORIES, GOAL_LIBRARY, MONTHLY_SPECIALS, STARTER_GOALS } from './data/goals'

const STORAGE = {
  profile: 'myPaceV2Profile',
  history: 'myPaceV2History',
  weekly: 'myPaceV2Weekly',
  special: 'myPaceV2Special',
  theme: 'myPaceV2Theme',
}

const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback } catch { return fallback } }
const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x }
const weekKey = (d = new Date()) => { const x = new Date(d); const day = (x.getDay()+6)%7; x.setDate(x.getDate()-day); return dateKey(x) }
const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
const findGoal = id => GOAL_LIBRARY.find(g => g.id === id)
const km = meters => meters < 1000 ? `${meters} m` : `${(meters/1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km`

const MILESTONES = [
  { m:500, label:'첫 500m', note:'작은 출발이 시작됐어요.' },
  { m:1000, label:'1 km', note:'첫 1km를 내 페이스로 지나왔어요.' },
  { m:3000, label:'3 km', note:'조금씩 리듬이 생기고 있어요.' },
  { m:5000, label:'5 km', note:'꽤 멀리 왔어요.' },
  { m:10000, label:'10 km', note:'두 자릿수 여정에 도착했어요.' },
  { m:21100, label:'21.1 km', note:'하프 마라톤만큼의 여정이에요.' },
  { m:42195, label:'42.195 km', note:'마라톤 한 번만큼 쌓였어요.' },
  { m:100000, label:'100 km', note:'작은 행동이 정말 긴 길이 됐어요.' },
  { m:200000, label:'200 km', note:'꾸준함이 눈에 보이는 거리가 됐어요.' },
  { m:325000, label:'325 km', note:'서울과 부산 사이 직선거리 정도의 긴 여정이에요.' },
]

function Logo(){return <div className="brand"><span className="mark"><i/><i/></span><span><b>My Pace</b><small>A little better, every day.</small></span></div>}
function Buddy({small=false}){return <div className={`buddy ${small?'small':''}`}><span className="buddy-leaf">🌱</span><span className="buddy-face">•‿•</span><span className="buddy-pack">🎒</span></div>}

export default function App(){
  const [now,setNow] = useState(new Date())
  const [profile,setProfile] = useState(()=>safeParse(localStorage.getItem(STORAGE.profile),null))
  const [history,setHistory] = useState(()=>safeParse(localStorage.getItem(STORAGE.history),{}))
  const [weekly,setWeekly] = useState(()=>safeParse(localStorage.getItem(STORAGE.weekly),{}))
  const [special,setSpecial] = useState(()=>safeParse(localStorage.getItem(STORAGE.special),{}))
  const [theme,setTheme] = useState(()=>localStorage.getItem(STORAGE.theme)||'light')
  const [tab,setTab] = useState('today')

  useEffect(()=>{const id=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(id)},[])
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem(STORAGE.theme,theme)},[theme])
  useEffect(()=>localStorage.setItem(STORAGE.history,JSON.stringify(history)),[history])
  useEffect(()=>localStorage.setItem(STORAGE.weekly,JSON.stringify(weekly)),[weekly])
  useEffect(()=>localStorage.setItem(STORAGE.special,JSON.stringify(special)),[special])
  useEffect(()=>{if(profile)localStorage.setItem(STORAGE.profile,JSON.stringify(profile))},[profile])

  const totalMeters = useMemo(()=>{
    let meters = 0
    Object.values(history).forEach(day=>Object.values(day).forEach(v=>{if(v==='done') meters+=200}))
    Object.values(weekly).forEach(v=>{if(v==='done') meters+=1000})
    Object.values(special).forEach(v=>{if(v==='done') meters+=3000})
    return meters
  },[history,weekly,special])

  if(!profile) return <Onboarding onFinish={setProfile}/>

  const dailyGoals = (profile.dailyGoalIds || []).map(findGoal).filter(Boolean)
  const weeklyGoal = findGoal(profile.weeklyGoalId)
  const today = dateKey(now)
  const thisWeek = weekKey(now)
  const thisMonth = monthKey(now)
  const todayState = history[today] || {}
  const completedCount = dailyGoals.filter(g=>todayState[g.id]==='done').length
  const restedCount = dailyGoals.filter(g=>todayState[g.id]==='rest').length
  const monthlySpecial = MONTHLY_SPECIALS[now.getMonth()%MONTHLY_SPECIALS.length]

  const setDailyState = (id,state) => setHistory(prev=>{
    const current = prev[today] || {}
    return {...prev,[today]:{...current,[id]:current[id]===state?undefined:state}}
  })
  const toggleWeekly = ()=>setWeekly(p=>({...p,[thisWeek]:p[thisWeek]==='done'?undefined:'done'}))
  const toggleSpecial = ()=>setSpecial(p=>({...p,[thisMonth]:p[thisMonth]==='done'?undefined:'done'}))

  const twoDayReminder = dailyGoals.find(g=>{
    const y1 = history[dateKey(addDays(now,-1))]?.[g.id]
    const y2 = history[dateKey(addDays(now,-2))]?.[g.id]
    return y1!=='done' && y2!=='done'
  })

  const shared = { profile, dailyGoals, weeklyGoal, monthlySpecial, totalMeters, history, weekly, special, now }

  return <div className="app-shell"><div className="phone-frame">
    {tab==='today' && <Today {...shared} todayState={todayState} completedCount={completedCount} restedCount={restedCount} weeklyDone={weekly[thisWeek]==='done'} specialDone={special[thisMonth]==='done'} setDailyState={setDailyState} toggleWeekly={toggleWeekly} toggleSpecial={toggleSpecial} twoDayReminder={twoDayReminder}/>} 
    {tab==='journey' && <Journey {...shared}/>} 
    {tab==='profile' && <Profile {...shared} theme={theme} setTheme={setTheme} setProfile={setProfile}/>} 
    <Nav tab={tab} setTab={setTab}/>
  </div></div>
}

function Onboarding({onFinish}){
  const [step,setStep]=useState(0)
  const [name,setName]=useState('')
  const [categories,setCategories]=useState([])
  const [dailyIds,setDailyIds]=useState([])
  const [weeklyId,setWeeklyId]=useState('')

  const suggestedDaily = STARTER_GOALS.filter(g=>categories.includes(g.category) && g.cadence==='daily')
  const suggestedWeekly = GOAL_LIBRARY.filter(g=>categories.includes(g.category) && g.cadence==='weekly')

  const toggleCategory=id=>setCategories(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const toggleDaily=id=>setDailyIds(p=>p.includes(id)?p.filter(x=>x!==id):(p.length<5?[...p,id]:p))
  const canNext = step===0 || (step===1 && name.trim()) || (step===2 && categories.length>0) || (step===3 && dailyIds.length===5) || (step===4 && weeklyId)
  const finish=()=>onFinish({name:name.trim(),categoryIds:categories,dailyGoalIds:dailyIds,weeklyGoalId:weeklyId,createdAt:new Date().toISOString(),reminder:'evening'})

  return <div className="onboarding-shell">
    <div className="onboarding-card">
      <div className="on-progress"><i style={{width:`${((step+1)/5)*100}%`}}/></div>
      {step===0 && <section className="welcome">
        <Logo/><div className="welcome-art"><Buddy/></div>
        <h1>작은 오늘이,<br/>더 나은 나를 만들어요.</h1>
        <p>완벽하게 하지 않아도 괜찮아요.<br/>내 페이스로 조금씩 시작해봐요.</p>
      </section>}
      {step===1 && <section><Eyebrow>1 / 4</Eyebrow><h1>어떻게 불러드릴까요?</h1><p className="lead">좋아하는 이름으로 불러드릴게요.</p><input className="name-input" value={name} onChange={e=>setName(e.target.value)} placeholder="이름 또는 닉네임" autoFocus/></section>}
      {step===2 && <section><Eyebrow>2 / 4</Eyebrow><h1>어떤 부분을 조금<br/>바꿔보고 싶나요?</h1><p className="lead">지금 가장 마음이 가는 분야를 골라주세요.</p><div className="category-grid">{CATEGORIES.map(c=><button key={c.id} className={categories.includes(c.id)?'selected':''} onClick={()=>toggleCategory(c.id)}><span>{c.icon}</span><b>{c.name}</b><small>{c.description}</small></button>)}</div></section>}
      {step===3 && <section><Eyebrow>3 / 4</Eyebrow><h1>매일 함께할 작은 목표<br/>5개를 골라볼까요?</h1><p className="lead">처음부터 많이 하지 않아도 괜찮아요. 오래 할 수 있는 목표가 좋아요.</p><div className="selection-count">{dailyIds.length} / 5 선택</div><div className="goal-picker">{suggestedDaily.map(g=><button key={g.id} className={dailyIds.includes(g.id)?'selected':''} onClick={()=>toggleDaily(g.id)}><i>{g.icon}</i><span><b>{g.title}</b><small>{g.description}</small></span><em>{dailyIds.includes(g.id)?'✓':'○'}</em></button>)}</div></section>}
      {step===4 && <section><Eyebrow>4 / 4</Eyebrow><h1>이번 주에 하나만<br/>챙겨볼까요?</h1><p className="lead">매일 하기엔 부담스럽지만, 일주일에 한 번이면 좋은 목표예요.</p><div className="goal-picker">{suggestedWeekly.length?suggestedWeekly.map(g=><button key={g.id} className={weeklyId===g.id?'selected':''} onClick={()=>setWeeklyId(g.id)}><i>{g.icon}</i><span><b>{g.title}</b><small>{g.description}</small></span><em>{weeklyId===g.id?'✓':'○'}</em></button>):<button onClick={()=>setWeeklyId('l19')}><i>🧹</i><span><b>주 1회 청소하기</b><small>완벽한 대청소가 아니어도 괜찮아요.</small></span><em>{weeklyId==='l19'?'✓':'○'}</em></button>}</div></section>}
      <div className="on-actions">{step>0&&<button className="ghost" onClick={()=>setStep(s=>s-1)}>이전</button>}<button className="primary" disabled={!canNext} onClick={()=>step===4?finish():setStep(s=>s+1)}>{step===0?'시작하기':step===4?'My Pace 시작하기':'다음'}</button></div>
    </div>
  </div>
}

function Eyebrow({children}){return <span className="eyebrow">{children}</span>}

function Today({profile,dailyGoals,weeklyGoal,monthlySpecial,totalMeters,todayState,completedCount,restedCount,weeklyDone,specialDone,setDailyState,toggleWeekly,toggleSpecial,twoDayReminder,now}){
  const greeting=now.getHours()<12?'좋은 아침이에요':now.getHours()<18?'좋은 오후예요':'좋은 저녁이에요'
  const paceText=completedCount>=5?'오늘의 다섯 걸음을 모두 챙겼어요!':completedCount>=3?'오늘도 내 페이스였어요.':completedCount>0?'조금씩 잘 가고 있어요.':'오늘도 하나씩 가볼까요?'
  return <main className="page today-page">
    <header className="top"><Logo/><button className="icon-btn">♧</button></header>
    <section className="hero"><div><small>{now.getMonth()+1}월 {now.getDate()}일</small><h1>{greeting},<br/>{profile.name}님! 👋</h1><p>{paceText}</p></div><div className="hero-buddy"><span>오늘도<br/>내 페이스로!</span><Buddy/></div></section>

    <section className="today-card card">
      <div className="section-title"><div><h2>오늘의 목표</h2><p>5개 중 3개면 충분해요.</p></div><strong>{completedCount} / 5 완료</strong></div>
      <div className="today-progress"><i style={{width:`${completedCount/5*100}%`}}/></div>
      <div className="daily-list">{dailyGoals.map(g=>{
        const state=todayState[g.id]
        return <div className={`daily-row ${state||''}`} key={g.id}>
          <i className="goal-icon">{g.icon}</i><span><b>{g.title}</b><small>{g.description}</small></span>
          <button className="rest-btn" onClick={()=>setDailyState(g.id,'rest')}>{state==='rest'?'쉬는 중':'쉬기'}</button>
          <button className="check-btn" onClick={()=>setDailyState(g.id,'done')}>{state==='done'?'✓':''}</button>
        </div>
      })}</div>
      {completedCount>=3 && <div className="good-pace">🌱 오늘도 내 페이스였어요. 지금도 충분히 잘하고 있어요.</div>}
      {restedCount>0 && <div className="rest-note">쉬어가기를 선택한 목표는 실패로 계산하지 않아요.</div>}
    </section>

    {twoDayReminder && <section className="water-card"><span>💧</span><div><b>{twoDayReminder.title}, 조금 쉬었네요.</b><p>오늘은 아주 가볍게 다시 시작해봐도 좋아요.</p></div></section>}

    <section className="mini-journey card"><div><span className="mini-icon">🧭</span><p><small>나의 여정</small><b>{km(totalMeters)}</b><em>오늘의 작은 행동들이 길이 되고 있어요.</em></p></div><strong>›</strong></section>

    <section className="quest-block"><div className="section-title"><div><h2>이번 주 Weekly Quest</h2><p>일주일에 하나만 챙겨요.</p></div><span>{weeklyDone?'완료':'0 / 1'}</span></div>{weeklyGoal&&<button className={`weekly-card card ${weeklyDone?'done':''}`} onClick={toggleWeekly}><i>{weeklyGoal.icon}</i><span><b>{weeklyGoal.title}</b><small>{weeklyGoal.description}</small></span><em>{weeklyDone?'✓':'○'}</em></button>}</section>

    <section className="quest-block"><div className="section-title"><div><h2>이번 달 Special Quest</h2><p>안 해도 괜찮은 작은 도전이에요.</p></div><span>{specialDone?'완료':'선택'}</span></div><button className={`special-card card ${specialDone?'done':''}`} onClick={toggleSpecial}><i>{monthlySpecial.icon}</i><span><b>{monthlySpecial.title}</b><small>{monthlySpecial.description}</small></span><em>{specialDone?'✓':'›'}</em></button></section>
  </main>
}

function Journey({totalMeters,history,dailyGoals,weekly,special}){
  const completedActions=Object.values(history).reduce((sum,day)=>sum+Object.values(day).filter(v=>v==='done').length,0)
  const next=MILESTONES.find(x=>x.m>totalMeters)||MILESTONES[MILESTONES.length-1]
  const prev=[...MILESTONES].reverse().find(x=>x.m<=totalMeters)
  const pct=Math.min(100,totalMeters/next.m*100)
  const recent=[...MILESTONES].filter(x=>x.m<=totalMeters).slice(-3).reverse()
  return <main className="page journey-page">
    <header className="top"><Logo/><button className="icon-btn">♧</button></header>
    <section className="journey-hero"><div className="land"><span className="sun"/><span className="hill h1"/><span className="hill h2"/><span className="road"/><Buddy small/></div><div className="journey-copy"><small>지금까지 걸어온 거리</small><h1>{km(totalMeters)}</h1><p>실제로 달린 거리가 아니라,<br/>지금까지 쌓은 작은 행동의 여정이에요.</p></div></section>
    <section className="next-card card"><div><small>다음 마일스톤</small><b>{next.label}</b><p>{Math.max(0,next.m-totalMeters).toLocaleString()}m 남았어요.</p></div><span>🧭</span><div className="route-progress"><i style={{width:`${pct}%`}}/></div></section>
    <section className="journey-stats"><div><b>{completedActions}</b><small>작은 행동</small></div><div><b>{Object.values(weekly).filter(v=>v==='done').length}</b><small>Weekly 완료</small></div><div><b>{Object.values(special).filter(v=>v==='done').length}</b><small>Special 완료</small></div></section>
    <section className="timeline"><div className="section-title"><div><h2>나의 마일스톤</h2><p>조금씩 멀리 가고 있어요.</p></div></div>{recent.length?recent.map(m=><article key={m.m}><span>✓</span><div><b>{m.label}</b><p>{m.note}</p></div></article>):<article><span>🌱</span><div><b>여정이 막 시작됐어요.</b><p>첫 500m까지 천천히 가봐요.</p></div></article>} {prev?.m>=100000&&<div className="milestone-message">“여기까지 온 것도 모두 작은 하루들이 쌓인 결과예요.”</div>}</section>
  </main>
}

function Profile({profile,dailyGoals,weeklyGoal,totalMeters,theme,setTheme,setProfile}){
  const editName=()=>{const next=prompt('이름을 입력하세요.',profile.name);if(next?.trim())setProfile({...profile,name:next.trim()})}
  const restart=()=>{if(confirm('온보딩부터 다시 설정할까요? 기록은 그대로 남아 있어요.')){localStorage.removeItem(STORAGE.profile);setProfile(null)}}
  return <main className="page profile-page">
    <header className="profile-head"><Logo/><button className="icon-btn">⚙</button></header>
    <section className="profile-hero"><div className="avatar"><Buddy/></div><h1>{profile.name}님</h1><p>오늘도, 나의 페이스로! 💚</p></section>
    <section className="profile-summary card"><div><b>{km(totalMeters)}</b><small>나의 여정</small></div><div><b>{dailyGoals.length}</b><small>Daily 목표</small></div><div><b>1</b><small>Weekly 목표</small></div></section>
    <section className="settings card">
      <button onClick={editName}><i>👤</i><span><b>내 정보</b><small>{profile.name}</small></span><em>›</em></button>
      <button><i>🎯</i><span><b>나의 목표</b><small>Daily 5개 · Weekly 1개</small></span><em>›</em></button>
      <button><i>🔔</i><span><b>알림 설정</b><small>점심 후 / 퇴근 후 알림은 다음 단계에서 연결해요.</small></span><em>›</em></button>
      <button onClick={()=>setTheme(theme==='light'?'dark':'light')}><i>{theme==='light'?'🌙':'☀️'}</i><span><b>테마 모드</b><small>{theme==='light'?'라이트':'다크'}</small></span><em>›</em></button>
      <button onClick={restart}><i>↻</i><span><b>처음 목표 다시 설정하기</b><small>온보딩만 다시 진행해요.</small></span><em>›</em></button>
    </section>
    <section className="my-goals"><div className="section-title"><div><h2>현재 나의 목표</h2><p>{weeklyGoal?.title}</p></div></div>{dailyGoals.map(g=><span key={g.id}>{g.icon} {g.title}</span>)}</section>
    <p className="closing-copy">비교하지 않고,<br/>어제의 나와 조금씩 멀리.</p>
  </main>
}

function Nav({tab,setTab}){return <nav className="bottom-nav">{[['today','⌂','오늘'],['journey','⌁','여정'],['profile','♙','프로필']].map(([id,icon,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>}
