# 💎 WealthAI Premium — Luxury Mobile Finance

<div align="center">

![WealthAI Banner](public/favicon.svg)

### *High-End Private Wealth Manager & Mobile Finance Engine*

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Capacitor 8](https://img.shields.io/badge/Capacitor-8.0-119EFF?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4_oklch-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Android APK](https://img.shields.io/badge/Android-APK_v1.0-3DDC84?style=for-the-badge&logo=android)](https://github.com/santo3553/wealthai/blob/main/WealthAI-v1.0.apk)

[**Download Android APK**](https://github.com/santo3553/wealthai/raw/main/WealthAI-v1.0.apk) • [**Explore Codebase**](#-project-architecture) • [**Setup Guide**](#-local-development--build)

</div>

---

## 📲 Download & Install Android APK

You can download and install the pre-compiled Android APK directly on your phone:

- 📥 **Direct APK Download**: [**Download WealthAI-v1.0.apk (Raw)**](https://github.com/santo3553/wealthai/raw/main/WealthAI-v1.0.apk)
- 📦 **Package Name**: `com.santo.wealthai`
- 📱 **Target SDK**: Android 14+ (API 34–36)
- 🗜️ **File Size**: ~4.42 MB

### Installation on Android:
1. Click the download link above on your Android device.
2. If prompted, allow **Install from Unknown Sources** in your browser settings.
3. Tap **Install** and open **WealthAI**.

---

## 🎨 Visual Design System (Warm Dark Luxury)

WealthAI is built strictly to the Warm Dark Luxury design aesthetic utilizing the modern `oklch()` color space in Tailwind CSS v4:

| Element | Color Value | Description / CSS Variable |
| :--- | :--- | :--- |
| **Surface (Background)** | `#120d0b` | Deep Espresso (`oklch(0.138 0.012 43)`) |
| **Primary Brand** | `#fbbf24` | Amber Gold (`oklch(0.828 0.165 84.429)`) |
| **Secondary Brand** | `#f97316` | Bright Orange (`oklch(0.686 0.207 43.125)`) |
| **Primary Titles** | `#ffffff` | Pure White |
| **Secondary Info** | `rgba(255, 255, 255, 0.4)` | Subdued White |
| **Accent Indigo** | `#6366f1` | Top-Left Ambient Orb (`oklch(0.585 0.233 277.117)`) |
| **Accent Fuchsia** | `#c026d3` | Bottom-Right Ambient Orb (`oklch(0.627 0.265 303.9)`) |
| **Glass Panel** | `bg-white/5` | `border-white/10`, `backdrop-blur-3xl` |
| **Heavy Glass** | `bg-white/10` | `border-white/20`, `backdrop-blur-3xl` |
| **AI Glow** | `glow-orange` | `border-orange-500/35`, `box-shadow: 0 0 30px -5px rgba(249,115,22,0.35)` |

---

## 🧠 AI Service Logic (The "Brain")

The application integrates an autonomous private wealth manager persona:
> *"Act as a high-end private wealth manager."*

### 1. Financial Insights (Task 1)
- Sends current transaction history to Gemini.
- Generates **3 concise, actionable financial advice directives** (maximum 15 words each), strictly formatted as a valid JSON array of strings.

### 2. Quick Observation (Task 2)
- Produces a **10-word private wealth observation** for each newly logged transaction.

### 3. Bilingual Voice Speech Parsing (Task 3)
- Interfaces with the **Web Speech API** and **Capacitor Speech Recognition**.
- Analyzes speech transcripts in **English** and **বাংলা (Bangla)**:
  - **Expense Rule**: Triggers when words like `spent`, `buy`, `bought`, `bill`, `খরচ`, `কিনলাম` appear.
  - **Income Rule**: Triggers when words like `salary`, `received`, `got`, `বেতন`, `জমা` appear.
  - Extracts `title`, `amount` (numeric), and `category` (matched to `Salary`, `Dining`, `Tech`, `Shopping`, `Gift`, `Invest`).

### 4. Dual-Model Fallback Chain
1. **Primary**: `gemini-2.0-flash`
2. **Secondary Fallback**: `gemini-1.5-flash`
3. **Offline Heuristic Engine**: Seamless offline wealth advice so the app functions 100% reliably even without an internet connection or API key.

---

## 📱 Detailed Screen Blueprint

### 1. Dashboard (Home)
- **Header**: User greeting (`Good morning/afternoon/evening, Santo`), status indicator, and luxury verified profile avatar.
- **Balance Card**:
  - Prominent `#ffffff` net worth balance formatted with active base currency.
  - Precise percentage growth label calculated as:
    $$\text{Growth \%} = \frac{\text{currentMonthNet}}{|\text{balanceAtStartOfMonth}|} \times 100$$
- **Dual-Bar Cash Flow Chart**: Recharts `BarChart` comparing monthly Income and Expense with top rounded corners (`radius: [4, 4, 0, 0]`).
- **AI Insight Card**: Glowing orange card with subtle box shadow displaying the primary Gemini wealth directive.
- **Recent Activities**: Real-time snapshot of the latest capital movements.

### 2. Transaction Vault (History)
- **Search Engine**: Real-time filtering matching transaction title or category.
- **Filter Tabs**: Instant toggle between `All`, `Income`, and `Expense`.
- **Date Grouping**: Organizes ledger entries under `Today`, `Yesterday`, or `MMM dd, yyyy`.
- **Item Cards**: Left category-specific tinted icon, title and time, and right-side amount (Emerald `#10b981` for `+`, Pure White `#ffffff` for `-`).

### 3. Add Entry (The Overlay)
- **Framer Motion Spring Animation**: Slides up smoothly from the bottom on entry and slides down on exit (`damping: 25, stiffness: 200`).
- **Amount Input**: Extra large `text-6xl` typography for amount.
- **Category Selector**: Horizontal list featuring:
  - 💼 `Salary` (Wallet icon)
  - 🍽️ `Dining` (Utensils icon)
  - 💻 `Tech` (Laptop icon)
  - 🛍️ `Shopping` (ShoppingBag icon)
  - 🎁 `Gift` (Gift icon)
  - 📈 `Invest` (TrendingUp icon)
- **Smart Recurring Detection**: Checks 45-day transaction history; displays a warning banner when a similar title or amount exists:
  > *"This looks like a recurring monthly expense. Schedule it?"*
- **Voice Intelligence Modal**: Interactive microphone recorder with quick test prompt chips in both English and Bangla.

### 4. Portfolio Analytics
- **Donut Chart**: Recharts `PieChart` with `innerRadius: 60`, `outerRadius: 80` with center text showing `"Total Spent"`.
- **Category Legend**: Color-coded list of all categories with total spend and percentage allocations.
- **AI Directives**: 3 individual cards displaying Gemini's wealth management advice.

### 5. Profile & Admin
- **Financial Audit CSV Reporter**: Generates and downloads a `.csv` file via `Blob` with headers:
  `Name, Email, Transaction ID, Title, Category, Type, Amount, Date, Time`.
- **Financial History Accordion**: Expandable monthly progress bars tracking savings rates and cash flow.
- **Security & Preferences**: Interactive toggles for 2FA, Biometric Authentication, and Executive Push Notifications.
- **Linked Banking Desks**: Full CRUD manager to add/remove custodian bank accounts (e.g. JPMorgan Private Client, Goldman Sachs Marcus).
- **Gemini Key Configuration**: Allows configuring custom Google Gemini API keys.

---

## 🛠️ Tech Stack & Dependencies

```json
{
  "framework": "React 19.0.0 (Vite 6 + TypeScript 5.7)",
  "mobileBridge": "Capacitor 8.0 (Android native platform)",
  "styling": "Tailwind CSS v4 (oklch color space)",
  "animations": "framer-motion 12.4.7",
  "icons": "lucide-react 1.16.0",
  "charts": "recharts 2.15.1",
  "ai": "@google/generative-ai 0.24.0"
}
```

---

## 📂 Project Architecture

```
wealthai/
├── android/                             # Android native Gradle project (Capacitor 8)
│   ├── app/
│   │   ├── build.gradle                 # Application build config (compileSdk 36, targetSdk 36)
│   │   └── src/main/                    # Android manifest, Java sources & native assets
│   └── gradlew.bat                      # Gradle wrapper executable
├── public/
│   ├── favicon.svg                      # Luxury Amber Gold brand emblem
│   └── manifest.json                    # Web manifest with theme_color & background_color #120d0b
├── src/
│   ├── components/
│   │   ├── analytics/                   # AnalyticsScreen & Donut Chart
│   │   ├── dashboard/                   # BalanceCard, CashFlowChart, AIInsightCard
│   │   ├── entry/                       # AddEntryModal & VoiceEntryModal
│   │   ├── layout/                      # BackgroundOrbs, Header, BottomNav
│   │   ├── profile/                     # ProfileScreen & Financial History
│   │   └── transactions/                # TransactionsScreen & TransactionItem
│   ├── context/
│   │   ├── AppSettingsContext.tsx       # Settings, 2FA, Biometrics, Linked accounts
│   │   └── FinanceContext.tsx           # Transactions, balance, growth, recurring checks
│   ├── services/
│   │   ├── geminiService.ts             # Gemini 2.0 Flash primary, 1.5 Flash fallback, voice parser
│   │   └── voiceService.ts              # Speech recognition bridge (Web + Capacitor)
│   ├── types/
│   │   ├── finance.ts                   # Transaction, Category, Cashflow models
│   │   └── settings.ts                  # App Settings & Linked accounts models
│   ├── utils/
│   │   ├── csv.ts                       # Blob CSV reporter
│   │   ├── currency.ts                  # Intl.NumberFormat currency helper
│   │   └── date.ts                      # Date grouping ("Today", "Yesterday", "MMM dd, yyyy")
│   ├── App.tsx                          # Root application container
│   ├── index.css                        # Tailwind v4 oklch theme & glassmorphism
│   └── main.tsx                         # React 19 entrypoint
├── .github/workflows/
│   └── build-apk.yml                    # Automated GitHub Actions APK build workflow
├── capacitor.config.ts                  # Capacitor 8 config (appId: com.santo.wealthai)
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite 6 + React 19 + Tailwind v4 plugin
└── WealthAI-v1.0.apk                    # Compiled production Android APK binary
```

---

## 💻 Local Development & Build

### Prerequisites
- Node.js 20+ (v24 recommended)
- Java JDK 21
- Android SDK (API 34+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Web Development Server
```bash
npm run dev
```

### 3. Build Web Production Bundle
```bash
npm run build
```

### 4. Compile Android APK
```bash
# Sync web distribution to Android
npx cap sync android

# Compile Android Debug APK
cd android
./gradlew assembleDebug
```
The compiled APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🤖 GitHub Actions CI/CD

Every push to the `main` branch triggers the [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml) workflow:
1. Checks out repository and installs Node 20 & Java 21.
2. Compiles production web bundle with Vite.
3. Syncs native assets with Capacitor 8.
4. Executes `./gradlew assembleDebug`.
5. Uploads the fresh `WealthAI-Debug-APK` as a downloadable artifact.

---

## 📄 License
Private Client Portfolio Software — All Rights Reserved.
