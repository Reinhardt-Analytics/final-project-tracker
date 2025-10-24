import React, { useMemo } from 'react'
import { debounce } from '../lib/format.js'


export default function SearchBar({ id, value, onChange, ariaLabel }){
const debounced = useMemo(()=> debounce(onChange,120), [onChange])
return (
<div className="searchbar" role="search">
<div className="search-icon" aria-hidden="true"></div>
<input
id={id}
type="search"
defaultValue={value}
placeholder="Search my transactions"
aria-label={ariaLabel}
onInput={(e)=> debounced(e.target.value)}
/>
</div>
)
}