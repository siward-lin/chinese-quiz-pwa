import { useEffect, useMemo, useRef, useState } from 'react'
import { subjects, questions } from './data/questions.js'
import { generateMathQuestions, mathUnits } from './data/mathGenerators.js'

const quotes = {
  correct: ['觀念掌握得很穩，繼續前進！','答對了，這一步走得很扎實。','你正在把知識變成自己的能力。','每一次正確推理，都是實力的累積。'],
  wrong: ['這題先記下來，理解解析後再試一次。','看懂錯誤原因，比只記答案更重要。','慢慢來，把每個步驟確認清楚。','錯題不是終點，而是下一次答對的起點。'],
}
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
const shuffled = a => [...a].sort(() => Math.random() - 0.5)

export default function App() {
  const [screen,setScreen]=useState('home'), [sid,setSid]=useState(''), [division,setDivision]=useState('全部'), [unit,setUnit]=useState('全部'), [level,setLevel]=useState('全部'), [count,setCount]=useState(10), [mode,setMode]=useState('static')
  const [quiz,setQuiz]=useState([]), [idx,setIdx]=useState(0), [picked,setPicked]=useState(null), [records,setRecords]=useState([]), [seconds,setSeconds]=useState(0), [questionStart,setQuestionStart]=useState(0), [score,setScore]=useState(0), [streak,setStreak]=useState(0), [bestStreak,setBestStreak]=useState(0), [message,setMessage]=useState('')
  const timer=useRef(null)
  const subject=subjects.find(s=>s.id===sid)
  const subjectQuestions=questions.filter(q=>q.subject===sid)
  const divisions=[...new Set(subjectQuestions.map(q=>q.division))]
  const unitOptions=sid==='math'&&mode==='randomMath'?mathUnits:[...new Set(subjectQuestions.filter(q=>division==='全部'||q.division===division).map(q=>q.unit))]
  const filtered=useMemo(()=>subjectQuestions.filter(q=>(division==='全部'||q.division===division)&&(unit==='全部'||q.unit===unit)&&(level==='全部'||q.level===level)),[sid,division,unit,level])
  const current=quiz[idx]
  useEffect(()=>()=>clearInterval(timer.current),[])

  const home=()=>{clearInterval(timer.current);setScreen('home');setSid('');setRecords([]);setPicked(null)}
  const open=s=>{if(!questions.some(q=>q.subject===s.id)&&s.id!=='math')return;setSid(s.id);setDivision('全部');setUnit('全部');setLevel('全部');setMode(s.id==='math'?'randomMath':'static');setScreen('setup')}
  const startTimer=()=>{clearInterval(timer.current);setSeconds(0);setQuestionStart(0);timer.current=setInterval(()=>setSeconds(v=>v+1),1000)}
  const start=()=>{const source=sid==='math'&&mode==='randomMath'?generateMathQuestions(count,unit):shuffled(filtered).slice(0,Math.min(count,filtered.length));setQuiz(source);setIdx(0);setPicked(null);setRecords([]);setScore(0);setStreak(0);setBestStreak(0);setMessage('');setScreen('quiz');startTimer()}
  const choose=x=>{if(picked!==null)return;setPicked(x);const ok=x===current.answer;const ns=ok?streak+1:0;const bonus=ok?Math.min(40,Math.max(0,(ns-1)*10)):0;setScore(v=>v+(ok?100+bonus:0));setStreak(ns);setBestStreak(v=>Math.max(v,ns));const list=ok?quotes.correct:quotes.wrong;setMessage(list[Math.floor(Math.random()*list.length)])}
  const next=()=>{const r={...current,chosen:picked,correct:picked===current.answer,seconds:seconds-questionStart};const nr=[...records,r];setRecords(nr);if(idx+1===quiz.length){clearInterval(timer.current);setScreen('result')}else{setIdx(v=>v+1);setPicked(null);setQuestionStart(seconds);setMessage('')}}
  const currentCorrect=records.filter(r=>r.correct).length+(screen==='quiz'&&picked===current?.answer?1:0)

  return <div className="app">
    <header><div className="bar"><button className="brand" onClick={home}>學</button><div><h1>國一全科練習平台</h1><small>115學年度・七年級上學期</small></div>{screen!=='home'&&<button className="ghost" onClick={home}>全科首頁</button>}</div></header>
    {screen==='home'&&<main><section className="hero"><span>全科整合版</span><h2>選一科，開始今天的學習任務。</h2><p>國文、數學、社會與自然使用原創固定題庫；數學另提供 1-1 至 1-4 動態隨機題型。</p></section><div className="subject-grid">{subjects.map(s=>{const n=questions.filter(q=>q.subject===s.id).length;const enabled=n>0||s.id==='math';return <button key={s.id} disabled={!enabled} onClick={()=>open(s)} className={`subject ${enabled?'':'disabled'}`}><i style={{background:s.color}}>{s.icon}</i><div className="subject-title"><h3>{s.name}</h3><em>{enabled?(s.id==='math'?'固定＋隨機':`${n} 題`):'等待教材'}</em></div><p>{s.description}</p><strong style={{color:s.color}}>{enabled?'進入練習 →':'尚未啟用'}</strong></button>})}</div></main>}
    {screen==='setup'&&subject&&<main><section className="subject-hero" style={{background:subject.color}}><span>七年級上學期</span><h2>{subject.name}練習</h2><p>{subject.description}</p></section><section className="panel"><div className="filters">{sid==='math'&&<label>出題模式<select value={mode} onChange={e=>{setMode(e.target.value);setUnit('全部')}}><option value="randomMath">動態隨機題型</option><option value="static">固定題庫</option></select></label>}{divisions.length>1&&mode==='static'&&<label>分科<select value={division} onChange={e=>{setDivision(e.target.value);setUnit('全部')}}><option>全部</option>{divisions.map(x=><option key={x}>{x}</option>)}</select></label>}<label>單元<select value={unit} onChange={e=>setUnit(e.target.value)}><option>全部</option>{unitOptions.map(x=><option key={x}>{x}</option>)}</select></label>{mode==='static'&&<label>難度<select value={level} onChange={e=>setLevel(e.target.value)}><option>全部</option><option>基礎</option><option>進階</option><option>挑戰</option></select></label>}<label>題數<select value={count} onChange={e=>setCount(Number(e.target.value))}><option>5</option><option>10</option><option>15</option><option>20</option></select></label></div><div className="notice"><b>計分：</b>答對 100 分，連續答對另加 10 至 40 分；不因思考時間較久扣分。</div><button className="start" disabled={mode==='static'&&!filtered.length} onClick={start}>開始練習</button></section></main>}
    {screen==='quiz'&&current&&<main className="narrow"><div className="quiztop"><b>第 {idx+1}/{quiz.length} 題</b><b>時間 {fmt(seconds)}</b><b>答對 {currentCorrect} 題</b><b>分數 {score}</b><b>連勝 {streak}</b></div><div className="progress"><i style={{width:`${(idx+1)/quiz.length*100}%`}}/></div><section className="panel"><div className="chips"><span>{current.division}</span><span>{current.unit}</span><span>{current.type||current.level}</span></div>{current.passage&&<blockquote>{current.passage}</blockquote>}<h2 className="question">{current.question}</h2><div className="options">{current.options.map((o,x)=>{let c='';if(picked!==null&&x===current.answer)c='correct';else if(picked===x)c='wrong';else if(picked!==null)c='muted';return <button className={c} disabled={picked!==null} onClick={()=>choose(x)} key={`${o}-${x}`}><b>{String.fromCharCode(65+x)}.</b>{o}</button>})}</div>{picked!==null&&<div className={`feedback ${picked===current.answer?'ok':'no'}`}><b>{picked===current.answer?'答對了！':'再看一次解析'}</b><p className="quote">{message}</p><p>{current.explanation}</p></div>}<div className="next"><button disabled={picked===null} onClick={next}>{idx+1===quiz.length?'查看成績':'下一題'}</button></div></section></main>}
    {screen==='result'&&<main className="narrow"><section className="panel result"><h2>練習完成</h2><div className="score">{score}<small> 分</small></div><p>答對 {records.filter(r=>r.correct).length}/{quiz.length} 題，答對率 {Math.round(records.filter(r=>r.correct).length/quiz.length*100)}%</p><p>總時間 {fmt(seconds)}，平均每題 {Math.round(seconds/quiz.length)} 秒，最長連勝 {bestStreak} 題</p><blockquote>願意重新挑戰錯題，就是把錯誤轉化成能力的開始。</blockquote><div className="review"><h3>錯題回顧</h3>{records.filter(r=>!r.correct).map((r,i)=><article key={`${r.id}-${i}`}><b>{r.question}</b><p className="red">你的答案：{r.options[r.chosen]}</p><p className="green">正確答案：{r.options[r.answer]}</p><p>{r.explanation}</p><small>本題用時 {r.seconds} 秒</small></article>)}</div><div className="actions"><button onClick={()=>setScreen('setup')}>返回本科</button><button className="gold" onClick={start}>再來一組</button></div></section></main>}
  </div>
}
