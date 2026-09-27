import React from 'react';

function ReportView({ report }) {
  const allGaps = [
    ...report.gaps.eu_ai_act.map(g => ({ gap: g, source: 'EU AI Act' })),
    ...report.gaps.gdpr.map(g => ({ gap: g, source: 'GDPR' }))
  ];

  return (
    <div className="card">
      <h2>Compliance Gaps</h2>
      <div className={`status ${report.status.toLowerCase().replace(' ', '-')}`}>
        {report.status}
      </div>
      {allGaps.length === 0 ? (
        <p>✅ No gaps found!</p>
      ) : (
        <ul>
          {allGaps.map((item, i) => (
            <li key={i}>
              <span className="badge">{item.source}</span> {item.gap}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReportView;