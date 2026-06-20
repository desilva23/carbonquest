# Code Quality Standards
## CarbonQuest — Gamified Carbon Footprint Coach

---

## 1. Frontend & Logic Standards (TypeScript 5.x)

### Strict Type Safety
- **Compiler Options**: Strict mode enabled (`tsconfig.json`), requiring explicit types, prohibiting implicit returns, and flagging unused parameters or local variables.
- **Rule of No `any`**: TypeScript `any` types are prohibited inside core source logic; `unknown` is used for runtime errors, and specific interfaces/types define the shape of models.

### Style & Formatting
- **Prettier Settings**: Configured with single quotes, semi-colons, tab width of 2 spaces, and trailing commas (ES5) for uniformity.
- **EditorConfig**: Standardizes indent styles, end-of-line LF characters, and trailing whitespace removals across all editors.

Run: `npm run lint` and `npx tsc --noEmit`

---

## 2. React & Component Patterns (Next.js 16)

- **Functional Components**: All views and visual models are functional components utilizing hooks for side effects and memoization (`useMemo`, `useCallback`).
- **Store Hook Pattern**: Application state resides in a custom centralized store hook (`src/lib/store.ts`) that manages level progression, streaks, activities, and achievements.
- **Impure Operations**: Impure functions (such as generating random values) are decoupled from rendering processes to guarantee render purity and avoid unstable layout shifts.

---

## 3. Accessibility Standards (WCAG 2.1 AA)

- **Accessible Controls**: Inputs are linked with descriptive `<label htmlFor>` elements and explicit helper text via `aria-describedby`.
- **Keyboard Access**: Focus outlines are explicitly configured via focus rings, ensuring keyboard users can navigate every view.
- **Landmarks & Semantics**: Proper layout landmarks (`<main>`, `<nav>`, `<header>`) partition the site structure logically.
- **Skip Links**: A skip-to-main-content bypass block is present to allow screen readers to jump navigation lists.

---

## 4. Git & CI Workflows

### Commit Conventional Formatting
- `feat`: Implementation of a new feature (e.g. badges, canvas animation)
- `fix`: Resolution of a bug or issue (e.g. calculation adjustments)
- `test`: Addition of test coverage or test suite setups
- `docs`: Modifying documentation, PRD, or README markdown

### Pipeline Verification
Our GitHub Actions CI pipeline validates three gates before deployment:
1. `typecheck`: Runs `tsc --noEmit` to verify type compilations.
2. `lint`: Runs `eslint` to check structural code warnings.
3. `test`: Executes `vitest run` to run the 49 unit tests.
