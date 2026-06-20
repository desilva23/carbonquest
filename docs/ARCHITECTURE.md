# System Architecture Document
## CarbonQuest — Gamified Carbon Footprint Coach

---

## 1. Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS & Custom Vanilla CSS (with prefers-reduced-motion media controls)
- **Icons**: Lucide React
- **Testing**: Vitest (in a JSDOM environment)
- **AI Integration**: Groq Cloud SDK (Llama 3.3 model)

---

## 2. High-Level Flow & Components

```
                ┌──────────────────────────────────────────────┐
                │             Browser (React SPA)              │
                │                                              │
                │    ┌───────────────┐     ┌──────────────┐    │
                │    │   Dashboard   │◄───►│  Ecosystem   │    │
                │    │     Views     │     │ EcoWorld SVG │    │
                │    └───────┬───────┘     └──────────────┘    │
                │            │                                 │
                │            ▼                                 │
                │    ┌───────────────┐                         │
                │    │ Central Store │                         │
                │    │ (useStore.ts) │                         │
                │    └───────┬───────┘                         │
                └────────────┼─────────────────────────────────┘
                             │
                  Local I/O  │  POST /api/ai-coach
                             ▼
                ┌──────────────────────────┐
                │       localStorage       │ (Offline-First State)
                └──────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │   Next.js API Handler    │ (Server-Side Proxy)
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │        Groq Cloud        │ (Llama 3.3 LLM)
                └──────────────────────────┘
```

---

## 3. Data Structure Models

### UserProfile
```typescript
interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalCO2Saved: number;
  streak: number;
  lastActiveDate: string;
  joinDate: string;
  transport: string;
  diet: string;
  energySource: string;
  onboardingComplete: boolean;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  factorId: string;
  category: string;
  name: string;
  icon: string;
  quantity: number;
  unit: string;
  kgCO2: number;
  timestamp: string;
  xpEarned: number;
}
```

---

## 4. AI Coach API Proxy Flow

```
Browser POST /api/ai-coach
  │
  ▼
Read body (message, userContext, chatHistory, customApiKey)
  │
  ├─► Custom/Env API Key present?
  │     ├─► NO ──► Return Random Offline Fallback Tip (200 OK)
  │     └─► YES ─► Format System Prompt + Inject Context Variables
  │                  │
  │                  ▼
  │                Create Groq Client
  │                  │
  │                  ▼
  │                Fires completions.create(llama-3.3-70b-versatile)
  │                  │
  │                  ├─► SUCCESS ──► Return reply (200 OK)
  │                  └─► ERROR (Timeout/RateLimit) ──► Return Safe Standby Tip (200 OK)
```
