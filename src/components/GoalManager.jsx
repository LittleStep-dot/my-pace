import { useState } from 'react'
import { GOAL_LIBRARY } from '../data/goals'
import { iconFor } from '../App'
import BackButton from './BackButton'
import { DAILY_GOAL_LIMIT } from '../lib/pace'
const dailyGoals=GOAL_LIBRARY.filter(goal=>goal.cadence==='daily')
export default function GoalManager({profile,save,cancel}){const[daily,setDaily]=useState((profile.dailyGoalIds||[]).slice(0,DAILY_GOAL_LIMIT)),toggle=id=>setDaily(current=>current.includes(id)?current.filter(item=>item!==id):current.length>=DAILY_GOAL_LIMIT?current:[...current,id]);return <section className="goal-manager"><div className="manager-head"><BackButton onClick={cancel}/><div><h1>나의 목표</h1><p>Daily Goal은 최대 5개, 3개 정도면 충분해요.</p></div></div><div className="goal-guide"><b>{daily.length} / {DAILY_GOAL_LIMIT}개 선택</b><span> · 0개로 두어도 괜찮아요.</span></div><div className="goal-picker manager-list">{dailyGoals.map(goal=><button key={goal.id} className={daily.includes(goal.id)?'selected':''} onClick={()=>toggle(goal.id)}><i>{iconFor(goal)}</i><span><b>{goal.title}</b><small>{goal.description}</small></span><em>{daily.includes(goal.id)?'✓':'○'}</em></button>)}</div><div className="manager-actions"><button onClick={cancel}>취소</button><button className="save" onClick={()=>save({...profile,dailyGoalIds:daily})}>변경 저장</button></div></section>}
