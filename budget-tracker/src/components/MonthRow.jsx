import React from 'react'

export default function MonthRow({ label, rightLabel, onPrev, onNext }) {
  return (
    <div className="month-row">
      <div className="month-ctrl">
        <button className="month-btn" type="button" onClick={onPrev}>{'<'} Prev</button>
        <div className="month-label">{label}</div>
        <button className="month-btn" type="button" onClick={onNext}>Next {'>'}</button>
      </div>
      {rightLabel && <div className="month-label">{rightLabel}</div>}
    </div>
  )
}

