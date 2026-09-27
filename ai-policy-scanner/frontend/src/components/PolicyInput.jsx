import React, { useState } from 'react';
import axios from 'axios';

function PolicyInput({ setReport, setLoading }) {
  const [text, setText] = useState('');

  const handleScan = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('https://ai-policy-scanner-2.onrender.com/scan', {
        policy_text: text
      });
      setReport(JSON.parse(res.data.result));
    } catch (err) {
      alert('Error scanning policy. Make sure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Paste Your AI Policy</h2>
      <textarea
        rows={10}
        placeholder="Paste your company's AI policy text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleScan}>Scan Policy</button>
    </div>
  );
}

export default PolicyInput;