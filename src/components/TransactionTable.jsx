import React, { useMemo, useState } from "react";

export default function TransactionTable({ txns, setTxns }){
  const [q, setQ] = useState("");
  const [nature, setNature] = useState("All");
  const [category, setCategory] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const cats = useMemo(()=>Array.from(new Set(txns.map(t=>t.category))).filter(Boolean), [txns]);

  const filtered = useMemo(()=>{
    let list = txns.filter(t=>{
      const matchesQ = [t.description, t.category, t.subCategory, t.place].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesNature = nature==="All" || t.nature===nature;
      const matchesCat = category==="All" || t.category===category;
      return matchesQ && matchesNature && matchesCat;
    });
    list.sort((a,b)=>{
      const aVal = sortKey==="amount" ? (+a.amount) : (sortKey==="date" ? new Date(a.date).getTime() : (a[sortKey]||""));
      const bVal = sortKey==="amount" ? (+b.amount) : (sortKey==="date" ? new Date(b.date).getTime() : (b[sortKey]||""));
      return sortDir==="asc" ? (aVal>bVal?1:-1) : (aVal<bVal?1:-1);
    });
    return list;
  }, [txns,q,nature,category,sortKey,sortDir]);

  const remove = (id)=> setTxns(txns.filter(t=>t.id!==id));

  return (
    <>
      <div className="grid cols-2" style={{marginBottom:8}}>
        <input className="input" placeholder="Search description, place, category…" value={q} onChange={e=>setQ(e.target.value)}/>
        <div className="row">
          <select className="input" value={nature} onChange={e=>setNature(e.target.value)}>
            <option>All</option><option>Income</option><option>Expense</option>
          </select>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            <option>All</option>{cats.map(c=><option key={c}>{c}</option>)}
          </select>
          <select className="input" value={sortKey} onChange={e=>setSortKey(e.target.value)}>
            <option value="date">Date</option><option value="amount">Amount</option><option value="description">Description</option>
          </select>
          <select className="input" value={sortDir} onChange={e=>setSortDir(e.target.value)}>
            <option value="desc">Desc</option><option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th><th>Nature</th><th>Description</th><th>Category</th><th>Sub-Category</th>
            <th>Amount</th><th>Recurrence</th><th>Sub-Recurrence</th><th>Place</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t=>(
            <tr key={t.id}>
              <td>{t.date}</td>
              <td><span className={`row-chip ${t.nature?.toLowerCase()}`}>{t.nature}</span></td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>{t.subCategory||"—"}</td>
              <td>${Number(t.amount).toFixed(2)}</td>
              <td>{t.recurrence||"—"}</td>
              <td>{t.subRecurrence||"—"}</td>
              <td>{t.place||"—"}</td>
              <td><button className="btn" onClick={()=>remove(t.id)}>Delete</button></td>
            </tr>
          ))}
          {filtered.length===0 && (
            <tr><td colSpan="10" className="small" style={{padding:'16px'}}>No transactions yet.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
