import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  History,
  LayoutDashboard,
  LockKeyhole,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import PolicyInput from './components/PolicyInput';
import './index.css';
import './dashboard.css';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Document upload', icon: Upload },
  { id: 'analytics', label: 'Policy analytics', icon: Activity },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

const sentencePattern = /[^.!?]+[.!?]*/g;

function getAnalysis(text) {
  const sentences = text.match(sentencePattern) || [];
  const rules = [
    {
      id: 'retention',
      test: /indefinite|indefinitely|forever|without a retention period/i,
      title: 'Indefinite data retention',
      source: 'GDPR · Art. 5(1)(e)',
      severity: 'high',
      detail: 'No retention period or deletion trigger is defined for collected personal data.',
    },
    {
      id: 'consent',
      test: /without explicit user consent|without consent|no consent/i,
      title: 'Personal data shared without consent',
      source: 'GDPR · Art. 6',
      severity: 'high',
      detail: 'The policy describes data use without establishing a clear lawful basis.',
    },
    {
      id: 'oversight',
      test: /no way to appeal|cannot appeal|no appeal/i,
      title: 'No appeal path for automated decisions',
      source: 'EU AI Act · Art. 14',
      severity: 'medium',
      detail: 'People affected by automated outcomes need a clear route to human review.',
    },
  ];
  const issues = rules.flatMap((rule) => {
    const sentence = sentences.find((item) => rule.test.test(item));
    return sentence ? [{ ...rule, quote: sentence.trim() }] : [];
  });
  const score = Math.max(36, 92 - issues.reduce((total, issue) => total + (issue.severity === 'high' ? 16 : 9), 0));

  return {
    score,
    confidence: Math.min(99, 88 + Math.round(Math.min(text.length, 2000) / 200)),
    issues,
    scannedAt: new Date(),
  };
}

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [policyText, setPolicyText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(() => getAnalysis(''));
  const [isScanning, setIsScanning] = useState(false);
  const [openIssue, setOpenIssue] = useState('retention');
  const [showNotice, setShowNotice] = useState(false);
  const activeLabel = navigation.find((item) => item.id === activeView)?.label || 'Dashboard';

  const runScan = (text = policyText) => {
    if (!text.trim() || isScanning) return;
    setIsScanning(true);
    window.setTimeout(() => {
      setPolicyText(text);
      setAnalysis(getAnalysis(text));
      setOpenIssue('');
      setIsScanning(false);
      setShowNotice(true);
      setActiveView('dashboard');
    }, 1250);
  };

  const selectView = (view) => {
    setActiveView(view);
    if (view === 'upload') {
      window.setTimeout(() => document.getElementById('policy-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
    }
  };

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Fingerprint size={20} strokeWidth={1.8} /></div>
          {!collapsed && <span className="brand-name">policy<span>signal</span></span>}
          <button className="icon-button sidebar-toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {!collapsed && <div className="workspace-switcher"><span className="workspace-avatar">N</span><span className="workspace-meta"><strong>Northstar Labs</strong><small>Workspace</small></span><ChevronDown size={15} /></div>}
        {collapsed && <button className="workspace-avatar collapsed-workspace" title="Northstar Labs">N</button>}

        <div className="nav-label">Workspace</div>
        <nav className="side-nav" aria-label="Primary navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${activeView === id ? 'active' : ''}`} onClick={() => selectView(id)} title={collapsed ? label : undefined}>
              <Icon size={17} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && id === 'history' && <span className="nav-count">08</span>}
            </button>
          ))}
        </nav>

        {!collapsed && <div className="sidebar-bottom">
          <div className="usage-card"><div className="usage-heading"><span>Monthly scans</span><span>68%</span></div><div className="usage-track"><span /></div><small>68 of 100 scans used</small></div>
          <button className="help-link"><CircleHelp size={16} /><span>Help center</span><ArrowUpRight size={13} /></button>
          <div className="profile-row"><div className="profile-avatar">YR</div><div className="profile-copy"><strong>Yuvasri Rajendiran</strong><small>Free plan</small></div><MoreHorizontal size={17} /></div>
        </div>}
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeLabel}</strong></div>
          <div className="topbar-actions">
            <button className="search-trigger"><Search size={15} /><span>Search anything</span><kbd><Command size={10} /> K</kbd></button>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={17} /><i /></button>
            <div className="top-avatar">YR</div>
          </div>
        </header>

        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div key={activeView} className="view-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              {activeView === 'dashboard' && (
                <DashboardView
                  analysis={analysis}
                  isScanning={isScanning}
                  policyText={policyText}
                  setPolicyText={setPolicyText}
                  fileName={fileName}
                  setFileName={setFileName}
                  runScan={runScan}
                  openIssue={openIssue}
                  setOpenIssue={setOpenIssue}
                  showNotice={showNotice}
                  setShowNotice={setShowNotice}
                  onUploadClick={() => selectView('upload')}
                />
              )}
              {activeView === 'upload' && (
                <PageHeading eyebrow="DOCUMENT INTAKE" title="Add a policy to scan" description="Upload a policy document or paste its text to start a compliance review." icon={<Upload size={17} />}>
                  <PolicyInput text={policyText} setText={setPolicyText} fileName={fileName} setFileName={setFileName} onScan={runScan} isScanning={isScanning} />
                </PageHeading>
              )}
              {activeView === 'analytics' && <AnalyticsView analysis={analysis} isScanning={isScanning} />}
              {activeView === 'history' && <HistoryView onSelect={() => selectView('dashboard')} />}
              {activeView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="app-footer"><span><span className="online-dot" /> All systems operational</span><span>EU AI Act + GDPR frameworks <span className="footer-divider">·</span> v1.4.2</span></footer>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, icon, children }) {
  return <><div className="page-heading"><div className="heading-icon">{icon}</div><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></div>{children}</>;
}

