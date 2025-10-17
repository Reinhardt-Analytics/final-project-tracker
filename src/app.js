import React, { useMemo, useState } from "react";
import TransactionTable from "./components/TransactionTable.jsx";
import AddTransactionModal from "./components/AddTransactionModal.jsx";
import SquareCardLink from "./components/SquareCardLink.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { sumBy } from "./utils/math.js";

export default function App(){
  const [txns, setTxns] = useLocalStorage("bt_txns", []);
  const [showAdd, setShowAdd] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [linked, setLinked] = useLocalStorage("bt_card_linked", false);

  const totals = useMemo(()=>{
    const income = sumBy(txns.filter(t=>t.nature==="Income"), t=>+t.amount||0);
    const expense = sumBy(txns.filter(t=>t.nature==="Expense"), t=>+t.amount||0);
    return { income, expense, net: income - expense };
  }, [txns]);

  return (
    <div className="container">
      <header className="header">
        <div className="row">
          <h1 className="h1">Budget Tracker</h1>
          <span className={`badge status ${linked ? "ok":"fail"}`}>
            {linked ? "Card: Connected" : "Card: Not connected"}
          </span>
        </div>
        <div className="actions">
          <button className="btn" onClick={()=>setShowLink(true)}>Link Card</button>
          <button className="btn primary" onClick={()=>setShowAdd(true)}>Add Transaction</button>
        </div>
      </header>

      <section className="panel kpis">
        <div className="kpi">
          <h4>Income</h4>
          <div className="val">${totals.income.toFixed(2)}</div>
        </div>
        <div className="kpi">
          <h4>Expenses</h4>
          <div className="val">${totals.expense.toFixed(2)}</div>
        </div>
        <div className="kpi">
          <h4>Net</h4>
          <div className="val" style={{color: totals.net >=0 ? "var(--ok)":"var(--danger)"}}>
            ${totals.net.toFixed(2)}
          </div>
        </div>
      </section>

      <section className="panel" style={{marginTop:12}}>
        <TransactionTable txns={txns} setTxns={setTxns}/>
      </section>

      {showAdd && (
        <AddTransactionModal
          onClose={()=>setShowAdd(false)}
          onSave={(t)=>setTxns(prev=>[t,...prev])}
        />
      )}

      {showLink && (
        <SquareCardLink
          onClose={()=>setShowLink(false)}
          onLinked={()=>setLinked(true)}
        />
      )}
    </div>
  );
}

