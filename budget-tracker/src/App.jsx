import React, { useMemo, useState } from 'react'
import HeaderTabs from './components/HeaderTabs.jsx'
import SearchBar from './components/SearchBar.jsx'
import MonthRow from './components/MonthRow.jsx'
import TxList from './components/TxList.jsx'
import ManualRow from './components/ManualRow.jsx'
import DetailsModal from './components/DetailsModal.jsx'
import { CATEGORIES } from './constants/categories.js'
import { DEMO_ALL } from './data/demoAll.js'
import { fmtAmount, monthName, sameMonth, copyToClipboard } from './lib/format.js'

function shiftMonth({ y, m }, delta) {
  const total = y * 12 + m + delta
  const ny = Math.floor(total / 12)
  const nm = ((total % 12) + 12) % 12
  return { y: ny, m: nm }
}

export default function App() {
  const now = new Date()
  const cur = { y: now.getFullYear(), m: now.getMonth() }

  const [tab, setTab] = useState('home')

  // Home state
  const [homeQuery, setHomeQuery] = useState('')
  const [homeMonth, setHomeMonth] = useState(cur)
  const homeFiltered = useMemo(() => {
    const q = homeQuery.trim().toLowerCase()
    return DEMO_ALL.filter((t) =>
      sameMonth(t.dateISO, homeMonth.y, homeMonth.m) &&
      (!q || (t.description || '').toLowerCase().includes(q))
    )
  }, [homeQuery, homeMonth])
  const homeTotal = useMemo(() => homeFiltered.reduce((sum, t) => sum + Number(t.amount || 0), 0), [homeFiltered])

  // Manual state
  const [manual, setManual] = useState([])
  const [manualQuery, setManualQuery] = useState('')
  const [manualMonth, setManualMonth] = useState(cur)
  const manualFiltered = useMemo(() => {
    const q = manualQuery.trim().toLowerCase()
    return manual.filter((t) =>
      (!t.dateISO || sameMonth(t.dateISO, manualMonth.y, manualMonth.m)) &&
      (!q || (t.description || '').toLowerCase().includes(q))
    )
  }, [manual, manualQuery, manualMonth])

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)

  // Actions
  const exportHomeJSON = () => {
    copyToClipboard(JSON.stringify(homeFiltered, null, 2))
  }
  const exportManualJSON = () => {
    copyToClipboard(JSON.stringify(manual, null, 2))
  }
  const addManualRow = () => {
    setManual((rows) => [{ description: '', dateISO: '', amount: '', categoryKey: '', notes: '' }, ...rows])
  }
  const updateManualAt = (i, patch) => {
    setManual((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }
  const openDetailsModal = (i) => {
    setEditingIndex(i)
    setModalOpen(true)
  }
  const closeDetailsModal = () => {
    setModalOpen(false)
    setEditingIndex(-1)
  }
  const saveModal = (payload) => {
    if (editingIndex >= 0) {
      setManual((rows) => rows.map((r, idx) => (idx === editingIndex ? { ...r, ...payload } : r)))
    }
    closeDetailsModal()
  }

  return (
    <>
      <HeaderTabs tab={tab} onChange={setTab} />

      <main className="page-wrap">
        {/* HOME */}
        {tab === 'home' && (
          <section role="tabpanel" aria-labelledby="tab-home">
            <div className="card">
              <div className="card-inner">
                <div className="card-titlebar">
                  <div className="card-title">Transactions</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" type="button" onClick={exportHomeJSON}>Copy JSON</button>
                  </div>
                </div>

                <SearchBar id="txSearch" value={homeQuery} onChange={setHomeQuery} ariaLabel="Search transactions by description" />

                <MonthRow
                  label={monthName(homeMonth.y, homeMonth.m)}
                  rightLabel={homeFiltered.length ? `${fmtAmount(homeTotal)} total spend` : ''}
                  onPrev={() => setHomeMonth((cur) => shiftMonth(cur, -1))}
                  onNext={() => setHomeMonth((cur) => shiftMonth(cur, 1))}
                />

                <TxList items={homeFiltered} />
              </div>
            </div>
          </section>
        )}

        {/* MANUAL */}
        {tab === 'manual' && (
          <section role="tabpanel" aria-labelledby="tab-manual">
            <div className="card">
              <div className="card-inner">
                <div className="card-titlebar">
                  <div className="card-title">Manual</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" type="button" onClick={addManualRow}>Add Transaction</button>
                    <button className="btn" type="button" onClick={exportManualJSON}>Copy JSON</button>
                  </div>
                </div>

                <SearchBar id="manualSearch" value={manualQuery} onChange={setManualQuery} ariaLabel="Search manual transactions by description" />

                <MonthRow
                  label={monthName(manualMonth.y, manualMonth.m)}
                  onPrev={() => setManualMonth((cur) => shiftMonth(cur, -1))}
                  onNext={() => setManualMonth((cur) => shiftMonth(cur, 1))}
                />

                <div className="tx-list" aria-live="polite">
                  {manualFiltered.map((t, i) => (
                    <ManualRow
                      key={i}
                      row={t}
                      onChange={(patch) => updateManualAt(i, patch)}
                      onDetails={() => openDetailsModal(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Details Modal */}
      {modalOpen && (
        <DetailsModal
          categories={CATEGORIES}
          initial={editingIndex >= 0 ? manual[editingIndex] : null}
          onCancel={closeDetailsModal}
          onSave={saveModal}
        />
      )}
    </>
  )
}