function DashboardView({ analysis, isScanning, policyText, setPolicyText, fileName, setFileName, runScan, openIssue, setOpenIssue, showNotice, setShowNotice, onUploadClick }) {
  const highCount = analysis.issues.filter((issue) => issue.severity === 'high').length;
  const mediumCount = analysis.issues.filter((issue) => issue.severity === 'medium').length;
  const lowCount = analysis.issues.filter((issue) => issue.severity === 'low').length;

  const jumpToClause = (issue) => {
    setOpenIssue(openIssue === issue.id ? '' : issue.id);
    window.setTimeout(() => document.getElementById(`clause-${issue.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  return (
    <>
      <div className="page-heading dashboard-heading">
        <div><div className="eyebrow-row"><span className="eyebrow">POLICY SIGNAL</span></div><h1>Policy dashboard</h1></div>
        <div className="heading-actions"><button className="button-secondary" onClick={onUploadClick}><Upload size={15} /> Add policy</button><button className="button-primary" onClick={runScan} disabled={!policyText.trim() || isScanning}><ScanLine size={15} /> {isScanning ? 'Scanning…' : 'Scan'}</button></div>
      </div>

      {showNotice && <div className="notice-bar"><div className="notice-icon"><Sparkles size={15} /></div><p><strong>Scan complete.</strong> {analysis.issues.length} findings</p><button className="notice-link" onClick={() => document.getElementById('risk-breakdown')?.scrollIntoView({ behavior: 'smooth' })}>View <ArrowRight size={13} /></button><button className="notice-close" aria-label="Dismiss notice" onClick={() => setShowNotice(false)}><X size={15} /></button></div>}

      <section className="metrics-grid" aria-label="Policy metrics">
        {isScanning ? <MetricSkeletons /> : <>
          <ScoreCard score={analysis.score} />
          <div className="metric-card violations-card"><div className="metric-head"><span>Violations detected</span><span className="metric-icon warning"><ShieldAlert size={16} /></span></div><div className="metric-value">{String(analysis.issues.length).padStart(2, '0')}<span className="metric-delta neutral"><ArrowDownRight size={13} /> 2 this week</span></div><div className="severity-row">{highCount > 0 && <span className="severity high">{highCount} High</span>}{mediumCount > 0 && <span className="severity medium">{mediumCount} Medium</span>}{lowCount > 0 && <span className="severity low">{lowCount} Low</span>}{analysis.issues.length === 0 && <span className="severity clear"><Check size={12} /> No issues</span>}</div><div className="metric-foot"><span>Across 2 regulatory frameworks</span><span>↗</span></div></div>
          <div className="metric-card confidence-card"><div className="metric-head"><span>AI confidence</span><span className="metric-icon cyan"><Fingerprint size={16} /></span></div><div className="metric-value">{analysis.confidence}<span className="value-unit">%</span><span className="metric-delta positive"><ArrowUpRight size={13} /> 2.4%</span></div><div className="confidence-track"><span style={{ width: `${analysis.confidence}%` }} /></div><div className="metric-foot"><span>High confidence · 1,240 tokens</span><span>↗</span></div></div>
        </>}
      </section>

      <section className="analysis-section" aria-label="Policy analysis">
        <div className="section-title-row"><div><div className="section-title"><h2>Results</h2><span className="live-indicator"><i /> {policyText.trim() ? 'READY' : 'ADD POLICY'}</span></div></div><button className="select-button"><span className="file-mini"><FileText size={14} /></span>{fileName || 'No document'}<ChevronDown size={14} /></button></div>
        <div className="analysis-grid">
          <DocumentPanel text={policyText} issues={analysis.issues} isScanning={isScanning} fileName={fileName} onEdit={onUploadClick} />
          <AnalysisPanel issues={analysis.issues} isScanning={isScanning} openIssue={openIssue} onSelectIssue={jumpToClause} policyText={policyText} />
        </div>
      </section>

      <div className="bottom-grid">
        <div className="framework-card"><div className="bottom-card-header"><div><span className="eyebrow">FRAMEWORK COVERAGE</span><h3>Regulatory alignment</h3></div><button className="icon-button" aria-label="More framework options"><MoreHorizontal size={17} /></button></div><div className="framework-row"><div className="framework-symbol eu">EU</div><div className="framework-copy"><strong>EU AI Act</strong><small>7 control areas assessed</small></div><span className="framework-score">{Math.max(0, analysis.score - 7)}<small>/100</small></span><ChevronRight size={15} /></div><div className="framework-row"><div className="framework-symbol gdpr"><LockKeyhole size={15} /></div><div className="framework-copy"><strong>GDPR</strong><small>7 data principles assessed</small></div><span className="framework-score">{Math.max(0, analysis.score + 5)}<small>/100</small></span><ChevronRight size={15} /></div></div>
        <div className="activity-card"><div className="bottom-card-header"><div><span className="eyebrow">LATEST ACTIVITY</span><h3>Recent scans</h3></div><button className="text-button" onClick={() => document.querySelector('[aria-label="Primary navigation"] button:nth-child(4)')?.click()}>View all <ArrowRight size={13} /></button></div><div className="activity-row"><span className="activity-file"><FileCheck2 size={15} /></span><div className="activity-copy"><strong>{fileName}</strong><small>Just now <span>·</span> {analysis.issues.length} findings</small></div><span className="activity-status">Complete</span></div><div className="activity-row"><span className="activity-file muted"><FileText size={15} /></span><div className="activity-copy"><strong>Terms of service v2.pdf</strong><small>Yesterday <span>·</span> 4 findings</small></div><span className="activity-score">76 <small>/ 100</small></span></div></div>
      </div>
    </>
  );
}

function ScoreCard({ score }) {
  const circumference = 2 * Math.PI * 31;
  return <div className="metric-card score-card"><div className="metric-head"><span>Risk score</span><span className="metric-icon green"><Gauge size={16} /></span></div><div className="score-content"><div className="score-ring" style={{ '--score-offset': circumference * (1 - score / 100) }}><svg viewBox="0 0 76 76" aria-hidden="true"><circle className="ring-track" cx="38" cy="38" r="31" /><circle className="ring-value" cx="38" cy="38" r="31" /></svg><div className="ring-label"><strong>{score}</strong><small>/100</small></div></div><div className="score-context"><span className="score-status"><i /> {score >= 80 ? 'Good' : 'Review'}</span><small>Policy alignment</small></div></div><div className="metric-foot"><span>Overall</span><span>↗</span></div></div>;
}

function MetricSkeletons() {
  return <>{[0, 1, 2].map((item) => <div className="metric-card skeleton-card" key={item}><div className="skeleton-line short" /><div className="skeleton-line large" /><div className="skeleton-line medium" /><div className="skeleton-line full" /></div>)}</>;
}

function DocumentPanel({ text, issues, isScanning, fileName, onEdit }) {
  const parts = text.match(sentencePattern) || [text];
  const highlightedIds = new Map();
  issues.forEach((issue) => {
    const matchIndex = parts.findIndex((part) => part.toLowerCase().includes(issue.quote.toLowerCase().slice(0, 28)));
    if (matchIndex >= 0) highlightedIds.set(matchIndex, issue.id);
  });

  return <div className="document-panel panel-surface"><div className="panel-header"><div className="panel-heading"><span className="panel-icon document-icon"><FileText size={15} /></span><div><strong>Policy text</strong><small>{fileName || 'No document loaded'}</small></div></div><div className="panel-tools"><span className="doc-status"><i /> {text.trim() ? 'Ready' : 'Empty'}</span><button className="icon-button" aria-label="Document options"><MoreHorizontal size={17} /></button></div></div><div className="document-meta"><span><FileText size={12} /> POLICY</span><span>EN <ChevronDown size={11} /></span></div><div className={`document-body ${isScanning ? 'document-busy' : ''}`} id="document-body" tabIndex="-1">
    {isScanning ? <div className="document-loading"><span className="scan-beam" /><span>Scanning…</span></div> : text.trim() ? parts.map((part, index) => <p id={highlightedIds.has(index) ? `clause-${highlightedIds.get(index)}` : undefined} className={highlightedIds.has(index) ? 'document-clause' : ''} key={`${index}-${part.slice(0, 12)}`}><span className="line-number">{String(index + 1).padStart(2, '0')}</span><span>{part.trim()}</span>{highlightedIds.has(index) && <span className="clause-marker" />}</p>) : <div className="document-empty"><FileText size={19} /><span>Add a policy to see it here.</span></div>}
    </div><div className="document-footer"><span><span className="footer-lock"><LockKeyhole size={11} /></span> End-to-end encrypted</span><button onClick={onEdit}>Edit text <ArrowUpRight size={12} /></button></div></div>;
}

function AnalysisPanel({ issues, isScanning, openIssue, onSelectIssue, policyText }) {
  const severityCounts = ['high', 'medium', 'low'].map((severity) => issues.filter((issue) => issue.severity === severity).length);
  const totalIssues = Math.max(issues.length, 1);
  return (
    <div className="engine-panel panel-surface"><div className="panel-header"><div className="panel-heading"><span className="engine-mark"><Sparkles size={15} /></span><div><strong>Risk summary</strong><small>EU AI Act · GDPR</small></div></div><span className="engine-status"><i /> READY</span></div><div className="engine-summary"><div className="engine-orb"><span><Fingerprint size={21} /></span><i /><i /><i /></div><div><strong>{isScanning ? 'Scanning' : `${issues.length} findings`}</strong><p>{isScanning ? 'Checking clauses…' : issues.length ? 'Select to locate.' : 'No findings yet.'}</p></div></div><div className="risk-visual" role="img" aria-label={`${severityCounts[0]} high, ${severityCounts[1]} medium, and ${severityCounts[2]} low severity findings`}><div className="risk-bar">{['high', 'medium', 'low'].map((severity, index) => <span key={severity} className={severity} style={{ width: `${issues.length ? (severityCounts[index] / totalIssues) * 100 : 0}%` }} />)}</div><div className="risk-legend">{['High', 'Medium', 'Low'].map((severity, index) => <span key={severity}><i className={severity.toLowerCase()} />{severity}<strong>{severityCounts[index]}</strong></span>)}</div></div><div className="finding-heading"><span>FINDINGS</span><span>{String(issues.length).padStart(2, '0')}</span></div><div className="finding-list">
      {isScanning ? [0, 1, 2].map((item) => <div className="finding-skeleton" key={item}><span /><div><i /><i /></div></div>) : issues.length === 0 ? <div className="empty-findings"><span><ShieldCheck size={17} /></span><strong>{policyText.trim() ? 'No gaps found' : 'Ready to scan'}</strong><small>{policyText.trim() ? 'Policy looks clear.' : 'Add a policy to begin.'}</small></div> : issues.map((issue, index) => <button className={`finding-item ${openIssue === issue.id ? 'expanded' : ''}`} key={issue.id} onClick={() => onSelectIssue(issue)}><span className={`finding-index ${issue.severity}`}>{String(index + 1).padStart(2, '0')}</span><span className="finding-main"><span className="finding-title-line"><strong>{issue.title}</strong><ChevronDown size={14} /></span><span className="finding-source">{issue.source}</span>{openIssue === issue.id && <span className="finding-detail"><span>{issue.detail}</span><span className="quote-line">“{issue.quote}”</span><span className="jump-link">Locate <ArrowRight size={12} /></span></span>}</span><span className={`finding-severity ${issue.severity}`}>{issue.severity}</span></button>)}
      </div><div className="engine-footer"><span><Sparkles size={12} /> Powered by policy intelligence</span><span>~1.2s</span></div></div>
  );
}

function AnalyticsView({ analysis, isScanning }) {
  return <><PageHeading eyebrow="POLICY ANALYTICS" title="A clearer view of risk" description="Track the policy signals behind your compliance score." icon={<Activity size={17} />}><div className="analytics-layout"><div className="analytics-score panel-surface"><span className="eyebrow">OVERALL ALIGNMENT</span><div className="analytics-score-number">{analysis.score}<small>/100</small></div><div className="analytics-progress"><span style={{ width: `${analysis.score}%` }} /></div><p>Policy alignment across the EU AI Act and GDPR frameworks.</p></div><div className="analytics-breakdown panel-surface"><span className="eyebrow">FRAMEWORK BREAKDOWN</span><AnalyticsBar label="EU AI Act" score={Math.max(0, analysis.score - 7)} color="mint" /><AnalyticsBar label="GDPR" score={Math.max(0, analysis.score + 5)} color="cyan" /><AnalyticsBar label="Transparency" score={Math.max(0, analysis.score - 2)} color="blue" /><AnalyticsBar label="Human oversight" score={Math.max(0, analysis.score + 1)} color="orange" /></div><div className="analytics-findings panel-surface"><span className="eyebrow">OPEN FINDINGS</span><strong>{String(analysis.issues.length).padStart(2, '0')}</strong><p>{analysis.issues.length ? 'Items need policy owner review.' : 'No open compliance gaps.'}</p><span className="analytics-footnote"><Clock3 size={13} /> Updated just now</span></div></div></PageHeading>{isScanning && <div className="scan-toast"><span className="spinner" /> Refreshing policy signals…</div>}</>;
}

function AnalyticsBar({ label, score, color }) {
  return <div className="analytics-bar-row"><div><span>{label}</span><strong>{score}</strong></div><div className={`analytics-bar ${color}`}><span style={{ width: `${score}%` }} /></div></div>;
}

function HistoryView({ onSelect }) {
  const rows = [
    ['northstar-privacy-policy.txt', 'Today, 10:42 AM', '82', '3 findings', 'complete'],
    ['terms-of-service-v2.pdf', 'Yesterday, 4:18 PM', '76', '4 findings', 'complete'],
    ['ai-transparency-notice.docx', 'Sep 21, 11:06 AM', '91', '1 finding', 'complete'],
    ['data-processing-addendum.pdf', 'Sep 18, 9:34 AM', '—', 'Scan failed', 'failed'],
  ];
  return <><PageHeading eyebrow="SCAN ARCHIVE" title="Policy history" description="A record of recent policy reviews in this workspace." icon={<History size={17} />} /><div className="history-table panel-surface"><div className="history-toolbar"><div><strong>Recent scans</strong><span>4 documents</span></div><button className="button-secondary"><ChevronDown size={14} /> Last 30 days</button></div><div className="history-table-head"><span>DOCUMENT</span><span>SCANNED</span><span>SCORE</span><span>FINDINGS</span><span>STATUS</span></div>{rows.map(([file, date, score, findings, status]) => <button className="history-row" key={file} onClick={onSelect}><span className="history-document"><FileText size={16} /><strong>{file}</strong></span><span>{date}</span><span className={score === '—' ? 'muted-text' : ''}>{score}{score !== '—' && <small>/100</small>}</span><span>{findings}</span><span className={`history-status ${status}`}>{status === 'complete' ? <Check size={12} /> : <X size={12} />}{status}</span></button>)}</div></>;
}

function SettingsView() {
  return <><PageHeading eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Manage notifications and workspace defaults." icon={<Settings2 size={17} />} /><div className="settings-list panel-surface"><div className="settings-group-title">Notifications</div><PreferenceRow title="Scan completion alerts" description="Get notified when a policy scan is ready." defaultChecked /><PreferenceRow title="Critical risk alerts" description="Receive an alert when a high-severity issue is detected." defaultChecked /><div className="settings-group-title separated">Analysis preferences</div><PreferenceRow title="Include clause-level citations" description="Show references to the relevant regulatory articles." defaultChecked /><PreferenceRow title="Auto-save uploaded documents" description="Keep a copy in your workspace scan history." /></div></>;
}

function PreferenceRow({ title, description, defaultChecked = false }) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return <div className="preference-row"><div><strong>{title}</strong><p>{description}</p></div><button className={`switch ${enabled ? 'on' : ''}`} role="switch" aria-checked={enabled} aria-label={title} onClick={() => setEnabled(!enabled)}><span /></button></div>;
}

export default App;