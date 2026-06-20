# Changelog

All notable changes to this project will be documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [1.0.0] - 2026-06-20

### Added
- **Ecosystem Simulation**: Interactive EcoWorld SVG canvas reflecting user daily carbon scores in real-time.
- **Emission Factor Engine**: Integrated verified emission factors (EPA, DEFRA, Our World in Data) across 5 logging categories (Transport, Food, Energy, Shopping, Lifestyle).
- **Gamification Mechanics**: level system, daily/weekly missions, and 24+ unique achievements categorized by rarity.
- **AI Carbon Coach**: Real-time personalized coaching assistant powered by Groq Cloud's Llama-3, with prompt context injection.
- **Security Headers**: Configured HSTS, CSP, X-Frame-Options, Referrer-Policy, and X-Content-Type-Options in `next.config.ts`.
- **Accessibility Improvements**: Added skip-to-main link, focus rings, prefers-reduced-motion media controls, and correct semantic headings.
- **Comprehensive Unit Testing**: Formulated 49 tests in Vitest covering calculations, achievements, level mechanics, and API routing.
- **Code Quality Upgrades**: Replaced all `any` types, removed unused icon imports, and resolved linter warnings across pages.
