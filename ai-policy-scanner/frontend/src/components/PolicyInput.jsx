import React, { useEffect, useRef, useState } from 'react';
import { FileText, FileUp, ScanLine, Sparkles, X, RotateCcw } from 'lucide-react';
import mammoth from 'mammoth/mammoth.browser';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
  const [draftText, setDraftText] = useState(text);
  const filePicker = useRef(null);
  const syncTimer = useRef(null);

  useEffect(() => {
    setDraftText(text);
  }, [text]);

  useEffect(() => () => window.clearTimeout(syncTimer.current), []);

  const updateText = (value) => {
    setDraftText(value);
    window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(() => setText(value), 180);
  };

  const extractText = async (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['txt', 'md', 'csv'].includes(extension) || file.type.startsWith('text/')) {
      return file.text();
    }
    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return result.value;
    }
    if (extension === 'pdf' || file.type === 'application/pdf') {
      const document = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pages = await Promise.all(Array.from({ length: document.numPages }, async (_, index) => {
        const page = await document.getPage(index + 1);
        const content = await page.getTextContent();
        return content.items.map((item) => item.str).join(' ');
      }));
      return pages.join('\n\n');
    }
    throw new Error('Choose a PDF, DOCX, TXT, MD, or CSV document.');
  };

  const loadFile = async (file) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setFileNotice('File exceeds the 20 MB limit.');
      return;
    }
    setFileName(file.name);
    setFileNotice('Extracting document text…');
    try {
      const extracted = await extractText(file);
      if (!extracted.trim()) throw new Error('No selectable text found in this document.');
      window.clearTimeout(syncTimer.current);
      setDraftText(extracted);
      setText(extracted);
      setFileNotice('Text extracted and ready to scan.');
    } catch (error) {
      setFileNotice(error.message || 'Could not read this document. Try another file.');
    } finally {
      if (filePicker.current) filePicker.current.value = '';
    }
  };

  return (
    <div className={`policy-input ${compact ? 'compact-input' : ''}`} id="policy-input">
      {!compact && <div className={`dropzone ${isDragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); loadFile(event.dataTransfer.files[0]); }}>
        <input ref={filePicker} type="file" accept=".pdf,.txt,.md,.csv,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => loadFile(event.target.files[0])} />
        <div className="dropzone-icon"><FileUp size={20} /></div><strong>Drop your policy here</strong><span>PDF, TXT or DOCX <i /> up to 20 MB</span><button className="button-secondary" onClick={() => filePicker.current?.click()}><FileText size={14} /> Browse files</button>
      </div>}
      {fileName && !compact && <div className="uploaded-file"><span className="uploaded-file-icon"><FileText size={15} /></span><span><strong>{fileName}</strong><small>{fileNotice || 'Ready for analysis'}</small></span><button className="icon-button" aria-label="Remove document" onClick={() => { setFileName(''); setFileNotice(''); }}><X size={15} /></button></div>}
      {!compact && <div className="editor-heading"><div><span className="eyebrow">POLICY TEXT</span><small>Paste or edit policy content</small></div><div className="editor-actions"><button className="example-select" onClick={() => { window.clearTimeout(syncTimer.current); setDraftText(EXAMPLE_POLICIES[0].text); setText(EXAMPLE_POLICIES[0].text); }}><Sparkles size={13} /> Sample</button><button className="example-select reset-text" onClick={() => { window.clearTimeout(syncTimer.current); setDraftText(''); setText(''); setFileName(''); setFileNotice(''); }} title="Clear policy text"><RotateCcw size={13} /> Reset</button></div></div>}
      <textarea className="policy-textarea" rows={compact ? 6 : 9} placeholder="Paste your AI policy text here…" value={draftText} onChange={(event) => updateText(event.target.value)} aria-label="Policy text" />
      <div className="input-footer"><span>{draftText.trim() ? `${draftText.trim().split(/\s+/).length.toLocaleString()} words` : 'No policy text'} <i /> Stored in this browser</span><button className="button-primary" onClick={() => { window.clearTimeout(syncTimer.current); setText(draftText); onScan(draftText); }} disabled={!draftText.trim() || isScanning}><ScanLine size={15} /> {isScanning ? 'Scanning…' : 'Scan policy'}</button></div>
    </div>
  );
}

export default PolicyInput;