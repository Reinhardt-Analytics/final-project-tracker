import React, { useEffect, useMemo, useRef, useState } from 'react'

function useMoneyInput(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = () => {
      const cleaned = el.value.replace(/[^0-9$.]/g, '')
      if (cleaned !== el.value) el.value = cleaned
    }
    el.addEventListener('input', handler)
    return () => el.removeEventListener('input', handler)
  }, [ref])
}

export default function DetailsModal({ categories = [], initial, onCancel, onSave }) {
  const [desc, setDesc] = useState(initial?.description || '')
  const [date, setDate] = useState(
    initial?.dateISO ? new Date(initial.dateISO).toISOString().slice(0, 10) : ''
  )
  const amountRef = useRef(null)
  const [notes, setNotes] = useState(initial?.notes || '')
  const [cat, setCat] = useState(initial?.categoryKey || '')
  const [open, setOpen] = useState(false)

  useMoneyInput(amountRef)

  const chosen = useMemo(
    () => (categories || []).find((c) => c.key === cat) || null,
    [categories, cat]
  )

  const save = () => {
    const amountVal = amountRef.current ? amountRef.current.value : ''
    const payload = {
      description: desc.trim(),
      dateISO: date ? new Date(date).toISOString() : '',
      amount: amountVal,
      notes: notes.trim(),
      categoryKey: cat || ''
    }
    if (onSave) onSave(payload)
  }

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget && onCancel) onCancel()
  }

  return (
    <div className="modal-backdrop" onClick={onBackdropClick}>
      <div className="modal">
        <div className="modal-shell">
          <div className="modal-inner" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div className="modal-head">
              <div id="modalTitle" className="modal-title">Add Details</div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={save}>Save</button>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="mdDesc">Description</label>
                <input
                  id="mdDesc"
                  className="input"
                  type="text"
                  placeholder="e.g., Planet Fitness"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="row-two">
                <div className="field">
                  <label className="label" htmlFor="mdDate">Date</label>
                  <input
                    id="mdDate"
                    className="input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="mdAmount">Amount</label>
                  <input
                    id="mdAmount"
                    ref={amountRef}
                    className="input amount-right"
                    type="text"
                    placeholder="$0.00"
                    inputMode="decimal"
                    maxLength={16}
                    defaultValue={initial?.amount || ''}
                  />
                </div>
              </div>

              <div className="field cat-select">
                <label className="label">Category</label>
                <button
                  type="button"
                  className="cat-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  onClick={() => setOpen((o) => !o)}
                >
                  <span>{chosen ? chosen.name : 'Choose a category'}</span>
                  <span aria-hidden="true">v</span>
                </button>

                {!open ? null : (
                  <div className="cat-panel">
                    <div className="cat-grid" role="listbox" aria-label="Categories">
                      {(categories || []).map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          className="cat-item"
                          role="option"
                          aria-selected={c.key === cat}
                          aria-label={c.name}
                          title={c.tip}
                          onClick={() => {
                            setCat(c.key)
                            setOpen(false)
                          }}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="mdNotes">Notes</label>
                <textarea
                  id="mdNotes"
                  className="textarea"
                  placeholder="Add any notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

