import React, { useState } from "react";

const catOptions = ["Income","Bills","Housing","Transport","Food","Entertainment","Health","Savings"];
const subByCat = {
  Bills:["Phone","Internet","Utilities","Subscriptions"],
  Food:["Groceries","Dining Out","Coffee"],
  Transport:["Fuel","Public Transit","Rideshare","Parking"],
  Entertainment:["Games","Movies","Events","Streaming"],
  Housing:["Rent/Mortgage","Maintenance","Insurance"],
  Health:["Pharmacy","Medical","Gym"],
  Savings:["Emergency Fund","Investments"]
};

export default function AddTransactionModal({ onClose, onSave }){
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    nature: "Expense",
    description: "",
    category: "Food",
    subCategory: "",
    amount: "",
    recurrence: "None",
    subRecurrence: "",
    place: ""
  });

  const change = (k,v)=> setForm(prev=>({...prev,[k]:v}));

  const submit = (e)=>{
    e.preventDefault();
    if(!form.description || !form.amount) return;
    onSave({ id: crypto.randomUUID(), ...form });
    onClose();
  };

  const subs = subByCat[form.category] || [];

  return (
    <div className="modal-bg" onClick={(e)=>e.target===e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h3 style={{marginTop:0}}>Add Transaction</h3>
        <div className="grid cols-2">
          <div>
            <label>Date</label>
            <input className="input" type="date" value={form.date} onChange={e=>change("date",e.target.value)} />
          </div>
          <div>
            <label>Nature</label>
            <select className="input" value={form.nature} onChange={e=>change("nature",e.target.value)}>
              <option>Income</option><option>Expense</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <input className="input" placeholder="e.g., Grocery run" value={form.description} onChange={e=>change("description",e.target.value)} />
          </div>
          <div>
            <label>Amount</label>
            <input className="input" type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>change("amount",e.target.value)} />
          </div>
          <div>
            <label>Category</label>
            <select className="input" value={form.category} onChange={e=>change("category",e.target.value)}>
              {catOptions.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Sub-Category</label>
            <select className="input" value={form.subCategory} onChange={e=>change("subCategory",e.target.value)}>
              <option value="">—</option>
              {subs.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Recurrence</label>
            <select className="input" value={form.recurrence} onChange={e=>change("recurrence",e.target.value)}>
              <option>None</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option><option>Quarterly</option><option>Yearly</option>
            </select>
          </div>
          <div>
            <label>Sub-Recurrence</label>
            <input className="input" placeholder="e.g., 1st of month" value={form.subRecurrence} onChange={e=>change("subRecurrence",e.target.value)} />
          </div>
          <div>
            <label>Place</label>
            <input className="input" placeholder="e.g., Costco" value={form.place} onChange={e=>change("place",e.target.value)} />
          </div>
        </div>
        <hr/>
        <div className="row" style={{justifyContent:"flex-end"}}>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
