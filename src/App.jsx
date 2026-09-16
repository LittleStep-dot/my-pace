import { useEffect, useMemo, useState } from 'react'
import './styles/app.css'
import './styles/integration.css'
import { CATEGORIES, GOAL_LIBRARY, MONTHLY_SPECIALS } from './data/goals'
import Today from './pages/Today'
import Journey from './pages/Journey'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'
import Mascot from './components/Mascot'

const STORAGE={profile:'myPaceV2Profile',history:'myPaceV2History',weekly:'myPaceV2Weekly',monthly:'myPaceV2Monthly',special:'myPaceV2Special',theme:'myPaceV2Theme'}
const safeParse=(v,f)=>{try{return v?JSON.parse(v):f}catch{return f}}
const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const findGoal=id=>GOAL_LIBRARY.find(g=>g.id===id)
const doneCount=obj=>Object.values(obj).reduce((s,e)=>s+(e==='done'?1:e&&typeof e==='object'?Object.values(e).filter(v=>v==='done').length:0),0)
export const iconFor=g=>({g02:'🔤',c04:'🎧'}[g?.id]||g?.icon||'🌱')
export const distance=m=>m<1000?`${m} m`:`${(m/1000).toFixed(m%1000===0?0:m<10000?2:1)} km`
export const MILESTONES=[100,500,1000,3000,5000,10000,15000,21100,30000,42195,50000,75000,100000]

export default function App(){
 const [now,setNow]=useState(new Date()),[profile,setProfile]=useState(()=>safeParse(localStorage.getItem(STORAGE.profile),null)),[history,setHistory]=useState(()=>safeParse(localStorage.getItem(STORAGE.history),{})),[weekly]=useState(()=>safeParse(localStorage.getItem(STORAGE.weekly),{})),[monthly]=useState(()=>safeParse(localStorage.getItem(STORAGE.monthly),{})),[special,setSpecial]=useState(()=>safeParse(localStorage.getItem(STORAGE.special),{})),[theme,setTheme]=useState(()=>localStorage.getItem(STORAGE.theme)||'auto'),[tab,setTab]=useState('today'),[gain,setGain]=useState(null)
 useEffect(()=>{const id=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(id)},[])
 useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const apply=()=>document.documentElement.dataset.theme=theme==='auto'?(media.matches?'dark':'light'):theme;apply();localStorage.setItem(STORAGE.theme,theme);media.addEventListener?.('change',apply);return()=>media.removeEventListener?.('change',apply)},[theme])
 useEffect(()=>localStorage.setItem(STORAGE.history,JSON.stringify(history)),[history]);useEffect(()=>localStorage.setItem(STORAGE.weekly,JSON.stringify(weekly)),[weekly]);useEffect(()=>localStorage.setItem(STORAGE.monthly,JSON.stringify(monthly)),[monthly]);useEffect(()=>localStorage.setItem(STORAGE.special,JSON.stringify(special)),[special]);useEffect(()=>{if(profile)localStorage.setItem(STORAGE.profile,JSON.stringify(profile))},[profile])
 const totalMeters=useMemo(()=>{let m=0;Object.values(history).forEach(day=>{const n=Object.values(day).filter(v=>v==='done').length;m+=n*20;if(n>=3)m+=10});m+=doneCount(weekly)*100;m+=doneCount(monthly)*500;Object.values(special).forEach(v=>{if(v==='done')m+=50});return m},[history,weekly,monthly,special])
 if(!profile)return <Onboarding onFinish={setProfile}/>
 const dailyGoals=(profile.dailyGoalIds||[]).map(findGoal).filter(Boolean)
 const today=dateKey(now),todayState=history[today]||{},completedCount=dailyGoals.filter(g=>todayState[g.id]==='done').length,dayIndex=Math.floor(new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()/86400000),dailySpecial=MONTHLY_SPECIALS[Math.abs(dayIndex)%MONTHLY_SPECIALS.length]
 const flash=n=>{setGain(n);setTimeout(()=>setGain(null),850)}
 const toggleDaily=id=>setHistory(p=>{const c=p[today]||{},next=c[id]==='done'?undefined:'done',before=Object.values(c).filter(v=>v==='done').length,after=Object.values({...c,[id]:next}).filter(v=>v==='done').length;if(next==='done')flash(20+(before<3&&after>=3?10:0));return{...p,[today]:{...c,[id]:next}}})
 const toggleSpecial=()=>setSpecial(p=>{const next=p[today]==='done'?undefined:'done';if(next==='done')flash(50);return{...p,[today]:next}})
 const shared={profile,dailyGoals,dailySpecial,totalMeters,history,special,now}
 return <div className="app app-shell"><div className="viewport">{tab==='today'&&<Today {...shared} todayState={todayState} completedCount={completedCount} specialDone={special[today]==='done'} toggleDaily={toggleDaily} toggleSpecial={toggleSpecial}/>} {tab==='journey'&&<Journey {...shared}/>} {tab==='profile'&&<Profile {...shared} theme={theme} setTheme={setTheme} setProfile={setProfile}/>}</div>{gain&&<div className="gain">+{gain}m 🌱</div>}<BottomNav tab={tab} setTab={setTab}/></div>
}

