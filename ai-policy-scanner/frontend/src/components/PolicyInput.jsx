import React, { useState } from 'react';
import axios from 'axios';

const EXAMPLE_POLICIES = [
  {
    label: "🔴 Weak Policy",
    text: `Our company uses AI systems to make automated hiring decisions. We collect user data including personal information, browsing history, and behavioral patterns. Data is stored on our servers indefinitely. We use third-party AI models to process applications. Users have no way to appeal automated decisions. We share data with our partners for advertising purposes without explicit user consent.`
  },
  {
    label: "🟡 Medium Policy",
    text: `Our AI system collects user data to provide personalized recommendations. We use machine learning to make automated decisions. Users can contact us at privacy@company.com for concerns. We store data on secure servers and use encryption to protect user information. We obtain consent before processing data and allow users to request deletion.`
  },
  {
    label: "🟢 Strong Policy",
    text: `Our AI system classifies risk levels according to EU AI Act tiers. We maintain human oversight for all automated decisions. Users are informed about AI interactions through transparency disclosures. We collect only minimum necessary data for the stated purpose. Data is retained for 90 days then deleted. Users must provide explicit consent before data collection. Users have the right to erasure upon request. We notify authorities within 72 hours of any data breach. Our Data Protection Officer can be reached at dpo@company.com. Technical documentation is maintained for all AI systems. Regular accuracy and robustness testing is conducted. Conformity assessments are completed before deployment.`
  }
];

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
    <div>
      {/* How it works */}
      <div className="card">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Paste your AI policy text</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <p>AI analyzes against EU AI Act & GDPR</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Get risk scores & compliance gaps</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <p>Get auto-fix suggestions</p>
          </div>
        </div>
      </div>

      {/* Model info */}
      <div className="card model-info">
        <h2>Powered By</h2>
        <div className="model-grid">
          <div className="model-item">
            <span className="model-icon">🤖</span>
            <div>
              <h4>GPT-OSS 120B via Groq</h4>
              <p>Large language model for policy analysis</p>
            </div>
          </div>
          <div className="model-item">
            <span className="model-icon">⚖️</span>
            <div>
              <h4>EU AI Act Framework</h4>
              <p>7 key compliance requirements checked</p>
            </div>
          </div>
          <div className="model-item">
            <span className="model-icon">🛡️</span>
            <div>
              <h4>GDPR Framework</h4>
              <p>7 key data protection requirements checked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Policy input */}
      <div className="card">
        <h2>Paste Your AI Policy</h2>
        <p className="subtitle">Try one of our examples or paste your own:</p>
        <div className="example-buttons">
          {EXAMPLE_POLICIES.map((ex, i) => (
            <button
              key={i}
              className="example-btn"
              onClick={() => setText(ex.text)}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <textarea
          rows={10}
          placeholder="Paste your company's AI policy text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleScan}>Scan Policy</button>
      </div>
    </div>
  );
}

export default PolicyInput;