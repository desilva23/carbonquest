# Testing Strategy
## CarbonQuest — Gamified Carbon Footprint Coach

---

## 1. Test Architecture & Coverage

We maintain a suite of unit and integration tests written in **Vitest** that cover all core mathematical logic, game mechanics, and AI routing.

| Layer | Coverage Area | Framework | Test Count | Status |
|-------|---------------|-----------|------------|--------|
| **Carbon Engine** | Calculations, emission factors, EcoScore conversion, level ranges | Vitest | 21 tests | ✅ Passing |
| **Gamification** | Missions tracker, badge unlocking, experience rewards, streaks | Vitest | 20 tests | ✅ Passing |
| **API Proxy** | Route endpoints, Groq completions, key verification, fallbacks | Vitest | 8 tests | ✅ Passing |

---

## 2. Test Suite Breakdown

### `carbon-data.test.ts` — Emission & Progression Logic (21 tests)
- **Calculation Accuracy**: Asserts correct arithmetic output for transport, diet, shopping, energy, and lifestyle categories.
- **EcoScore Scaling**: Asserts bounds mapping where zero emissions yield 100, average emissions scale linearly, and high emissions cap at 0.
- **Level & Title Mapping**: Verifies correct XP milestones (Seedling, Sprout... Eco Legend) based on accumulated XP values.

### `missions-achievements.test.ts` — Engagement & Gamification (20 tests)
- **Badge Rules**: Tests automatic award parameters (e.g. logging a car-free day unlocks "Transit Hero").
- **Mission Progress**: Checks daily mission tracking updates and reward claiming mechanisms.
- **Uniqueness checks**: Ensures all badge IDs are unique and reference distinct assets.

### `ai-coach.test.ts` — AI Coach Integration (8 tests)
- **Groq Mocking**: Employs Vitest spies and mocks to emulate Llama-3 completions without real network hits.
- **API Key Ping**: Tests key validation endpoint to verify custom token configuration.
- **Resilience & Fallback**: Simulates rate limit errors, empty outputs, and missing environment keys to assert that standard offline recommendations are generated instead of throwing server exceptions.

---

## 3. Running the Tests

```bash
# Execute the suite once
npm test

# Run tests in hot-reload watch mode
npm run test:watch
```