function Onboarding({onFinish}){
 const[step,setStep]=useState(0),[name,setName]=useState(''),[categories,setCategories]=useState([]),[dailyIds,setDailyIds]=useState([])
 const dailyOptions=GOAL_LIBRARY.filter(goal=>goal.cadence==='daily'&&categories.includes(goal.category)).sort((a,b)=>Number(b.starter)-Number(a.starter))
 const toggle=(items,setItems,id)=>setItems(items.includes(id)?items.filter(item=>item!==id):[...items,id])
 const canContinue=step===0||(step===1&&name.trim())||(step===2&&categories.length>0)||step===3
 const finish=()=>onFinish({name:name.trim(),categoryIds:categories,dailyGoalIds:dailyIds,weeklyGoalIds:[],monthlyGoalIds:[],createdAt:new Date().toISOString()})
 return <div className="simple-onboard">
  <div className="on-progress"><i style={{width:`${((step+1)/4)*100}%`}}/></div>
  {step===0&&<section className="on-welcome"><img className="on-logo" src={`${import.meta.env.BASE_URL}logo-final.svg`} alt="My Pace"/><div className="on-mascot"><Mascot mood="idle" size="lg"/></div><h1>작은 오늘이,<br/>더 나은 나를 만들어요.</h1><p>완벽하지 않아도 괜찮아요.<br/>내 페이스로, 조금씩.</p></section>}
  {step===1&&<section><small className="on-step">1 / 3</small><h1>어떻게 불러드릴까요?</h1><p>좋아하는 이름으로 불러드릴게요.</p><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="이름 또는 닉네임"/></section>}
  {step===2&&<section><small className="on-step">2 / 3</small><h1>어떤 부분을 조금<br/>바꿔보고 싶나요?</h1><p>관심 있는 분야를 하나 이상 골라주세요.</p><div className="on-categories">{CATEGORIES.map(category=><button type="button" key={category.id} className={categories.includes(category.id)?'selected':''} onClick={()=>toggle(categories,setCategories,category.id)}><span>{category.icon}</span><b>{category.name}</b><small>{category.description}</small></button>)}</div></section>}
  {step===3&&<section><small className="on-step">3 / 3</small><h1>매일 함께할 작은 목표를 골라볼까요?</h1><p>3개 정도면 충분해요. 지금은 0개로 시작해도 괜찮아요.</p><div className="selection-count">{dailyIds.length}개 선택</div>{dailyIds.length>5&&<div className="goal-warning">🌿 5개를 넘으면 부담이 될 수 있어요. 오래 이어갈 수 있는 만큼을 추천해요.</div>}<div className="on-goals">{dailyOptions.map(goal=><button type="button" key={goal.id} className={dailyIds.includes(goal.id)?'selected':''} onClick={()=>toggle(dailyIds,setDailyIds,goal.id)}><i>{iconFor(goal)}</i><span><b>{goal.title}</b><small>{goal.description}</small></span><em>{dailyIds.includes(goal.id)?'✓':'○'}</em></button>)}</div></section>}
  <div className="on-actions">{step>0&&<button className="ghost" type="button" onClick={()=>setStep(current=>current-1)}>이전</button>}<button className="primary" type="button" disabled={!canContinue} onClick={()=>step===3?finish():setStep(current=>current+1)}>{step===0?'시작하기':step===3?'My Pace 시작하기':'다음'}</button></div>
 </div>
}
