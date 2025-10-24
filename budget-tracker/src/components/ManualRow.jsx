import React, { useEffect, useRef } from 'react'


function allowMoney(el){
if (!el) return
const handler = ()=>{
const cleaned = el.value.replace(/[^0-9$.]/g,'')
if (cleaned !== el.value) el.value = cleaned
}
el.addEventListener('input', handler)
return ()=> el.removeEventListener('input', handler)
}


export default function ManualRow({ row, onChange, onDetails }){
const amtRef = useRef(null)
useEffect(()=> allowMoney(amtRef.current), [])


return (
<div className="tx-item">
<div className="tx-icon" />


<div className="tx-main">
<input
className="tx-desc-input"
type="text"
placeholder="Description"
defaultValue={row.description || ''}
onInput={(e)=> onChange({ description: e.target.value })}
/>
<div>
<input
className="tx-date-input"
type="date"
defaultValue={row.dateISO ? new Date(row.dateISO).toISOString().slice(0,10) : ''}
onChange={(e)=> onChange({ dateISO: e.target.value ? new Date(e.target.value).toISOString() : '' })}
/>
</div>
</div>


<div className="tx-amount-wrap">
<input
ref={amtRef}
className="tx-amount-input"
type="text"
placeholder="$0.00"
inputMode="decimal"
maxLength={16}
defaultValue={row.amount || ''}
onInput={(e)=> onChange({ amount: e.target.value })}
/>
<button type="button" className="btn-details" onClick={onDetails}>Add Details</button>
</div>
</div>
)
}