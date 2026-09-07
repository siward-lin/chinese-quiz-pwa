import { useMemo, useState } from 'react'

const questions = [
  { id: 101, unit: '第一課 夏夜', level: '基礎', q: '〈夏夜〉主要採用哪一種視角觀察自然景物？', options: ['科學研究者的分析視角', '兒童純真而富想像力的視角', '歷史記錄者的客觀視角', '新聞記者的採訪視角'], answer: 1, explain: '本課以兒童般的觀察與想像描寫夏夜，使自然景物充滿童趣與生命力。' },
  { id: 102, unit: '第一課 夏夜', level: '基礎', q: '依本課內容，夏夜景物的氣氛大致如何變化？', options: ['由寧靜轉為緊張', '由悲傷轉為歡樂', '由活潑熱鬧逐漸轉為安靜', '由明亮轉為喧鬧'], answer: 2, explain: '詩中先描寫萬物活動與夏夜來臨，後段再寫人物、動物與田野逐漸入睡。' },
  { id: 103, unit: '第一課 夏夜', level: '基礎', q: '下列何者最能說明「擬人」的特色？', options: ['把兩種事物直接相比', '故意把事物說得超過實際', '讓非人物具有人的動作或情態', '將相反情況並列比較'], answer: 2, explain: '擬人是把自然物、動物或抽象事物寫得像人一樣能行動、說話或表現情態。' },
  { id: 104, unit: '第一課 夏夜', level: '進階', q: '若把螢火蟲寫成「提著小燈巡遊」，這種寫法的主要效果為何？', options: ['精確說明昆蟲構造', '賦予景物動態與童話感', '證明夜晚十分危險', '強調作者害怕昆蟲'], answer: 1, explain: '將螢火蟲的光點想像成手提燈，使畫面更生動，也符合童詩的想像特色。' },
  { id: 105, unit: '第一課 夏夜', level: '進階', q: '詩中反覆出現相近的呼喚與動作句式，最主要的作用是什麼？', options: ['增加艱深詞語', '形成節奏並強調夏夜逐步來臨', '交代作者生平', '改變文章為議論文'], answer: 1, explain: '反覆與相近句式形成兒歌般的韻律，也讓景物依序出現的過程更鮮明。' },
  { id: 106, unit: '第一課 夏夜', level: '進階', q: '從太陽西沉、街燈亮起到萬物入睡，這種安排主要依據什麼順序？', options: ['人物年齡', '事情重要程度', '時間推移', '字數多寡'], answer: 2, explain: '本詩以黃昏到深夜的時間推移串連景物。' },
  { id: 107, unit: '第一課 夏夜', level: '進階', q: '作者以珍珠、銀幣等物象描寫夜空光點，主要運用了哪一種修辭？', options: ['譬喻', '設問', '借代', '引用'], answer: 0, explain: '以具體物象比擬夜空中的光亮景物，利用形狀與光澤的相似處形成譬喻。' },
  { id: 108, unit: '第一課 夏夜', level: '挑戰', q: '下列哪一項最適合概括〈夏夜〉的篇章特色？', options: ['以時間推移串連景物，並以動靜轉換收束', '以論點與數據說服讀者', '依人物對話推動衝突', '以倒敘揭露案件真相'], answer: 0, explain: '全詩隨夜色加深安排景物，前段較活潑，後段逐漸安靜。' },
  { id: 109, unit: '第一課 夏夜', level: '基礎', q: '「山巒」一詞的意思最接近下列何者？', options: ['平坦的田野', '連綿的山峰', '彎曲的小河', '茂密的竹林'], answer: 1, explain: '「山巒」指連綿的山峰。' },
  { id: 110, unit: '第一課 夏夜', level: '進階', q: '比較〈夏夜〉與〈春天在哪兒呀？〉，兩者最明顯的共同點為何？', options: ['都以戰爭為背景', '都運用兒童視角與自然景物', '都以科學知識為主', '都採嚴格固定格律'], answer: 1, explain: '兩篇都運用兒童式觀察、擬人與自然景物。' },
  { id: 201, unit: '第二課 生之歌選', level: '基礎', q: '〈生之歌選〉的作者「杏林子」本名為何？', options: ['劉俠', '楊森', '胡適', '沈復'], answer: 0, explain: '杏林子本名劉俠，作品常關注生命、苦難與正向行動。' },
  { id: 202, unit: '第二課 生之歌選', level: '基礎', q: '〈一顆珍珠〉中，原本使蚌感到痛苦的事物最後轉化成什麼？', options: ['貝殼', '珊瑚', '珍珠', '海藻'], answer: 2, explain: '粗糙沙礫經過長時間包覆，最後形成具有光彩的珍珠。' },
  { id: 203, unit: '第二課 生之歌選', level: '進階', q: '〈一顆珍珠〉以沙礫形成珍珠的過程說明人生道理，這種寫法最接近何者？', options: ['藉事說理', '純粹寫景', '新聞報導', '人物外貌描寫'], answer: 0, explain: '文章先敘述具體現象，再由現象引出生命道理。' },
  { id: 204, unit: '第二課 生之歌選', level: '進階', q: '在〈一顆珍珠〉的象徵關係中，「珍珠」最適合代表什麼？', options: ['未經磨鍊的人生', '經歷困難後形成的價值', '無法改變的失敗', '短暫的流行'], answer: 1, explain: '珍珠象徵苦難經過承受與轉化後，可能形成有意義的生命成果。' },
  { id: 205, unit: '第二課 生之歌選', level: '挑戰', q: '課文加入點字發明者的事例，最主要的作用為何？', options: ['補充海洋生物知識', '印證困境可轉化為貢獻', '說明藝術家的求學方法', '證明挫折會自然消失'], answer: 1, explain: '人物面對閱讀障礙後持續研究，最後幫助更多人，具體印證課文道理。' },
  { id: 206, unit: '第二課 生之歌選', level: '基礎', q: '〈手的故事〉中，雙手由柔軟靈活變得粗糙僵硬，主要原因是什麼？', options: ['長期勞動', '年幼貪玩', '旅行受傷', '缺少顏料'], answer: 0, explain: '長期工作支援他人求學，使雙手受到勞動影響。' },
  { id: 207, unit: '第二課 生之歌選', level: '進階', q: '〈手的故事〉把手的前後狀態並列，主要產生什麼效果？', options: ['凸顯長期付出的代價', '增加人物數量', '說明手部構造', '表示藝術不需練習'], answer: 0, explain: '前後對比讓讀者看見勞動造成的改變，理解人物的犧牲與成全。' },
  { id: 208, unit: '第二課 生之歌選', level: '進階', q: '在〈手的故事〉中，「手」除了身體部位外，還象徵什麼？', options: ['競爭與勝負', '付出、成全與援助', '權力與命令', '逃避與遺忘'], answer: 1, explain: '手承載勞動與犧牲，也延伸為在別人需要時伸出援手的象徵。' },
  { id: 209, unit: '第二課 生之歌選', level: '挑戰', q: '比較兩篇選文，最重要的共同特色為何？', options: ['只描寫自然風景', '由具體事物或故事引出生命道理', '以幽默批評社會', '以神話人物為主角'], answer: 1, explain: '兩篇皆先敘述具體事物或人物經驗，再提升到生命價值的思考。' },
  { id: 210, unit: '第二課 生之歌選', level: '挑戰', passage: '小岑因一次比賽失利，重新檢查練習方法，半年後不但改善弱點，也將筆記分享給學弟妹。', q: '這段自編情境最能呼應本課哪一項觀念？', options: ['困難可經行動轉化為價值', '失敗後應停止嘗試', '個人成就與他人無關', '等待問題自然消失'], answer: 0, explain: '小岑將挫折轉化為改進與助人的成果。' },
]

