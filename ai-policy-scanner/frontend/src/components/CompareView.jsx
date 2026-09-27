import React, { useState } from 'react';
import axios from 'axios';

function CompareView() {
  const [policyA, setPolicyA] = useState('');
  const [policyB, setPolicyB] = useState('');
  const [nameA, setNameA] = useState('Policy A');
  const [nameB, setNameB] = useState('Policy B');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!policyA.trim() || !policyB.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/compare', {
        policy_a: policyA,
        policy_b: policyB,
        name_a: nameA,
        name_b: nameB
      });
      setResult(res.data.result);
    } catch (err) {
      alert('Error comparing policies. Make sure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Compare Two Policies</h2>
      <div className="compare-grid">
        <div>
          <input value={nameA} onChange={e => setNameA(e.target.value)} placeholder="Company A name" />
          <textarea rows={8} value={policyA} onChange={e => setPolicyA(e.target.value)} placeholder="Paste Policy A..." />
        </div>
        <div>
          <input value={nameB} onChange={e => setNameB(e.target.value)} placeholder="Company B name" />
          <textarea rows={8} value={policyB} onChange={e => setPolicyB(e.target.value)} placeholder="Paste Policy B..." />
        </div>
      </div>
      <button onClick={handleCompare}>Compare Policies</button>
      {loading && <p className="loading">Comparing...</p>}
      {result && (
        <div className="compare-result">
          <h3>🏆 Winner: {result.overall_winner}</h3>
          <div className="compare-grid">
            <div>
              <h4>{result.names?.[0]}</h4>
              <p>Overall: {JSON.parse(result.policy_a).summary.overall_score}/100</p>
              <p>EU AI Act: {JSON.parse(result.policy_a).summary.eu_ai_act_score}/100</p>
              <p>GDPR: {JSON.parse(result.policy_a).summary.gdpr_score}/100</p>
            </div>
            <div>
              <h4>{result.names?.[1]}</h4>
              <p>Overall: {JSON.parse(result.policy_b).summary.overall_score}/100</p>
              <p>EU AI Act: {JSON.parse(result.policy_b).summary.eu_ai_act_score}/100</p>
              <p>GDPR: {JSON.parse(result.policy_b).summary.gdpr_score}/100</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareView;