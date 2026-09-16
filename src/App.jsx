import { useEffect, useMemo, useState } from 'react'
import './styles/app.css'
import './styles/artwork.css'
import { CATEGORIES, GOAL_LIBRARY, MONTHLY_SPECIALS } from './data/goals'
import Today from './pages/Today'
import Journey from './pages/Journey'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

const STORAGE={profile:'myPaceV2Profile',history:'myPaceV2History',weekly:'myPaceV2Weekly',monthly:'myPaceV2Monthly',special:'myPaceV2Special',theme:'myPaceV2Theme'}
const MONTHLY_IDS=new Set(['h18','l20','g20','m20','r19','r20','c19','c20','e18','e19'])
const cadenceOf=g=>MONTHLY_IDS.has(g.id)?'monthly':g.cadence
export const MILESTONES=[100,500,1000,3000,5000,10000,15000,21100,30000,42195,50000,75000,100000]
export const distance=m=>m>=1000?`${Number((m/1000).toFixed(m%1000?1:0))}km`:`${m}m`
export const iconFor=g=>({health:'🏋️',life:'🏠',growth:'📖',mind:'💚',relationship:'👥',career:'💻',hobby:'✨'}[g.category]||'🌱')
const read=(k,fallback)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fallback}catch{return fallback}}
const goalsBy=c=>GOAL_LIBRARY.filter(g=>cadenceOf(g)===c)
function App(){
 const [profile,setProfile]=useState(()=>read(STORAGE.profile,null));const [history,setHistory]=useState(()=>read(STORAGE.history,{}));const [weekly,setWeekly]=useState(()=>read(STORAGE.weekly,{}));const [monthly,setMonthly]=useState(()=>read(STORAGE.monthly,{}));const [special,setSpecial]=useState(()=>read(STORAGE.special,{}));const [theme,setTheme]=useState(()=>localStorage.getItem(STORAGE.theme)||'auto');const [tab,setTab]=useState('today');const [gain,setGain]=useState(null);const [name,setName]=useState('');const [now,setNow]=useState(new Date())
 useEffect(()=>{const t=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(t)},[])
 useEffect(()=>{if(profile)localStorage.setItem(STORAGE.profile,JSON.stringify(profile))},[profile]);useEffect(()=>localStorage.setItem(STORAGE.history,JSON.stringify(history)),[history]);useEffect(()=>localStorage.setItem(STORAGE.weekly,JSON.stringify(weekly)),[weekly]);useEffect(()=>localStorage.setItem(STORAGE.monthly,JSON.stringify(monthly)),[monthly]);useEffect(()=>localStorage.setItem(STORAGE.special,JSON.stringify(special)),[special]);useEffect(()=>{localStorage.setItem(STORAGE.theme,theme);const dark=theme==='dark'||(theme==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light'},[theme])
 const today=now.toISOString().slice(0,10),weekKey=`${now.getFullYear()}-W${Math.ceil((((now-new Date(now.getFullYear(),0,1))/86400000)+new Date(now.getFullYear(),0,1).getDay()+1)/7)}`,monthKey=today.slice(0,7)
 const dailyGoals=useMemo(()=>{if(!profile)return[];return GOAL_LIBRARY.filter(g=>(profile.dailyGoalIds||[]).includes(g.id))},[profile]);const todayState=history[today]||{};const completedCount=dailyGoals.filter(g=>todayState[g.id]==='done').length
 const flash=n=>{setGain(n);setTimeout(()=>setGain(null),850)}
 const toggleDaily=id=>setHistory(prev=>{const current=prev[today]||{},next=current[id]==='done'?undefined:'done',before=Object.values(current).filter(v=>v==='done').length,after=Object.values({...current,[id]:next}).filter(v=>v==='done').length;if(next==='done')flash(20+(before<3&&after>=3?10:0));return{...prev,[today]:{...current,[id]:next}}})
 const togglePeriod=(setter,key,id,reward)=>setter(p=>{const current=p[key]&&typeof p[key]==='object'?p[key]:{},next=current[id]==='done'?undefined:'done';if(next==='done')flash(reward);return{...p,[key]:{...current,[id]:next}}})
 const specialQuest=MONTHLY_SPECIALS[Math.abs([...today].reduce((a,c)=>a+c.charCodeAt(0),0))%MONTHLY_SPECIALS.length],specialDone=special[today]==='done';const toggleSpecial=()=>setSpecial(p=>{const next=p[today]==='done'?undefined:'done';if(next==='done')flash(50);return{...p,[today]:next}})
 const totalMeters=useMemo(()=>{let m=0;Object.values(history).forEach(day=>{const done=Object.values(day).filter(v=>v==='done').length;m+=done*20;if(done>=3)m+=10});Object.values(weekly).forEach(w=>m+=Object.values(w||{}).filter(v=>v==='done').length*100);Object.values(monthly).forEach(x=>m+=Object.values(x||{}).filter(v=>v==='done').length*500);Object.values(special).forEach(v=>{if(v==='done')m+=50});return m},[history,weekly,monthly,special])
 if(!profile)return <div className="simple-onboard"><div className="sprout-logo">🌱 <b>My Pace</b></div><div className="on-mascot">🌱</div><h1>내 페이스로,<br/>조금씩.</h1><p>완벽하지 않아도 괜찮아요.<br/>작은 행동부터 시작해볼까요?</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="이름을 알려주세요"/><button disabled={!name.trim()} onClick={()=>setProfile({name:name.trim(),dailyGoalIds:goalsBy('daily').slice(0,5).map(g=>g.id),weeklyGoalIds:goalsBy('weekly').slice(0,3).map(g=>g.id),monthlyGoalIds:goalsBy('monthly').slice(0,1).map(g=>g.id)})}>시작하기</button></div>
 return <div className="app"><div className="viewport">{tab==='today'&&<Today profile={profile} dailyGoals={dailyGoals} todayState={todayState} completedCount={completedCount} toggleDaily={toggleDaily} now={now} dailySpecial={specialQuest} specialDone={specialDone} toggleSpecial={toggleSpecial}/>} {tab==='journey'&&<Journey totalMeters={totalMeters} history={history}/>} {tab==='profile'&&<Profile profile={profile} totalMeters={totalMeters} theme={theme} setTheme={setTheme} setProfile={setProfile} history={history}/>}</div><BottomNav tab={tab} setTab={setTab}/>{gain&&<div className="gain">+{gain}m 🌱</div>}</div>
}
export default App