const css = `
*{box-sizing:border-box}body{margin:0;background:#f5f1e8;color:#24322f}button,select{font:inherit}.app{min-height:100vh;font-family:system-ui,-apple-system,"Noto Sans TC",sans-serif}.header{background:#173f3a;color:#fff;padding:18px 22px}.header-inner{max-width:980px;margin:auto;display:flex;gap:12px;align-items:center}.logo{width:46px;height:46px;border-radius:15px;background:#f4bd4b;color:#173f3a;display:grid;place-items:center;font-size:24px;font-weight:900}.header h1{font-size:22px;margin:0}.header p{margin:3px 0 0;color:#cfe8e1;font-size:13px}.container{width:min(940px,calc(100% - 28px));margin:auto;padding:24px 0 60px}.hero{background:#245f57;color:#fff;border-radius:26px;padding:30px}.hero span{background:#ffffff1c;padding:6px 11px;border-radius:99px;font-size:13px}.hero h2{font-size:clamp(28px,5vw,46px);line-height:1.2;margin:18px 0 10px}.hero p{margin:0;color:#d9eee9;line-height:1.7}.card{background:#fff;border-radius:24px;padding:24px;margin-top:18px;box-shadow:0 10px 28px #173f3a14}.label{font-weight:800}.select{width:100%;margin-top:8px;border:1px solid #ccd8d4;border-radius:12px;padding:12px;background:#fff}.count{color:#64716e}.count strong{font-size:26px;color:#173f3a}.actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.btn{border:0;border-radius:12px;padding:13px 16px;font-weight:800;cursor:pointer}.primary{background:#173f3a;color:#fff}.accent{background:#f4bd4b;color:#173f3a}.secondary{background:#edf2f0;color:#173f3a}.topline{display:flex;justify-content:space-between;font-size:14px;font-weight:700}.progress{height:8px;background:#e4ebe8;border-radius:99px;overflow:hidden;margin:12px 0 18px}.progress>div{height:100%;background:#f4bd4b}.tags{display:flex;gap:8px;flex-wrap:wrap}.tag{background:#eaf4f1;color:#245f57;border-radius:99px;padding:6px 10px;font-size:13px;font-weight:700}.passage{margin-top:18px;background:#faf6eb;border-left:4px solid #d59b31;padding:16px;line-height:1.8}.question{font-size:clamp(20px,4vw,28px);line-height:1.5;margin:20px 0}.options{display:grid;gap:11px}.option{display:flex;gap:11px;width:100%;text-align:left;padding:15px;border:2px solid #dfe7e4;border-radius:15px;background:#fff;cursor:pointer}.option:hover:not(:disabled){border-color:#2f756b;background:#f1faf7}.option.correct{border-color:#2b9e68;background:#e8f8ef}.option.wrong{border-color:#d95858;background:#fff0f0}.option.muted{opacity:.55}.letter{font-weight:900}.explain{margin-top:18px;padding:16px;border-radius:15px;line-height:1.65}.good{background:#e8f8ef;color:#17603e}.bad{background:#fff0f0;color:#8d2929}.right{display:flex;justify-content:flex-end;margin-top:18px}.result{text-align:center}.score{font-size:64px;font-weight:900;color:#ad3e2c}.score small{font-size:24px;color:#82908c}.review{text-align:left;margin-top:28px}.review-item{border:1px solid #dfe6e3;border-radius:15px;padding:15px;margin-top:11px}.review-item p{margin:8px 0;line-height:1.6}.wrong-text{color:#a52c2c}.correct-text{color:#17603e}.perfect{background:#e8f8ef;color:#17603e;padding:16px;border-radius:14px}.result-actions{grid-template-columns:repeat(3,1fr)}@media(max-width:620px){.container{width:min(100% - 18px,940px);padding-top:12px}.hero,.card{padding:19px;border-radius:19px}.actions,.result-actions{grid-template-columns:1fr}.topline{font-size:13px}}
`

