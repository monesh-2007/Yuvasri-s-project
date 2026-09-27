import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

function RiskDashboard({ report }) {
  const data = [
    { name: 'Overall', score: report.summary.overall_score, fill: '#6366f1' },
    { name: 'EU AI Act', score: report.summary.eu_ai_act_score, fill: '#22c55e' },
    { name: 'GDPR', score: report.summary.gdpr_score, fill: '#f59e0b' },
    { name: 'Transparency', score: report.summary.transparency_score, fill: '#3b82f6' },
  ];

  return (
    <div className="card">
      <h2>Risk Score Dashboard</h2>
      <div className="scores-grid">
        {data.map((item, i) => (
          <div key={i} className="score-box">
            <div className="score-circle" style={{ borderColor: item.fill }}>
              <span style={{ color: item.fill }}>{item.score}</span>
            </div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart innerRadius="20%" outerRadius="90%" data={data}>
          <RadialBar dataKey="score" label={{ position: 'insideStart', fill: '#fff' }} />
          <Legend />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskDashboard;