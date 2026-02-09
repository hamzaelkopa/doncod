/* ========= SAFE STORAGE ========= */

function safe(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}

const DB={
 habits:safe("v2_habits",[]),
 logs:safe("v2_logs",[]),
 xp:safe("v2_xp",0),
 streak:safe("v2_streak",0)
}

function persist(){
 save("v2_habits",DB.habits)
 save("v2_logs",DB.logs)
 save("v2_xp",DB.xp)
 save("v2_streak",DB.streak)
}

/* ========= SECURITY ========= */

function clean(t){
 return t.replace(/[<>]/g,"").trim()
}

/* ========= ADD ========= */

habitForm.onsubmit=e=>{
 e.preventDefault()
 const v=clean(name.value)
 if(v.length<2) return
 DB.habits.push({id:Date.now(),name:v,type:type.value})
 name.value=""
 persist()
 render()
}

/* ========= COMPLETE ========= */

function done(id){
 const today=new Date().toDateString()
 if(DB.logs.find(x=>x.id===id && x.day===today)) return

 DB.logs.push({id,day:today,time:Date.now()})
 DB.xp+=10
 updateStreak()
 persist()
 render()
}

/* ========= STREAK SMART ========= */

function updateStreak(){
 const days=[...new Set(DB.logs.map(x=>x.day))]
 if(days.length<2){DB.streak=1;return}

 const a=new Date(days.at(-1))
 const b=new Date(days.at(-2))
 DB.streak = (a-b===86400000)? DB.streak+1 : 1
}

/* ========= RENDER SAFE ========= */

function render(){
 habitList.innerHTML=""

 DB.habits.forEach(h=>{
   const row=document.createElement("div")
   row.className="flex justify-between mb-2"

   const s=document.createElement("span")
   s.textContent=`${h.name} (${h.type})`

   const b=document.createElement("button")
   b.className="btn text-sm"
   b.textContent="تم"
   b.onclick=()=>done(h.id)

   row.appendChild(s)
   row.appendChild(b)
   habitList.appendChild(row)
 })

 xp.textContent=DB.xp
 streak.textContent=DB.streak
 today.textContent=DB.logs.filter(
   x=>x.day===new Date().toDateString()).length

 drawChart()
}

/* ========= CHART ========= */

let chart
function drawChart(){
 const map={}
 DB.logs.forEach(l=>map[l.day]=(map[l.day]||0)+1)

 const labels=Object.keys(map).slice(-7)
 const data=labels.map(k=>map[k])

 if(chart) chart.destroy()
 chart=new Chart(chartCanvas,{
   type:"bar",
   data:{labels,datasets:[{data}]},
   options:{plugins:{legend:{display:false}}}
 })
}

/* ========= NOTIFICATIONS ========= */

notifyBtn.onclick=async()=>{
 if(!("Notification" in window)) return
 await Notification.requestPermission()
 new Notification("DONCOD LIFE","ابدأ عاداتك اليوم 🔥")
}

/* ========= PWA ========= */

if("serviceWorker" in navigator){
 navigator.serviceWorker.register("sw.js")
}

/* ========= INIT ========= */

const chartCanvas=document.getElementById("chart")
render()
