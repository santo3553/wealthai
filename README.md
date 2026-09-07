# MetricsFlow ROI — Interactive B2B SaaS Cost-Savings Calculator

A production-ready single-page web application for calculating B2B SaaS ROI, workforce productivity gains, and cost-savings projections.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and **Recharts**.

---

## 🌟 Key Features

### 1. Modern SaaS Aesthetic & Two-Column Responsive Layout
- **Slate & Zinc Dark Palette** with radiant emerald and indigo accent glows.
- **Header**: Brand title `MetricsFlow ROI` with live `Production Demo` status badge.
- **Two-Column Split**:
  - **Left Panel (40% desktop, sticky)**: Industry presets, interactive sliders with synchronized numeric inputs, and tier selection cards.
  - **Right Panel (60% desktop)**: 4 Key Metric Cards, interactive Recharts projection graphs, detailed executive comparison table, and CTA callouts.

### 2. Interactive Sliders & Industry Presets
- **Quick Industry Presets**:
  - **Small Agency**: 10 FTEs, 6 hrs/wk, $35/hr, 35% gain, Starter Tier ($199/mo)
  - **Growth Stage**: 35 FTEs, 8 hrs/wk, $50/hr, 40% gain, Pro Tier ($499/mo)
  - **Enterprise Ops**: 120 FTEs, 12 hrs/wk, $70/hr, 50% gain, Enterprise Tier ($999/mo)
- **Workforce Inputs**:
  - **Team Size**: Slider + direct numeric field (1 to 250, default: 28)
  - **Weekly Manual Hours / Employee**: Slider + direct numeric field (1 to 30 hrs, default: 8 hrs)
  - **Average Hourly Labor Cost**: Slider + direct numeric field ($15 to $150/hr, default: $48/hr)
  - **Estimated Process Efficiency Gain**: Slider + direct numeric field (10% to 80%, default: 42%)
- **Software Tiers**:
  - **Starter**: $199/mo ($2,388/yr)
  - **Pro**: $499/mo ($5,988/yr, default, "Most Popular")
  - **Enterprise**: $999/mo ($11,988/yr)

### 3. Audited Calculation Engine (Real-Time Updates)
- $\text{Annual Manual Cost} = \text{Team Size} \times (\text{Weekly Hours} \times 52) \times \text{Hourly Cost}$
- $\text{Annual Hours Saved} = \text{Team Size} \times (\text{Weekly Hours} \times 52) \times (\frac{\text{Efficiency Gain}}{100})$
- $\text{Annual Gross Savings} = \text{Annual Hours Saved} \times \text{Hourly Cost}$
- $\text{Annual Platform Cost} = \text{Monthly Tier Cost} \times 12$
- $\text{Net Annual ROI (\$)} = \text{Annual Gross Savings} - \text{Annual Platform Cost}$
- $\text{ROI Multiple} = (\text{Annual Gross Savings} / \text{Annual Platform Cost})\text{.toFixed(1)} + \text{"x"}$
- $\text{Payback Period (Months)} = (\text{Annual Platform Cost} / (\text{Annual Gross Savings} / 12))\text{.toFixed(1)} + \text{" Months"}$

### 4. Visual Output & Charts (Recharts)
- **4 Hero Metric Cards**:
  1. **Net Annual Savings**: Large bold figure with glowing emerald accent.
  2. **ROI Multiple**: Value multiple badge (e.g. `39.2x`).
  3. **Total Hours Reclaimed**: Annual workforce hours unlocked (e.g. `4,892 hrs/yr`).
  4. **Payback Time**: Break-even velocity (e.g. `0.3 Months`).
- **Interactive Projections Chart**:
  - Toggle between **Grouped Bar Chart** and **Area Chart**.
  - Toggle between **Cumulative 3-Year** and **Annual Cash Flow** projections.
  - Custom glassmorphic tooltip displaying Status Quo Cost, Cost with Automation, and Net Savings.

### 5. Executive PDF Export & Embeddable Widget
- **Download Executive ROI Summary (PDF)**:
  - Lead capture modal with name, work email, and company name fields.
  - Multi-step simulated generation animation.
  - Triggers native `window.print()` with a dedicated print stylesheet (`@media print`) that renders a crisp 1-page executive memorandum complete with assumptions, comparisons, and sign-off blocks.
- **Embed Widget (`</>`)**:
  - Modal displaying responsive `<iframe>` integration code.
  - 1-click copy to clipboard with toast confirmation.
  - Customizable embed height presets.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
