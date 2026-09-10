const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const pick=a=>a[ri(0,a.length-1)]
const nz=(a,b)=>{let n=0;while(n===0)n=ri(a,b);return n}
const shuffle=a=>[...a].sort(()=>Math.random()-.5)
const fmt=n=>n<0?`(${n})`:`${n}`
const makeOptions=(answer, distractors)=>{
  const values=[answer,...distractors].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4)
  while(values.length<4){const v=answer+pick([-12,-7,-3,3,7,12]);if(!values.includes(v))values.push(v)}
  const mixed=shuffle(values), index=mixed.indexOf(answer)
  return {options:mixed.map(String),answer:index}
}
const Q=(skill,unit,level,type,question,answerValue,distractors,explanation,signature)=>{
  const o=makeOptions(answerValue,distractors)
  return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit,level,type,skill,question,options:o.options,answer:o.answer,explanation,generated:true,signature}
}

function signedQuantity(){
 const contexts=[['向東為正','向西',-1,'公里'],['收入為正','支出',-1,'元'],['上升為正','下降',-1,'公尺'],['進步為正','退步',-1,'分'],['地面以上為正','地下',-1,'層']]
 const [rule,action,sign,unit]=pick(contexts), n=ri(2,30), ans=sign*n
 return Q('相反意義的量','1-1 負數與數線','基礎','生活情境',`規定「${rule}」，${action} ${n} ${unit}應記為何數？`,ans,[-ans,n,0],`題目指定的正方向與「${action}」相反，所以用負數表示，答案是 ${ans}。`,`signed-${rule}-${n}`)
}
function compareIntegers(){
 let a=nz(-20,20),b=nz(-20,20);while(a===b)b=nz(-20,20)
 const ans=a>b?1:-1
 const symbol=ans===1?'>':'<'
 const opts=shuffle([`${a} > ${b}`,`${a} < ${b}`,`${a} = ${b}`,'無法比較'])
 return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-1 負數與數線',level:'基礎',type:'大小比較',skill:'整數大小',question:'下列何者正確？',options:opts,answer:opts.indexOf(`${a} ${symbol} ${b}`),explanation:`數線上愈右邊的數愈大，因此 ${a} ${symbol} ${b}。`,generated:true,signature:`cmp-${a}-${b}`}
}
function oppositeOrAbsolute(){
 const n=nz(-15,15), mode=pick(['opp','abs'])
 if(mode==='opp') return Q('相反數','1-1 負數與數線','基礎','概念計算',`${n} 的相反數是多少？`,-n,[n,Math.abs(n),0],`相反數位於原點兩側且距離相等，所以 ${n} 的相反數是 ${-n}。`,`opp-${n}`)
 return Q('絕對值','1-1 負數與數線','基礎','概念計算',`|${n}| 的值是多少？`,Math.abs(n),[-Math.abs(n),n*2,0],`絕對值表示到原點的距離，所以 |${n}|=${Math.abs(n)}。`,`abs-${n}`)
}
function absoluteSolutions(){
 const n=ri(2,9), ans=2*n-1
 return Q('絕對值不等式','1-1 負數與數線','挑戰','解的個數',`整數 x 滿足 |x| < ${n}，共有幾個解？`,ans,[2*n,2*n+1,n],`符合條件的是 -${n-1} 到 ${n-1} 的所有整數，共 ${ans} 個。`,`abs-sol-${n}`)
}
function integerAdd(){
 const a=nz(-30,30),b=nz(-30,30),ans=a+b
 return Q('整數加法','1-2 整數的加減','基礎','直接計算',`${fmt(a)} + ${fmt(b)} = ?`,ans,[a-b,-ans,Math.abs(a)+Math.abs(b)],`依同號或異號加法規則計算，${a}+${b}=${ans}。`,`add-${a}-${b}`)
}
function integerSub(){
 const a=nz(-30,30),b=nz(-30,30),ans=a-b
 return Q('整數減法','1-2 整數的加減','基礎','直接計算',`${fmt(a)} - ${fmt(b)} = ?`,ans,[a+b,b-a,-ans],`減去一個數等於加上該數的相反數：${a}-(${b})=${a}+(${-b})=${ans}。`,`sub-${a}-${b}`)
}
function mixedAddSub(){
 const a=nz(-60,60),b=nz(-40,40),c=nz(-30,30),ans=a-b+c
 return Q('加減混合','1-2 整數的加減','進階','混合運算',`${fmt(a)} - ${fmt(b)} + ${fmt(c)} = ?`,ans,[a+b+c,a-b-c,-ans],`把減法改寫為加上相反數，再由左至右或利用加法運算律計算，答案為 ${ans}。`,`mixas-${a}-${b}-${c}`)
}
function distance(){
 const a=nz(-15,15),b=nz(-15,15); if(a===b)return distance(); const ans=Math.abs(a-b)
 return Q('數線距離','1-2 整數的加減','進階','數線應用',`數線上 A(${a})、B(${b})，AB 的長度是多少？`,ans,[a-b,b-a,Math.abs(a)+Math.abs(b)],`兩點距離為 |a-b|，所以 |${a}-(${b})|=${ans}。`,`dist-${a}-${b}`)
}
function midpoint(){
 let a=nz(-16,10),b=nz(-10,16); if((a+b)%2!==0||a===b)return midpoint(); const ans=(a+b)/2
 return Q('線段中點','1-2 整數的加減','挑戰','數線應用',`數線上 A(${a})、B(${b})，AB 中點的坐標為何？`,ans,[Math.abs(a-b)/2,a+b,-ans],`中點坐標為 (${a}+${b})÷2=${ans}。`,`mid-${a}-${b}`)
}
function integerMultiply(){
 const a=nz(-14,14),b=nz(-12,12),ans=a*b
 return Q('整數乘法','1-3 整數的乘除與四則運算','基礎','直接計算',`${fmt(a)} × ${fmt(b)} = ?`,ans,[-ans,a+b,Math.abs(a)*Math.abs(b)],`同號相乘得正，異號相乘得負；數字部分為 |${a}|×|${b}|，答案 ${ans}。`,`mul-${a}-${b}`)
}
function integerDivide(){
 const b=nz(-12,12),ans=nz(-12,12),a=b*ans
 return Q('整數除法','1-3 整數的乘除與四則運算','基礎','直接計算',`${fmt(a)} ÷ ${fmt(b)} = ?`,ans,[-ans,a/b+pick([-2,2]),a],`同號相除得正，異號相除得負；${a}÷(${b})=${ans}。`,`div-${a}-${b}`)
}
function signOfProduct(){
 const negatives=ri(2,8), positives=ri(1,4), ans=negatives%2===0?'正數':'負數'
 const options=['正數','負數','0','無法判斷']
 return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-3 整數的乘除與四則運算',level:'進階',type:'符號判斷',skill:'多因數乘積',question:`一個非零整數連乘式中有 ${negatives} 個負因數、${positives} 個正因數，乘積為何？`,options,answer:options.indexOf(ans),explanation:`負因數有 ${negatives} 個，${negatives%2===0?'為偶數，所以乘積為正':'為奇數，所以乘積為負'}。`,generated:true,signature:`signprod-${negatives}-${positives}`}
}
function orderOfOperations(){
 const a=ri(2,9),b=nz(-9,9),c=ri(2,8),d=nz(-9,9),ans=a*b+c-d
 return Q('四則運算順序','1-3 整數的乘除與四則運算','進階','混合運算',`${a} × ${fmt(b)} + ${c} - ${fmt(d)} = ?`,ans,[(a+b)*c-d,a*(b+c)-d,-ans],`先算乘法 ${a}×(${b})=${a*b}，再由左至右完成加減，答案為 ${ans}。`,`order-${a}-${b}-${c}-${d}`)
}
function distributive(){
 const c=nz(-12,12),a=ri(30,90),b=100-a,ans=c*100
 return Q('分配律','1-3 整數的乘除與四則運算','進階','簡便計算',`${fmt(c)} × ${a} + ${fmt(c)} × ${b} = ?`,ans,[c*(a-b),c*(a+b+1),-ans],`提出共同因數 ${c}：${c}×(${a}+${b})=${c}×100=${ans}。`,`distlaw-${c}-${a}-${b}`)
}
function powerBasic(){
 const a=ri(2,7),n=ri(2,4),negative=Math.random()<.5,paren=Math.random()<.65
 let ans
 let text
 if(negative&&paren){ans=(-a)**n;text=`(${-a})^${n}`}
 else if(negative){ans=-(a**n);text=`-${a}^${n}`}
 else{ans=a**n;text=`${a}^${n}`}
 return Q('整數乘方','1-4 指數記法與科學記號',negative?'進階':'基礎','乘方計算',`${text} = ?`,ans,[-ans,a*n,a**(n-1)],`先確認負號是否屬於底數，再計算乘方。答案為 ${ans}。`,`pow-${text}`)
}
function powerSign(){
 const n=ri(2,9), ans=n%2===0?'正數':'負數',options=['正數','負數','0','無法判斷']
 return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-4 指數記法與科學記號',level:'基礎',type:'符號判斷',skill:'負數乘方',question:`(-3)^${n} 的值是正數還是負數？`,options,answer:options.indexOf(ans),explanation:`負數的${n%2===0?'偶數':'奇數'}次方為${ans}。`,generated:true,signature:`powsign-${n}`}
}
function tenPower(){
 const n=ri(-7,7), answer=n>=0?String(10**n):(10**n).toFixed(Math.abs(n))
 const options=shuffle([answer,String(10**(-n)),n<0?`-${answer}`:`${answer}0`,'0'])
 return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-4 指數記法與科學記號',level:'基礎',type:'10的次方',skill:'10的次方',question:`10^${n} 展開為何？`,options,answer:options.indexOf(answer),explanation:n>=0?`10^${n} 是 1 後面接 ${n} 個 0。`:`10^${n}=1/10^${-n}=${answer}。`,generated:true,signature:`tenpow-${n}`}
}
function scientificConvert(){
 const a=ri(11,99)/10,n=ri(-7,8), value=a*10**n
 const sci=`${a} × 10^${n}`
 const normal=n>=0?String(Math.round(value)):value.toFixed(Math.max(0,-n+1)).replace(/0+$/,'').replace(/\.$/,'')
 if(Math.random()<.5){
  const options=shuffle([sci,`${a*10} × 10^${n-1}`,`${a/10} × 10^${n+1}`,`${a} × 10^${-n}`])
  return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-4 指數記法與科學記號',level:'進階',type:'科學記號換算',skill:'科學記號',question:`將 ${normal} 寫成標準科學記號。`,options,answer:options.indexOf(sci),explanation:`標準形式要求 1≤a<10，因此答案為 ${sci}。`,generated:true,signature:`sci-${a}-${n}-to`}
 }
 const options=shuffle([normal,String(value*10),String(value/10),String(-value)])
 return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-4 指數記法與科學記號',level:'進階',type:'科學記號換算',skill:'科學記號',question:`${sci} 展開為一般數是多少？`,options,answer:options.indexOf(normal),explanation:`依指數移動小數點，得到 ${normal}。`,generated:true,signature:`sci-${a}-${n}-from`}
}
function scientificCompare(){
 const a=ri(11,95)/10,b=ri(11,95)/10,m=ri(-6,7),n=ri(-6,7)
 const av=a*10**m,bv=b*10**n,correct=av>bv?'>':av<bv?'<':'='
 const options=['>','<','=','無法比較']
 return {id:`GEN-${Date.now()}-${Math.random()}`,subject:'math',division:'數學',unit:'1-4 指數記法與科學記號',level:'挑戰',type:'大小比較',skill:'科學記號比較',question:`${a} × 10^${m}  □  ${b} × 10^${n}，□ 應填入？`,options,answer:options.indexOf(correct),explanation:m===n?`指數相同，比較前面的數：${a} ${correct} ${b}。`:`先比較指數或化成相同指數，可得左式 ${correct} 右式。`,generated:true,signature:`scicmp-${a}-${m}-${b}-${n}`}
}

const generators=[signedQuantity,compareIntegers,oppositeOrAbsolute,absoluteSolutions,integerAdd,integerSub,mixedAddSub,distance,midpoint,integerMultiply,integerDivide,signOfProduct,orderOfOperations,distributive,powerBasic,powerSign,tenPower,scientificConvert,scientificCompare]
export function generateMathQuestions(count=10,unit='全部'){
 const allowed=unit==='全部'?generators:generators.filter(g=>{
  const sample=g(); return sample.unit===unit
 })
 const out=[],seen=new Set();let guard=0
 while(out.length<count&&guard<500){guard++;const item=pick(allowed)();if(!seen.has(item.signature)){seen.add(item.signature);out.push(item)}}
 return out
}
export const mathUnits=['1-1 負數與數線','1-2 整數的加減','1-3 整數的乘除與四則運算','1-4 指數記法與科學記號']
