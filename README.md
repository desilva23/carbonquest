# CarbonQuest 🌍

![CI Pipeline](https://img.shields.io/badge/CI--Pipeline-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-brightgreen)
![Security](https://img.shields.io/badge/security-CSP%20%26%20HSTS-blue)
![Next.js](https://img.shields.io/badge/next.js-16.2-black)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)

> **Understand, Track, and Reduce** your personal carbon impact through gamified experiences and real-time AI Coaching.

---

## 📌 Chosen Vertical: Personal Carbon Footprint

CarbonQuest implements a comprehensive **Understand → Track → Reduce** lifecycle:

| Lifecycle Phase | Component Details |
|-----------------|-------------------|
| **Understand** | Smart Carbon quiz captures daily lifestyle inputs. Deterministic calculators convert activities into kg CO₂ e with intuitive metaphors (e.g. charging cycles) and benchmarks (Global daily averages). |
| **Track** | Custom client-side state machine tracks logging streaks, experience points (XP), levels (from Seedling to Eco Legend), and unlocks 24+ badges. |
| **Reduce** | AI Carbon Coach ("Eco"), powered by Groq Cloud's Llama-3, reviews user context dynamically to suggest micro-habits, with robust local advice fallbacks. |

---

## ⚙️ Architecture & Logic Flow

```
Daily Activities (transport, food, energy, shopping, lifestyle)
                       │
                       ▼
            Smart Carbon Calculator
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
    EcoScore (0-100)           XP & Progression
         │                           │
         ▼                           ▼
  EcoWorld Canvas             Unlocks Badges
  (Dynamic SVG)               (24+ Achievements)
         │                           │
         └─────────────┬─────────────┘
                       ▼
               Central State Store ◄───► localStorage (Offline-first)
                       │
                       ▼
              POST /api/ai-coach
                       │
                       ▼
              AI Carbon Coach ("Eco")
              ├─ Groq Cloud (Llama 3.3) ──► Personalized advice
              └─ Local Fallback Engine  ──► Standby recommendations
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) · React 19 · TypeScript 5 (Strict) · Tailwind CSS & Custom CSS · Recharts · Lucide React
- **Logic & State**: Custom Central Store hook with browser-scoped local storage synchronization
- **AI Integrations**: Groq Cloud SDK (Llama-3.3-70b-versatile)
- **Quality Gates**: Vitest · ESLint · Prettier · EditorConfig · GitHub Actions CI pipeline

---

## 🚀 Quick Start — Local Development

### 1. Installation
Navigate to the directory and install dependencies:
```bash
cd carbonquest
npm install
```

### 2. Configure Environment Keys
Create a `.env.local` file in the root directory and append your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🧪 Running the Tests

We maintain a high-quality test suite with **49 tests** covering carbon mathematics, gamification mechanics, and proxy connections:

```bash
# Run the full test suite once
npm test

# Run tests in watch mode
npm run test:watch

# Verify strict TypeScript type compilation
npx tsc --noEmit

# Verify linter rules
npm run lint
```

---

## 🛡️ Security & Privacy by Design

- **No PII Collection**: Zero database tables are maintained on servers. All logged histories, streaks, and achievements remain completely client-side in the user's browser `localStorage`.
- **Anonymized AI Processing**: Prompts to Groq only include current metrics (e.g. daily totals, streaks, diet type) and exclude name variables to preserve privacy.
- **Next.js Security Middleware**: `next.config.ts` enforces CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer policies.

---

## 📝 Methodology & Source Citations

| Factor Category | Scientific Citation Source |
|-----------------|-----------------------------|
| **Transport** | UK DEFRA 2023 Vehicle GHG Factors |
| **Aviation** | ICAO Carbon Calculator Passenger Metrics |
| **Home Energy** | US EPA eGRID National Averages (0.233 kg CO₂/kWh) |
| **Dietary Choices** | Poore & Nemecek (2018) via Our World in Data |
| **Global Averages** | Our World in Data 2023 averages (~13.1 kg daily target) |
| **Paris Climate Targets** | IPCC Special Report 1.5°C 2050 benchmarks |
