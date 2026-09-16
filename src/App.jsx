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
const safeParse=(v,f)=>{try{return v?JSON.parse(v):f}catch{return f}}
const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const monthKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
const weekKey=(d=new Date())=>{const x=new Date(d),day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);return dateKey(x)}
const findGoal=id=>GOAL_LIBRARY.find(g=>g.id===id)
const doneCount=obj=>Object.values(obj).reduce((s,e)=>s+(e==='done'?1:e&&typeof e==='object'?Object.values(e).filter(v=>v==='done').length:0),0)
export const iconFor=g=>({g02:'🔤',c04:'🎧'}[g?.id]||g?.icon||'🌱')
export const distance=m=>m<1000?`${m} m`:`${(m/1000).toFixed(m%1000===0?0:m<10000?2:1)} km`
export const MILESTONES=[100,500,1000,3000,5000,10000,15000,21100,30000,42195,50000,75000,100000]

export default function App(){
 const [now,setNow]=useState(new Date()),[profile,setProfile]=useState(()=>safeParse(localStorage.getItem(STORAGE.profile),null)),[history,setHistory]=useState(()=>safeParse(localStorage.getItem(STORAGE.history),{})),[weekly,setWeekly]=useState(()=>safeParse(localStorage.getItem(STORAGE.weekly),{})),[monthly,setMonthly]=useState(()=>safeParse(localStorage.getItem(STORAGE.monthly),{})),[special,setSpecial]=useState(()=>safeParse(localStorage.getItem(STORAGE.special),{})),[theme,setTheme]=useState(()=>localStorage.getItem(STORAGE.theme)||'auto'),[tab,setTab]=useState('today'),[gain,setGain]=useState(null)
 useEffect(()=>{const id=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(id)},[])
 useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const apply=()=>document.documentElement.dataset.theme=theme==='auto'?(media.matches?'dark':'light'):theme;apply();localStorage.setItem(STORAGE.theme,theme);media.addEventListener?.('change',apply);return()=>media.removeEventListener?.('change',apply)},[theme])
 useEffect(()=>localStorage.setItem(STORAGE.history,JSON.stringify(history)),[history]);useEffect(()=>localStorage.setItem(STORAGE.weekly,JSON.stringify(weekly)),[weekly]);useEffect(()=>localStorage.setItem(STORAGE.monthly,JSON.stringify(monthly)),[monthly]);useEffect(()=>localStorage.setItem(STORAGE.special,JSON.stringify(special)),[special]);useEffect(()=>{if(profile)localStorage.setItem(STORAGE.profile,JSON.stringify(profile))},[profile])
 const totalMeters=useMemo(()=>{let m=0;Object.values(history).forEach(day=>{const n=Object.values(day).filter(v=>v==='done').length;m+=n*20;if(n>=3)m+=10});m+=doneCount(weekly)*100;m+=doneCount(monthly)*500;Object.values(special).forEach(v=>{if(v==='done')m+=50});return m},[history,weekly,monthly,special])
 if(!profile)return <Onboarding onFinish={setProfile}/>
 const dailyGoals=(profile.dailyGoalIds||[]).map(findGoal).filter(Boolean),weeklyIds=profile.weeklyGoalIds||(profile.weeklyGoalId?[profile.weeklyGoalId]:[]),weeklyGoals=weeklyIds.map(findGoal).filter(g=>g&&!MONTHLY_IDS.has(g.id)),monthlyIds=profile.monthlyGoalIds?.length?profile.monthlyGoalIds:weeklyIds.filter(id=>MONTHLY_IDS.has(id)),monthlyGoals=monthlyIds.map(findGoal).filter(Boolean)
 const today=dateKey(now),wk=weekKey(now),mo=monthKey(now),todayState=history[today]||{},weeklyState=weekly[wk]||{},monthlyState=monthly[mo]||{},completedCount=dailyGoals.filter(g=>todayState[g.id]==='done').length,dayIndex=Math.floor(new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()/86400000),dailySpecial=MONTHLY_SPECIALS[Math.abs(dayIndex)%MONTHLY_SPECIALS.length]
 const flash=n=>{setGain(n);setTimeout(()=>setGain(null),850)}
 const toggleDaily=id=>setHistory(p=>{const c=p[today]||{},next=c[id]==='done'?undefined:'done',before=Object.values(c).filter(v=>v==='done').length,after=Object.values({...c,[id]:next}).filter(v=>v==='done').length;if(next==='done')flash(20+(before<3&&after>=3?10:0));return{...p,[today]:{...c,[id]:next}}})
 const togglePeriod=(setter,key,id,reward)=>setter(p=>{const c=p[key]||{},next=c[id]==='done'?undefined:'done';if(next==='done')flash(reward);return{...p,[key]:{...c,[id]:next}}})
 const toggleSpecial=()=>setSpecial(p=>{const next=p[today]==='done'?undefined:'done';if(next==='done')flash(50);return{...p,[today]:next}})
 const shared={profile,dailyGoals,weeklyGoals,monthlyGoals,dailySpecial,totalMeters,history,weekly,monthly,special,now}
 return <div className="app"><div className="viewport">{tab==='today'&&<Today {...shared} todayState={todayState} completedCount={completedCount} weeklyState={weeklyState} monthlyState={monthlyState} specialDone={special[today]==='done'} toggleDaily={toggleDaily} toggleWeekly={id=>togglePeriod(setWeekly,wk,id,100)} toggleMonthly={id=>togglePeriod(setMonthly,mo,id,500)} toggleSpecial={toggleSpecial}/>} {tab==='journey'&&<Journey {...shared}/>} {tab==='profile'&&<Profile {...shared} theme={theme} setTheme={setTheme} setProfile={setProfile}/>}</div>{gain&&<div className="gain">+{gain}m 🌱</div>}<BottomNav tab={tab} setTab={setTab}/></div>
}

function Onboarding({onFinish}){const[name,setName]=useState('');return <div className="simple-onboard"><div className="sprout-logo">🌱 <b>My Pace</b></div><div className="on-mascot">🌱</div><h1>작은 오늘이,<br/>더 나은 나를 만들어요.</h1><p>완벽하지 않아도 괜찮아요.<br/>내 페이스로, 조금씩.</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="이름 또는 닉네임"/><button disabled={!name.trim()} onClick={()=>onFinish({name:name.trim(),categoryIds:CATEGORIES.slice(0,3).map(x=>x.id),dailyGoalIds:GOAL_LIBRARY.filter(g=>g.cadence==='daily').slice(0,5).map(g=>g.id),weeklyGoalIds:[],monthlyGoalIds:[],createdAt:new Date().toISOString()})}>My Pace 시작하기</button></div>}