export default function App() {
  const [unit, setUnit] = useState('全部課次')
  const [mode, setMode] = useState('home')
  const [quiz, setQuiz] = useState([])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [records, setRecords] = useState([])

  const units = [...new Set(questions.map((q) => q.unit))]
  const filtered = useMemo(() => unit === '全部課次' ? questions : questions.filter((q) => q.unit === unit), [unit])
  const current = quiz[index]
  const score = records.filter((r) => r.correct).length
  const wrong = records.filter((r) => !r.correct)

  function start(random = false, source = filtered) {
    const list = [...source]
    if (random) list.sort(() => Math.random() - 0.5)
    setQuiz(list.slice(0, 10))
    setIndex(0)
    setPicked(null)
    setRecords([])
    setMode('quiz')
  }

  function next() {
    if (picked === null || !current) return
    const nextRecords = [...records, { id: current.id, chosen: picked, correct: picked === current.answer }]
    setRecords(nextRecords)
    if (index + 1 === quiz.length) setMode('result')
    else { setIndex(index + 1); setPicked(null) }
  }

  function retryWrong() {
    const list = wrong.map((r) => questions.find((q) => q.id === r.id)).filter(Boolean)
    start(false, list)
  }

  return (
    <div className="app">
      <style>{css}</style>
      <header className="header"><div className="header-inner"><div className="logo">文</div><div><h1>文采練習室</h1><p>115學年度七年級上學期國文原創題庫</p></div></div></header>

      {mode === 'home' && <main className="container">
        <section className="hero"><span>第一、二課已建置</span><h2>依課文重點，練出閱讀與應用力。</h2><p>涵蓋〈夏夜〉與〈生之歌選〉，共 {questions.length} 題，每次最多練習 10 題。</p></section>
        <section className="card">
          <label className="label">選擇課次</label>
          <select className="select" value={unit} onChange={(e) => setUnit(e.target.value)}><option>全部課次</option>{units.map((x) => <option key={x}>{x}</option>)}</select>
          <p className="count">目前符合條件：<strong>{filtered.length}</strong> 題</p>
          <div className="actions"><button className="btn primary" onClick={() => start(false)}>依序開始</button><button className="btn accent" onClick={() => start(true)}>隨機出題</button></div>
        </section>
      </main>}

      {mode === 'quiz' && current && <main className="container">
        <div className="topline"><span>第 {index + 1} 題，共 {quiz.length} 題</span><span>目前答對 {score} 題</span></div>
        <div className="progress"><div style={{ width: `${((index + 1) / quiz.length) * 100}%` }} /></div>
        <section className="card">
          <div className="tags"><span className="tag">{current.unit}</span><span className="tag">{current.level}</span></div>
          {current.passage && <div className="passage">{current.passage}</div>}
          <h2 className="question">{current.q}</h2>
          <div className="options">{current.options.map((option, i) => {
            let name = 'option'
            if (picked !== null && i === current.answer) name += ' correct'
            else if (picked === i) name += ' wrong'
            else if (picked !== null) name += ' muted'
            return <button key={option} className={name} disabled={picked !== null} onClick={() => setPicked(i)}><span className="letter">{String.fromCharCode(65 + i)}.</span><span>{option}</span></button>
          })}</div>
          {picked !== null && <div className={`explain ${picked === current.answer ? 'good' : 'bad'}`}><strong>{picked === current.answer ? '答對了！' : `答錯了，正確答案是 ${String.fromCharCode(65 + current.answer)}`}</strong><div>{current.explain}</div></div>}
          <div className="right"><button className="btn primary" disabled={picked === null} onClick={next}>{index + 1 === quiz.length ? '查看成績' : '下一題'}</button></div>
        </section>
      </main>}

      {mode === 'result' && <main className="container"><section className="card result">
        <h2>練習完成</h2><div className="score">{score}<small> / {quiz.length}</small></div><p>答對率 {Math.round((score / quiz.length) * 100)}%</p>
        <div className="review"><h3>錯題回顧</h3>{wrong.length === 0 ? <p className="perfect">全部答對，表現很好！</p> : wrong.map((r, i) => { const q = questions.find((x) => x.id === r.id); return <article className="review-item" key={r.id}><strong>{i + 1}. {q.q}</strong><p className="wrong-text">你的答案：{String.fromCharCode(65 + r.chosen)}. {q.options[r.chosen]}</p><p className="correct-text">正確答案：{String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</p><p>解析：{q.explain}</p></article> })}</div>
        <div className="actions result-actions"><button className="btn secondary" onClick={() => setMode('home')}>返回首頁</button>{wrong.length > 0 && <button className="btn accent" onClick={retryWrong}>重練錯題</button>}<button className="btn primary" onClick={() => start(true, quiz)}>再測一次</button></div>
      </section></main>}
    </div>
  )
}
