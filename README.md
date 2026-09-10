# WealthAI Premium — Luxury Mobile Finance

> **High-End Private Wealth Manager & Mobile Finance Engine** built with React 19, Tailwind CSS v4 (`oklch`), Framer Motion, Capacitor 8.0, Recharts, and Google Gemini 2.0 Flash.

---

## Key Highlights

- **Theme & Aesthetics**: Warm Dark Luxury palette with Deep Espresso (`#120d0b`), Amber Gold (`#fbbf24`), Orange (`#f97316`), frosted glass panels, and 3 blurred ambient background orbs.
- **AI Intelligence**: Powered by Google Gemini 2.0 Flash SDK (`@google/generative-ai`) with automatic fallback to Gemini 1.5 Flash and offline rule engines.
  - **Financial Insights**: Real-time actionable wealth advisory directives.
  - **Quick Observation**: 10-word AI observations on individual transactions.
  - **Bilingual Voice Parsing**: Native parsing for English and Bangla voice speech transcripts.
- **Financial Architecture**:
  - **Dashboard**: Net worth display with exact growth formula `(currentMonthNet / |balanceAtStartOfMonth|) * 100`, dual-bar cash flow chart, glowing orange AI card.
  - **Transactions Vault**: Real-time search engine, date grouping ("Today", "Yesterday", "MMM dd, yyyy"), and category indicators.
  - **Add Entry Overlay**: Framer Motion spring physics (`damping: 25, stiffness: 200`), `text-6xl` amount input, recurring expense detection banner, voice bridge.
  - **Portfolio Analytics**: Recharts Donut chart (`innerRadius: 60`, `outerRadius: 80`) with center "Total Spent", category percentage legend, and 3 AI directive cards.
  - **Profile & Admin**: Audit CSV generation via `Blob`, Financial History monthly progress bars, 2FA/Biometric security toggles, and linked custodian banking accounts CRUD.

---

## Tech Stack

- **Framework**: React 19 + Vite 6 + TypeScript
- **Mobile Bridge**: Capacitor 8.0 (Android ready: `com.santo.wealthai`)
- **Styling**: Tailwind CSS v4 (`oklch`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: `@google/generative-ai`

---

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
The compiled mobile-ready web assets will be generated in `dist/`.
