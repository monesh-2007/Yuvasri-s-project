# ⚖️ AI Policy Scanner

An AI-powered tool that scans company AI policies for compliance gaps against the **EU AI Act** and **GDPR**, provides risk scores, auto-fix suggestions, and side-by-side policy comparison.

Built for **LexHack 2026** — AI Safety, Ethics & Governance Track.

---

## 🚀 Features

- **Risk Score Dashboard** — Get scores (0-100) for EU AI Act, GDPR, Transparency, and Overall compliance
- **Compliance Gap Analysis** — Identifies exactly which requirements are missing
- **Auto-Fix Suggestions** — Generates ready-to-use policy clauses to fix each gap
- **Policy Comparison** — Compare two companies' AI policies side by side and declare a winner

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Recharts |
| Backend | FastAPI, Python |
| LLM | Groq API (GPT-OSS 120B) |
| Compliance Frameworks | EU AI Act, GDPR |

---

## 📋 Compliance Checks

**EU AI Act:**
- Risk classification system
- Human oversight
- Transparency obligations
- Data governance
- Technical documentation
- Accuracy and robustness
- Conformity assessment

**GDPR:**
- Data minimization
- Purpose limitation
- Data retention
- User consent
- Right to erasure
- Data breach notification
- Data protection officer

---

## ⚙️ Setup & Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
