import React, { useState } from 'react';
import PolicyInput from './components/PolicyInput';
import ReportView from './components/ReportView';
import RiskDashboard from './components/RiskDashboard';
import AutoFix from './components/AutoFix';
import CompareView from './components/CompareView';
import './index.css';

function App() {
  const [report, setReport] = useState(null);
  const [mode, setMode] = useState('single');
  const [loading, setLoading] = useState(false);

  return (
    <div className="app">
      <header>
        <h1>⚖️ AI Policy Scanner</h1>
        <p>Check your AI policy against EU AI Act & GDPR</p>
        <div className="mode-toggle">
          <button onClick={() => setMode('single')} className={mode === 'single' ? 'active' : ''}>
            Single Policy
          </button>
          <button onClick={() => setMode('compare')} className={mode === 'compare' ? 'active' : ''}>
            Compare Policies
          </button>
        </div>
      </header>

      <main>
        {mode === 'single' ? (
          <>
            <PolicyInput setReport={setReport} setLoading={setLoading} />
            {loading && <p className="loading">Scanning policy...</p>}
            {report && (
              <>
                <RiskDashboard report={report} />
                <ReportView report={report} />
                <AutoFix report={report} />
              </>
            )}
          </>
        ) : (
          <CompareView />
        )}
      </main>
    </div>
  );
}

export default App;