import React from 'react'
import { fmtAmount, fmtDate } from '../lib/format.js'

export default function TxList({ items }) {
  return (
    <div id="txList" className="tx-list" aria-live="polite">
      {items.map((t, idx) => (
        <div key={idx} className="tx-item">
          <div className="tx-icon" />
          <div className="tx-main">
            <div className="tx-desc">{t.description || '(No description)'}</div>
            <div className="tx-date">{fmtDate(t.dateISO)}</div>
          </div>
          <div className="tx-amount">{fmtAmount(t.amount)}</div>
        </div>
      ))}
    </div>
  )
}

