export const fmtAmount = (n)=> Number(n||0).toLocaleString('en-US',{ style:'currency', currency:'USD' })
export const fmtDate = (iso)=> { const d=new Date(iso); return d.toLocaleDateString('en-US',{ month:'long', day:'numeric' }) }
export const monthName = (y,m)=> new Date(y,m,1).toLocaleDateString('en-US',{ month:'long', year:'numeric' })
export const sameMonth = (iso, y, m)=> { const d=new Date(iso); return d.getFullYear()===y && d.getMonth()===m }
export const debounce = (fn,ms)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms) } }
export const copyToClipboard = (text)=> navigator.clipboard?.writeText(text).catch(()=>{})