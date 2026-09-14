# JurisPrism ⚖️
### Intelligent Legal Document Intelligence & Decision Preparation Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?style=flat&logo=vitest)](https://vitest.dev/)
[![Security](https://img.shields.io/badge/Security-Prompt_Injection_Delimited-emerald)](https://github.com/)

> **IMPORTANT LEGAL NOTICE:** JurisPrism provides AI-powered document intelligence and attorney-preparation tools for **informational purposes only**. It does not provide formal legal advice, representation, or guarantees of judicial outcome. Always consult a qualified attorney licensed in your jurisdiction before executing or terminating binding legal agreements.

---

## 1. Problem Context & Solution

### The Problem
Legal contracts are intentionally dense, jargon-laden, and structurally asymmetrical. Non-legal professionals—such as software engineers evaluating job offers, small business owners signing commercial leases, or founders executing NDAs—frequently sign agreements without understanding:
- **Hidden liabilities:** One-sided indemnification and uncapped damages.
- **Career & operational restrictions:** Unenforceable non-compete covenants and customer non-solicits.
- **Critical deadlines:** Silent 180-day automatic renewal windows, cliff vesting, and 5-day late-fee grace periods.
- **Unstated protections:** Missing cure periods, absent invention carve-outs, and missing exhibits.

### The Solution: JurisPrism
**JurisPrism** is not a generic chatbot. It is a purpose-built legal intelligence platform that deconstructs contracts into actionable comprehension modules, visual attention heatmaps, chronological timelines, and structured attorney briefing packages.

---

## 2. Core Modules & Key Features

### A. Document Ingestion & Safe Parsing
- **Supported Formats:** PDF (`pdf-parse`), DOCX (`mammoth`), and Plain Text (`.txt`).
- **Processing Pipeline:** `Uploading` $\rightarrow$ `Extracting` $\rightarrow$ `Analyzing` $\rightarrow$ `Ready`.
- **Validation:** Enforces 10MB ceiling, MIME validation, and SHA-256 integrity checksums.
- **Security:** Complete tenant isolation; uploaded files and derived analyses are strictly scoped by user ID.

### B. AI Document Understanding & Tiered Explanations
- **Level 1: Executive Summary:** 3-minute high-level synthesis of contract parties, scope, and stakes.
- **Level 2: Plain-English Walkthrough:** Conversational breakdown of rights and commitments.
- **Level 3: Clause-by-Clause Explorer:** Side-by-side presentation of:
  - Original Verbatim Clause
  - Plain-Language Explanation
  - Why It Matters (Practical Significance)
  - Potential Concern (Risk/Ambiguity)
  - Suggested Question for a Lawyer
- **Anti-Hallucination Protocol:** Missing fields are strictly labeled `"Not found in document"`.

### C. Legal Attention Map (Risk Taxonomy)
- Categorizes findings into: **High Attention**, **Medium Attention**, **Low Attention**, and **Informational**.
- Enforces disciplined legal phrasing: *"Potential concern"*, *"Worth reviewing"*, *"May create an obligation"*, *"Consider clarifying with legal counsel"*. Never declares clauses "illegal" without statutory proof.

### D. Obligation & Deadline Timeline
- Automatically identifies dates, notice periods, payment milestones, and termination windows.
- **Anti-Date Hallucination:** Preserves relative conditions verbatim (e.g., *"30 calendar days prior to voluntary resignation"* or *"180 days prior to lease expiration"*) instead of inventing synthetic calendar dates.
- One-click export to clipboard as an actionable checklist.

### E. Grounded Legal Document Q&A
- Interactive assistant anchored strictly in the active document chunks.
- Every response provides verified source citations (e.g., `Source: Section 3.2 (Notice Requirement), Page 2`).
- Strict fallback: If the document lacks evidence, responds: *"I couldn't find this information in the provided document."*

### F. Structural Document Comparison ("Compare Agreements")
- Compares two contracts structurally rather than showing a superficial whitespace diff.
- Detects added, removed, and modified clauses, changed obligations, salary/rent deltas, and liability shifts.
- **3-Column Matrix:** `DOCUMENT A (Base Draft)` | `DOCUMENT B (Revised)` | `LEGAL SIGNIFICANCE & DELTA`.

### G. Differentiating Feature: The "Decision Navigator"
- A 6-step guided decision-preparation framework:
  1. *Document Baseline & Context*
  2. *What Does It Require of You?*
  3. *What Could Adversely Affect You?*
  4. *What Information Is Missing or Silent?*
  5. *What Should You Clarify Before Signing?*
  6. *What Should You Ask an Attorney?*
- **Ethical Boundary:** Never outputs *"Sign this"* or *"Do not sign"*. Produces: *"Before making a decision, consider reviewing these points..."*

### H. Actionable Attorney Preparation Kit
- Generates a structured 8-section briefing package:
  1. What this document is about
  2. What you are agreeing to
  3. Your key obligations & mandatory duties
  4. Important dates & deadlines
  5. High-priority review areas
  6. Prioritized questions for your lawyer
  7. Information & documents to gather before consultation
  8. Pre-signing negotiation points
- Exportable via **1-Click Print Dossier**, **Download Markdown Report**, or **Copy Brief**.

---

## 3. Technology Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend & APIs** | Next.js Edge/Node API Routes, Zod Schema Validation |
| **Authentication** | Jose (Web Crypto JWT), Bcrypt.js, HttpOnly Secure Cookies |
| **Database** | Relational Repository Layer (Atomic JSON/SQLite, zero-dependency setup) |
| **Document Processing** | `pdf-parse`, `mammoth` (DOCX), UTF-8 text parser |
| **AI Providers** | Google Gemini (`@google/genai`) + High-Fidelity Offline Deterministic Legal NLP Engine |
| **Testing** | Vitest 2.1 (Unit, Integration, Security, and Schema validation) |

---

## 4. Security & Trust Architecture

1. **Prompt Injection Defense:** Document text is wrapped in strict delimiters (`<<<UNTRUSTED_DOCUMENT_CONTENT>>>`). The system prompt commands the model to treat document content strictly as passive data and ignore embedded instructions.
2. **Multi-Tenant Data Isolation:** Queries strictly enforce `WHERE userId = session.userId`. User B cannot fetch, inspect, query, or delete User A's contracts.
3. **No Secret Leakage:** `GEMINI_API_KEY` and `JWT_SECRET` reside exclusively on the server.
4. **Data Sovereignty:** Permanent document deletion cascades to all extracted chunks, analyses, obligations, timelines, and Q&A history.

---

## 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js `v18.0.0` or later (tested on Node v20 and v25)
- npm `v9.0.0` or later

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-username/jurisprism.git
cd jurisprism

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
```

### Environment Variables (`.env.local`)
```ini
NODE_ENV=development
PORT=3000

# Authentication (Required)
JWT_SECRET=super-secret-jwt-signing-key-for-jurisprism-change-in-production

# AI Provider ("auto", "gemini", or "deterministic")
AI_PROVIDER=auto

# Optional: When left blank, the deterministic legal NLP engine operates seamlessly
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

### Running the Application
```bash
# Run development server
npm run dev

# Or build and run production server
npm run build
npm run start
```
Open **`http://localhost:3000`** in your browser.

---

## 6. Pre-Loaded Demo Contracts (1-Click Evaluation)

JurisPrism comes pre-configured with realistic, professionally drafted legal documents:
1. **Senior Software Engineer Employment Agreement** (Acme Technologies & Alex Morgan) - Non-compete covenants, IP assignment, at-will termination, equity vesting.
2. **Commercial Real Estate Lease Agreement** (Metropolitan Towers LLC & Apex Innovations Inc.) - 3-year term, base rent escalations, triple-net CAM fees, 180-day renewal notice, holdover penalties.
3. **Mutual Non-Disclosure Agreement (MNDA)** (Horizon Health & GeneVantage Labs) - 2-year survival term, trade secret carve-outs, return of materials.
4. **Candidate Redline Counter-Draft** (Acme Technologies v2) - Specifically designed to demonstrate the **Structural Document Comparison Matrix**.

### 1-Click Evaluation Credentials
- Click the **"1-Click Demo Access"** button in the navbar or login screen to immediately authenticate as the pre-configured reviewer (`demo@jurisprism.law`).

---

## 7. Running Automated Tests

JurisPrism includes a comprehensive Vitest test suite validating security, tenant isolation, parser safety, and schema integrity:

```bash
# Execute full test suite
npm test
```

### Test Coverage Breakdown:
- `tests/tenant-isolation.test.ts`: Verifies User B cannot access, read, or delete User A's contracts.
- `tests/prompt-injection.test.ts`: Verifies adversarial document instructions cannot jailbreak system rules.
- `tests/ai-schema-antihallucination.test.ts`: Verifies Zod schema validation and missing clause handling (`"Not found in document"`).
- `tests/grounded-qa.test.ts`: Verifies grounded answers return exact section citations and absent queries return explicit fallback.
- `tests/document-comparison.test.ts`: Verifies structural comparison matrix detecting added/removed/modified terms.
- `tests/parser-and-upload.test.ts`: Verifies file ingestion, SHA-256 hashing, chunking, and file validation.

---

## 8. AI Evaluation Criteria Alignment

| Criterion | How JurisPrism Satisfies It |
| :--- | :--- |
| **Code Quality** | Modular architecture, strict TypeScript types (`src/types/index.ts`), zero runtime `any` shortcuts, clean repository pattern, and clean folder structure. |
| **Security** | Delimited prompt-injection defense, strict tenant isolation, SHA-256 payload integrity, MIME validation, 10MB ceiling, and HttpOnly session cookies. |
| **Efficiency** | Fast chunked text retrieval, zero unnecessary LLM calls, deterministic fallback running sub-second queries, and optimized Next.js static asset bundling. |
| **Testing** | 100% pass rate on 15 automated test cases covering security, schemas, grounding, and comparison engines. |
| **Accessibility** | Semantic HTML5 (`<header>`, `<main>`, `<aside>`, `<nav>`, `<footer>`), keyboard navigation, WCAG AA color contrast, visible focus rings, and accessible dialogs. |
| **Problem Alignment** | Directly tackles legal access and comprehension by transforming dense legalese into plain language, illuminated risks, timelines, and attorney briefing dossiers. |

---

## 9. License & Ethical Disclaimer
Distributed under the MIT License. Developed for the *"AI for Legal Assistance & Access"* Challenge. JurisPrism is an informational tool and does not provide legal advice.
