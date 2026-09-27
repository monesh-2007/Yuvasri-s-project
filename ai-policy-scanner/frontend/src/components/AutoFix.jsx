import React from 'react';

function AutoFix({ report }) {
  const fixes = report.fixes;

  if (!fixes || Object.keys(fixes).length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h2>Auto-Fix Suggestions</h2>
      <p className="subtitle">Add these clauses to your policy to fix the gaps:</p>
      {Object.entries(fixes).map(([gap, suggestion], i) => (
        <div key={i} className="fix-item">
          <h4>❌ Missing: {gap}</h4>
          <div className="fix-suggestion">
            <p>{suggestion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AutoFix;