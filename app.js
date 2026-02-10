"use strict";

/* ========= STORAGE ========= */

function safe(k,f){
 try{return JSON.parse(localStorage.getItem(k)) ?? f}
 catch{return f}
}
function save(k,v){
 localStorage.setItem(k,JSON.stringify(v))
}

/* ========= DB ========= */

const DB={
 habits:safe("p_habits",[]),
 logs:safe("p_logs",[]),
 xp:safe("p_xp",0),
 streak:safe("p_streak",0)
}

function persist(){
 save("p_habits",DB.habits)
 save("p_logs",DB.logs)
 save("p_xp",DB.xp)
 save("p_streak",DB.streak)
}

/* ========= ELEMENTS ========= */

const el={
 form:document.getElementById("habitForm"),
 input:document.getElementById("habitInput"),
 type:document.getElementById("habitType"),
 list:document.getElementById("habitList"),
 xp:document.getElementById("xp"),
 streak:document.getElementById("streak"),
 level:document.getElementById("level"),
 chart:document.getElementById("chart"),
 notify:document.getElementById("notifyBtn"),
 backup:document.getElementById("backupBtn"),
 restore:document.getElementById("restoreInput")
}

/* ========= SECURITY ========= */

function clean(t){
 return (t||"").replace(/[<>]/g,"").trim()
}

/* ========= ADD ========= */

el.form.addEventListener("submit",e=>{
 e.preventDefault()

 const v=clean(el.input.value)
 if(v.length<2 || v.length>60) return

 DB.habits.push({
  id:crypto.randomUUID(),
  name:v,
  type:el.type.value
 })

 el.input.value=""
 persist()
 render()
})

/* ========= COMPLETE ========= */

function complete(id){
 const d=new Date().toDateString()

 if(DB.logs.find(x=>x.id===id && x.d===d)) return

 DB.logs.push({id,d})
 DB.xp+=10
 updateStreak()
 persist()
 render()
}

/* ========= STREAK ========= */

function updateStreak(){
 const days=[...new Set(DB.logs.map(x=>x.d))]
 if(days.length<2){DB.streak=days.length;return}

 const a=new Date(days.at(-1))
 const b=new Date(days.at(-2))
 DB.streak=(a-b===86400000)?DB.streak+1:1
}

/* ========= RENDER ========= */

function render(){

 el.list.innerHTML=""

 DB.habits.forEach(h=>{
  const row=document.createElement("div")
  row.className="flex justify-between mb-2"

  const s=document.createElement("span")
  s.textContent=h.name+" ("+h.type+")"

  const b=document.createElement("button")
  b.className="btn text-sm"
  b.textContent="تم"
  b.onclick=()=>complete(h.id)

  row.appendChild(s)
  row.appendChild(b)
  el.list.appendChild(row)
 })

 el.xp.textContent=DB.xp
 el.streak.textContent=DB.streak
 el.level.textContent=Math.floor(DB.xp/100)+1

 drawChart()
}

/* ========= CHART ========= */

let chart

function drawChart(){
 if(typeof Chart==="undefined") return

 const map={}
 DB.logs.forEach(l=>map[l.d]=(map[l.d]||0)+1)

 const L=Object.keys(map).slice(-7)
 const D=L.map(k=>map[k])

 if(chart) chart.destroy()

 chart=new Chart(el.chart,{
  type:"bar",
  data:{labels:L,datasets:[{data:D}]},
  options:{plugins:{legend:{display:false}}}
 })
}

/* ========= BACKUP ========= */

el.backup.onclick=()=>{
 const blob=new Blob([btoa(JSON.stringify(DB))])
 const a=document.createElement("a")
 a.href=URL.createObjectURL(blob)
 a.download="doncod.backup"
 a.click()
}

el.restore.onchange=e=>{
 const r=new FileReader()
 r.onload=()=>{
  try{
   Object.assign(DB,JSON.parse(atob(r.result)))
   persist()
   render()
  }catch{}
 }
 r.readAsText(e.target.files[0])
}

/* ========= NOTIFY ========= */

el.notify.onclick=async()=>{
 if(!("Notification" in window)) return
 await Notification.requestPermission()
 if(Notification.permission==="granted")
  new Notification("DONCOD LIFE","ابدأ عاداتك اليوم 🔥")
}

/* ========= PWA ========= */

if("serviceWorker" in navigator){
 navigator.serviceWorker.register("sw.js")
}

/* ========= INIT ========= */

render()
