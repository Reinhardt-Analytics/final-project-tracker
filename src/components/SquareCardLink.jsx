import React, { useEffect, useRef, useState } from "react";

/**
 * Front-end only demo of Square Web Payments SDK.
 * You MUST create a backend route to create a tokenization `nonce`
 * and securely call Square APIs with your access token. Never expose it here.
 *
 * Backend sketch (Node/Express):
 *  POST /api/square/create-card
 *    - expects { nonce }
 *    - uses Square SDK to create customer + card-on-file
 *    - returns { success: true }
 */

const SQUARE_SDK_URL = "https://sandbox.web.squarecdn.com/v1/square.js";

export default function SquareCardLink({ onClose, onLinked }){
  const [ready, setReady] = useState(false);
  const cardRef = useRef(null);
  const paymentsRef = useRef(null);
  const [error, setError] = useState("");

  // TODO: replace with your real Sandbox IDs
  const applicationId = import.meta.env.VITE_SQUARE_APP_ID || "REPLACE_ME";
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID || "REPLACE_ME";

  useEffect(()=>{
    const load = async ()=>{
      if(!applicationId || applicationId==="REPLACE_ME"){
        setError("Missing Square application/location IDs. Add VITE_SQUARE_* env vars.");
        return;
      }
      // load script once
      if(!window.Square){
        await new Promise((resolve,reject)=>{
          const s = document.createElement("script");
          s.src = SQUARE_SDK_URL; s.async = true; s.onload=resolve; s.onerror=reject;
          document.head.appendChild(s);
        });
      }
      const payments = window.Square.payments(applicationId, locationId);
      paymentsRef.current = payments;
      const card = await payments.card();
      await card.attach("#card-container");
      cardRef.current = card;
      setReady(true);
    };
    load().catch(e=>setError(e.message||"Failed to load Square SDK"));
  }, []);

  const link = async ()=>{
    try{
      setError("");
      const result = await cardRef.current.tokenize();
      if(result.status !== "OK") throw new Error(result.errors?.[0]?.message || "Tokenization failed");

      // Send nonce to your backend for card-on-file creation
      const resp = await fetch("/api/square/create-card", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ nonce: result.token })
      });
      const out = await resp.json();
      if(out.success){ onLinked?.(); onClose(); }
      else throw new Error(out.message || "Card link failed");
    }catch(e){
      setError(e.message);
    }
  };

  return (
    <div className="modal-bg" onClick={(e)=>e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <h3 style={{marginTop:0}}>Link Card (Square)</h3>
        <p className="small">Sandbox demo. Do not use production keys in the browser. Replace env vars and add the backend route described in the comment.</p>
        <div id="card-container" className="panel" style={{minHeight:100, display:"grid", placeItems:"center"}}></div>
        {error && <p className="small" style={{color:"var(--danger)"}}>{error}</p>}
        <div className="row" style={{justifyContent:"flex-end"}}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!ready} onClick={link}>Link Card</button>
        </div>
      </div>
    </div>
  );
}
