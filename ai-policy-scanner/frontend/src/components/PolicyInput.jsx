import React, { useRef, useState } from 'react';
import { FileText, FileUp, ScanLine, Sparkles, X } from 'lucide-react';

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

function PolicyInput({ text, setText, fileName, setFileName, onScan, isScanning, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileNotice, setFileNotice] = useState('');
  const filePicker = useRef(null);

  const loadFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    if (/\.(txt|md|csv)$/i.test(file.name) || file.type.startsWith('text/')) {
      setText(await file.text());
      setFileNotice('Text extracted and ready to review.');
    } else if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
      setFileNotice('PDF added. Paste its policy text below to include it in this demo scan.');
    } else {
      setFileNotice('File added. Paste the policy text below to include it in this demo scan.');
    }
  };

  return (
    <div className={`policy-input ${compact ? 'compact-input' : ''}`} id="policy-input">
      {!compact && <div className={`dropzone ${isDragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); loadFile(event.dataTransfer.files[0]); }}>
        <input ref={filePicker} type="file" accept=".pdf,.txt,.md,.csv,.doc,.docx,text/plain,application/pdf" onChange={(event) => loadFile(event.target.files[0])} />
        <div className="dropzone-icon"><FileUp size={20} /></div><strong>Drop your policy here</strong><span>PDF, TXT or DOCX <i /> up to 20 MB</span><button className="button-secondary" onClick={() => filePicker.current?.click()}><FileText size={14} /> Browse files</button>
      </div>}
      {fileName && !compact && <div className="uploaded-file"><span className="uploaded-file-icon"><FileText size={15} /></span><span><strong>{fileName}</strong><small>{fileNotice || 'Ready for analysis'}</small></span><button className="icon-button" aria-label="Remove document" onClick={() => { setFileName(''); setFileNotice(''); }}><X size={15} /></button></div>}
      {!compact && <div className="editor-heading"><div><span className="eyebrow">POLICY TEXT</span><small>Review or edit the content before scanning</small></div><button className="example-select" onClick={() => setText(EXAMPLE_POLICIES[0].text)}><Sparkles size={13} /> Load sample policy</button></div>}
      <textarea className="policy-textarea" rows={compact ? 6 : 9} placeholder="Paste your AI policy text here…" value={text} onChange={(event) => setText(event.target.value)} aria-label="Policy text" />
      <div className="input-footer"><span>{text.trim() ? `${text.trim().split(/\s+/).length.toLocaleString()} words` : 'No policy text yet'} <i /> Demo mode · no data leaves this browser</span><button className="button-primary" onClick={onScan} disabled={!text.trim() || isScanning}><ScanLine size={15} /> {isScanning ? 'Scanning policy…' : 'Run compliance scan'}</button></div>
    </div>
  );
}

export default PolicyInput;