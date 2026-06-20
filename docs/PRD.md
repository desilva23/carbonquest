# Product Requirements Document (PRD)
## CarbonQuest — Gamified Carbon Footprint Coach

**Version**: 1.0.0  
**Status**: Production-ready  

---

## 1. Problem Statement

Climate change can feel abstract and overwhelming. Standard calculators return numbers in kg CO₂ without daily context, leaving users unsure how their lifestyle actions compare to global averages, or what micro-habits yield high-impact carbon reductions. CarbonQuest bridges this gap by gamifying environmental tracker actions, offering relatable metaphors, and driving engagement through an interactive, visual ecosystem.

---

## 2. Target Persona

| Persona | Description |
|---------|-------------|
| **Green Beginners** | Individuals trying to build sustainable daily habits but need guidance and encouragement. |
| **Gamified Eco-Trackers** | Users who love streaks, XP gains, level-ups, and unlocking achievements as incentive to change behaviors. |
| **Sustainability Students** | Users seeking precise analogies (e.g. phone charging cycles) and direct AI coaches to evaluate questions. |

---

## 3. Core User Journey

```
Onboarding Quiz (baseline diet, transport, home energy metrics)
     │
     ▼
Landing Dashboard
     ├── EcoWorld SVG Canvas (live feedback on daily emissions)
     ├── Smart Carbon Logging (5 categories: Transport, Food, Energy, Shopping, Lifestyle)
     ├── Metaphor Analogy (converts carbon to charging cycles, etc.)
     └── Level & Streak Tracker
     │
     ▼
Missions & Badges
     ├── Complete daily/weekly tasks for XP rewards
     └── Unlock 24+ badges based on eco-behavior
     │
     ▼
AI Coach "Eco"
     └── Dynamic chat powered by Llama-3 (customized to streak, level, logged inputs)
```

---

## 4. Functional Requirements

### FR-1: Interactive EcoWorld
- Dynamically render SVG landscapes based on the user's daily eco-score:
  - **Healthy (70+)**: Sunny skies, green plains, trees, flying birds.
  - **Hazy (40-69)**: Golden-hour clouds, minimal vegetation, hazy air.
  - **Endangered (<40)**: Dark industrial smog, barren trunks.

### FR-2: Smart Carbon Tracker
- Real-time logging across Transport, Food, Energy, Shopping, and Lifestyle.
- Present immediate conversion analogies (e.g. "charging your phone 12 times").
- Scale EcoScore relative to global averages.

### FR-3: Gamified Missions & Badges
- 24+ distinct unlockable achievements with rarity types (Common, Uncommon, Rare, Epic, Legendary).
- Level progression (Level 1 Seedling to Level 15 Eco Legend).
- Streaks tracking to reward consecutive logging.

### FR-4: AI Coach ("Eco")
- Chat proxy endpoint connecting to Groq Cloud (Llama 3.3).
- Inject current user context (name, daily emissions, dietary preference, etc.) into the LLM system prompt.
- Graceful client-side fallback on rate limit, error, or missing keys.

---

## 5. Non-Functional Requirements

- **Privacy**: Zero server database tables; all logged inputs persist locally inside `localStorage`.
- **Accessibility**: 100% WCAG 2.1 Level AA compliant with skip links, focus visibility, and prefers-reduced-motion styling.
- **Testing Coverage**: Comprehensive test coverage across calculations, leveling, badges, and AI routing.
