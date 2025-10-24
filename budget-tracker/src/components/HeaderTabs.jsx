import React from 'react'


export default function HeaderTabs({ tab, onChange }){
return (
<div className="tabs">
<button
id="tab-home"
className="tab-btn"
role="tab"
aria-selected={tab==='home'}
aria-controls="page-home"
onClick={()=> onChange('home')}
>Home</button>
<button
id="tab-manual"
className="tab-btn"
role="tab"
aria-selected={tab==='manual'}
aria-controls="page-manual"
onClick={()=> onChange('manual')}
>Manual</button>
</div>
)
}