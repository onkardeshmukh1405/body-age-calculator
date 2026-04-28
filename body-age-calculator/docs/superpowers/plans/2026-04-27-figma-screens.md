# Figma Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 5 existing screens with new Figma designs and add 2 new screens (Registration, Success), wiring them into the existing React quiz flow.

**Architecture:** In-place replacement — each existing component file is rewritten to match the Figma design; two new component folders are added. State is extended in `types/index.ts` and `hooks/useQuiz.ts` to support the registration + success flow. All styling via CSS Modules; design tokens defined as CSS custom properties in `BodyAgeQuiz.module.css`.

**Tech Stack:** React 18, TypeScript, CSS Modules, Vite, Nunito font (already loaded in index.html)

---

## File Map

| Action | File |
|---|---|
| Modify | `index.html` — add font weights 400 + 600 to existing Nunito import |
| Modify | `src/features/BodyAgeQuiz/constants/theme.ts` — add design token constants |
| Modify | `src/features/BodyAgeQuiz/BodyAgeQuiz.module.css` — add CSS custom properties |
| Modify | `src/features/BodyAgeQuiz/types/index.ts` — add Screen values + QuizState fields |
| Modify | `src/features/BodyAgeQuiz/hooks/useQuiz.ts` — add SUBMIT_REGISTRATION action |
| Modify | `src/features/BodyAgeQuiz/utils/scoring.ts` — add getFactorAnalysis function |
| Rewrite | `src/features/BodyAgeQuiz/components/WelcomeScreen/index.tsx` + `.module.css` + `constants.ts` |
| Rewrite | `src/features/BodyAgeQuiz/components/AgeInput/index.tsx` + `.module.css` + `constants.ts` |
| Rewrite | `src/features/BodyAgeQuiz/components/QuizScreen/index.tsx` + `.module.css` + `constants.ts` |
| Rewrite | `src/features/BodyAgeQuiz/components/RevealScreen/index.tsx` + `.module.css` + `constants.ts` |
| Rewrite | `src/features/BodyAgeQuiz/components/ResultScreen/index.tsx` + `.module.css` + `constants.ts` |
| Create | `src/features/BodyAgeQuiz/components/RegistrationScreen/index.tsx` + `.module.css` + `constants.ts` |
| Create | `src/features/BodyAgeQuiz/components/SuccessScreen/index.tsx` + `.module.css` + `constants.ts` |
| Modify | `src/features/BodyAgeQuiz/index.tsx` — wire new screens + new hook values |

---

## Task 1: Foundation — font weights, design tokens, CSS custom properties

**Files:**
- Modify: `body-age-calculator/index.html`
- Modify: `src/features/BodyAgeQuiz/constants/theme.ts`
- Modify: `src/features/BodyAgeQuiz/BodyAgeQuiz.module.css`

- [ ] **Step 1: Update Nunito font weights in index.html**

Replace the existing Nunito link (weights 700;800;900) with:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update theme.ts with design token constants**

Replace the full contents of `src/features/BodyAgeQuiz/constants/theme.ts`:
```ts
export const COLORS = {
  primary: '#5300b7',
  accentRed: '#ff4b4b',
  accentGreen: '#58cc02',
  accentOrange: '#ff9600',
  accentBlue: '#1cb0f6',
  cta: '#ff845e',
  ctaBorder: '#e56a47',
  bg: '#fcf9f4',
  white: '#ffffff',
  text: '#4b4b4b',
  textMuted: '#6b7280',
  textLight: '#afafaf',
  border: '#e5e5e5',
} as const
```

- [ ] **Step 3: Add CSS custom properties to BodyAgeQuiz.module.css**

Read the existing file first, then prepend these custom properties inside the `:root` equivalent — add them to the `.root` class or at the top as a `:global(:root)` block. Replace the full file with:

```css
:global(:root) {
  --color-primary: #5300b7;
  --color-accent-red: #ff4b4b;
  --color-accent-green: #58cc02;
  --color-accent-orange: #ff9600;
  --color-accent-blue: #1cb0f6;
  --color-cta: #ff845e;
  --color-cta-border: #e56a47;
  --color-bg: #fcf9f4;
  --color-white: #ffffff;
  --color-text: #4b4b4b;
  --color-text-muted: #6b7280;
  --color-text-light: #afafaf;
  --color-border: #e5e5e5;
  --font-main: 'Nunito', sans-serif;
}

.root {
  font-family: var(--font-main);
  background: var(--color-bg);
  min-height: 100dvh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
}

/* Shared button styles */
.btnPill {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  border-radius: 999px;
  border: none;
  border-bottom: 4px solid;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.1s;
}

.btnPill:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.btnPill:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btnGreen {
  background: var(--color-accent-green);
  border-bottom-color: #46a302;
  color: #fff;
}

.btnOrange {
  background: var(--color-cta);
  border-bottom-color: var(--color-cta-border);
  color: #fff;
}

.btnPurple {
  background: var(--color-primary);
  border-bottom-color: #3a0082;
  color: #fff;
}

.btnSalmon {
  background: #ff4b4b;
  border-bottom-color: #d03030;
  color: #fff;
}

.btnOutline {
  background: #fff;
  border: 2px solid var(--color-accent-green);
  border-bottom: 4px solid var(--color-accent-green);
  color: var(--color-accent-green);
}

/* Shared card style */
.card {
  background: #fff;
  border: 2px solid var(--color-border);
  border-bottom: 4px solid var(--color-border);
  border-radius: 20px;
  padding: 24px;
}

/* Shared progress bar */
.progressWrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 8px;
}

.progressClose {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--color-text-light);
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.progressTrack {
  flex: 1;
  height: 8px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: var(--color-accent-green);
  border-radius: 999px;
  transition: width 0.3s ease;
}
```

- [ ] **Step 4: Commit**
```bash
git add body-age-calculator/index.html src/features/BodyAgeQuiz/constants/theme.ts src/features/BodyAgeQuiz/BodyAgeQuiz.module.css
git commit -m "feat: design tokens and shared CSS utilities"
```

---

## Task 2: Extend types and useQuiz hook

**Files:**
- Modify: `src/features/BodyAgeQuiz/types/index.ts`
- Modify: `src/features/BodyAgeQuiz/hooks/useQuiz.ts`

- [ ] **Step 1: Update types/index.ts**

Replace full file contents:
```ts
export type Screen = 'welcome' | 'age_input' | 'quiz' | 'reveal' | 'result' | 'registration' | 'success'

export interface AnswerOption {
  emoji: string
  label: string
  sublabel: string
  score: number
}

export interface Question {
  id: number
  text: string
  options: [AnswerOption, AnswerOption, AnswerOption, AnswerOption]
  greenBadge: string
  redBadge: string
  tip: string
}

export interface QuizState {
  screen: Screen
  age: number
  currentQuestion: number
  answers: number[]
  selectedOption: number | null
  bodyAge: number
  name: string
  phone: string
}

export type QuizAction =
  | { type: 'START' }
  | { type: 'SET_AGE'; age: number }
  | { type: 'SELECT_OPTION'; optionIndex: number; score: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'REVEAL_COMPLETE'; bodyAge: number }
  | { type: 'GO_TO_REGISTRATION' }
  | { type: 'SUBMIT_REGISTRATION'; name: string; phone: string }
  | { type: 'RESET' }
```

- [ ] **Step 2: Update hooks/useQuiz.ts**

Replace full file contents:
```ts
import { useReducer, useCallback } from 'react'
import type { QuizState, QuizAction } from '../types'
import { calculateBodyAge } from '../utils/scoring'

const initialState: QuizState = {
  screen: 'welcome',
  age: 0,
  currentQuestion: 0,
  answers: [],
  selectedOption: null,
  bodyAge: 0,
  name: '',
  phone: '',
}

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'age_input' }

    case 'SET_AGE':
      return {
        ...state,
        age: action.age,
        screen: 'quiz',
        currentQuestion: 0,
        answers: [],
        selectedOption: null,
      }

    case 'SELECT_OPTION': {
      const newAnswers = [...state.answers]
      newAnswers[state.currentQuestion] = action.score
      return { ...state, selectedOption: action.optionIndex, answers: newAnswers }
    }

    case 'NEXT_QUESTION': {
      if (state.selectedOption === null) return state
      const isLast = state.currentQuestion === 8
      if (isLast) {
        const bodyAge = calculateBodyAge(state.age, state.answers)
        return { ...state, screen: 'reveal', bodyAge, selectedOption: null }
      }
      return { ...state, currentQuestion: state.currentQuestion + 1, selectedOption: null }
    }

    case 'REVEAL_COMPLETE':
      return { ...state, screen: 'result' }

    case 'GO_TO_REGISTRATION':
      return { ...state, screen: 'registration' }

    case 'SUBMIT_REGISTRATION':
      return { ...state, name: action.name, phone: action.phone, screen: 'success' }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const setAge = useCallback((age: number) => dispatch({ type: 'SET_AGE', age }), [])
  const selectOption = useCallback((optionIndex: number, score: number) =>
    dispatch({ type: 'SELECT_OPTION', optionIndex, score }), [])
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), [])
  const revealComplete = useCallback((bodyAge: number) =>
    dispatch({ type: 'REVEAL_COMPLETE', bodyAge }), [])
  const goToRegistration = useCallback(() => dispatch({ type: 'GO_TO_REGISTRATION' }), [])
  const submitRegistration = useCallback((name: string, phone: string) =>
    dispatch({ type: 'SUBMIT_REGISTRATION', name, phone }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, start, setAge, selectOption, nextQuestion, revealComplete, goToRegistration, submitRegistration, reset }
}
```

- [ ] **Step 3: Run existing tests to confirm nothing is broken**
```bash
cd body-age-calculator && npm test -- --run
```
Expected: all existing tests pass (scoring tests are unaffected).

- [ ] **Step 4: Commit**
```bash
git add src/features/BodyAgeQuiz/types/index.ts src/features/BodyAgeQuiz/hooks/useQuiz.ts
git commit -m "feat: extend types and useQuiz for registration + success flow"
```

---

## Task 3: Add getFactorAnalysis to scoring utils

**Files:**
- Modify: `src/features/BodyAgeQuiz/utils/scoring.ts`

The ResultScreen needs to show the top 3 positive or negative factors from quiz answers. This function derives them from the answers array.

Factor metadata for each of the 9 questions (indices 0–8):
- Q0 (exercise): icon 🏃, goodLabel "Active Lifestyle", badLabel "Sedentary Behavior", badSublabel "Low movement"
- Q1 (sleep): icon 😴, goodLabel "Consistent Sleep", badLabel "Poor Sleep Quality", badSublabel "Inadequate recovery"
- Q2 (diet): icon 🥗, goodLabel "Healthy Diet", badLabel "Poor Nutrition", badSublabel "Processed food heavy"
- Q3 (smoking): icon 🫁, goodLabel "Clean Lungs", badLabel "Smoking Habit", badSublabel "Lung stress"
- Q4 (stress): icon 🧘, goodLabel "Low Stress", badLabel "High Stress", badSublabel "Elevated cortisol"
- Q5 (water): icon 💧, goodLabel "Well Hydrated", badLabel "Poor Hydration", badSublabel "Low water intake"
- Q6 (energy): icon ⚡, goodLabel "High Energy", badLabel "Low Energy", badSublabel "Fatigue pattern"
- Q7 (alcohol): icon 🍃, goodLabel "Alcohol-Free", badLabel "High Alcohol Use", badSublabel "Liver strain"
- Q8 (mood): icon 🌈, goodLabel "Positive Mindset", badLabel "Low Mood", badSublabel "Mental fatigue"

- [ ] **Step 1: Add getFactorAnalysis to scoring.ts**

Append to the end of `src/features/BodyAgeQuiz/utils/scoring.ts`:
```ts
export interface Factor {
  icon: string
  label: string
  sublabel: string
  badge: string   // e.g. "OPTIMAL", "GOOD", "GREAT" for green; "+4 YRS" for concerning
  isPositive: boolean
}

const FACTOR_META = [
  { icon: '🏃', goodLabel: 'Active Lifestyle',  goodSub: 'Daily movement',       badLabel: 'Sedentary Behavior', badSub: 'Low movement' },
  { icon: '😴', goodLabel: 'Consistent Sleep',   goodSub: '7-8hr average',        badLabel: 'Poor Sleep Quality', badSub: 'Inadequate recovery' },
  { icon: '🥗', goodLabel: 'Healthy Diet',       goodSub: 'Whole foods',          badLabel: 'Poor Nutrition',     badSub: 'Processed food heavy' },
  { icon: '🫁', goodLabel: 'Clean Lungs',         goodSub: 'Smoke-free',           badLabel: 'Smoking Habit',      badSub: 'Lung stress' },
  { icon: '🧘', goodLabel: 'Low Stress',          goodSub: 'Mindful living',       badLabel: 'High Stress',        badSub: 'Elevated cortisol' },
  { icon: '💧', goodLabel: 'Well Hydrated',       goodSub: 'Optimal intake',       badLabel: 'Poor Hydration',     badSub: 'Low water intake' },
  { icon: '⚡', goodLabel: 'High Energy',         goodSub: 'Full battery',         badLabel: 'Low Energy',         badSub: 'Fatigue pattern' },
  { icon: '🍃', goodLabel: 'Alcohol-Free',        goodSub: 'Clean lifestyle',      badLabel: 'High Alcohol Use',   badSub: 'Liver strain' },
  { icon: '🌈', goodLabel: 'Positive Mindset',    goodSub: 'Emotional balance',    badLabel: 'Low Mood',           badSub: 'Mental fatigue' },
] as const

function scoreToBadge(score: number): string {
  if (score === -2) return 'OPTIMAL'
  if (score === -1) return 'GOOD'
  if (score === 2)  return '+3 YRS'
  return '+4 YRS'
}

export function getFactorAnalysis(answers: number[]): { good: Factor[]; bad: Factor[] } {
  const indexed = answers.map((score, i) => ({ score, i }))

  const goodFactors = indexed
    .filter(({ score }) => score <= -1)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ score, i }) => ({
      icon: FACTOR_META[i].icon,
      label: FACTOR_META[i].goodLabel,
      sublabel: FACTOR_META[i].goodSub,
      badge: scoreToBadge(score),
      isPositive: true,
    }))

  const badFactors = indexed
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, i }) => ({
      icon: FACTOR_META[i].icon,
      label: FACTOR_META[i].badLabel,
      sublabel: FACTOR_META[i].badSub,
      badge: scoreToBadge(score),
      isPositive: false,
    }))

  return { good: goodFactors, bad: badFactors }
}
```

- [ ] **Step 2: Verify tests still pass**
```bash
cd body-age-calculator && npm test -- --run
```
Expected: all pass.

- [ ] **Step 3: Commit**
```bash
git add src/features/BodyAgeQuiz/utils/scoring.ts
git commit -m "feat: add getFactorAnalysis to scoring utils"
```

---

## Task 4: WelcomeScreen replacement

**Files:**
- Rewrite: `src/features/BodyAgeQuiz/components/WelcomeScreen/constants.ts`
- Rewrite: `src/features/BodyAgeQuiz/components/WelcomeScreen/WelcomeScreen.module.css`
- Rewrite: `src/features/BodyAgeQuiz/components/WelcomeScreen/index.tsx`

The Figma asset URLs below are valid for 7 days from 2026-04-27. After expiry, replace them with locally hosted files in `public/assets/`.

Asset URLs (from Figma MCP):
- User avatar 1: `https://www.figma.com/api/mcp/asset/bf0822ed-3d2d-4b12-83b6-213e5776e3aa`
- User avatar 2: `https://www.figma.com/api/mcp/asset/8a9f29d0-2436-4c93-b52b-c55b688f340f`
- User avatar 3: `https://www.figma.com/api/mcp/asset/252a5dd2-1fff-4631-a8b8-77f854d26cb2`
- Heartbeat icon: `https://www.figma.com/api/mcp/asset/6d9030ca-03cc-4e79-a67c-29f1e6d2a2af`
- Checkmark icon: `https://www.figma.com/api/mcp/asset/b49f6eeb-bdac-4cba-ae0f-103f5030a435`
- Arrow icon: `https://www.figma.com/api/mcp/asset/81d48fee-588d-4b9a-8a5f-2b0b9ae6a2c4`
- Metabolic icon: `https://www.figma.com/api/mcp/asset/6f7e5e76-0208-4023-baa0-5fa4dc335d48`
- Biological age icon: `https://www.figma.com/api/mcp/asset/6cedf347-7381-4b53-b7ee-c66bb37f3c1d`
- Flexibility icon: `https://www.figma.com/api/mcp/asset/8ac36be0-e609-4eca-8710-9f09c71652b6`

- [ ] **Step 1: Replace constants.ts**
```ts
export const WELCOME_STRINGS = {
  brand: 'HABUILD WELLNESS',
  headlinePart1: 'Your age is ',
  headlinePurple: 'just a number.',
  headlinePart2: "Your body's age is",
  headlineRed: 'the truth.',
  sub1: 'Find out how old your body REALLY is.',
  sub2: 'Takes only 60 seconds!',
  cta: 'CHECK MY BODY AGE \u2014 FREE',
  socialProof: 'Join 20,00,000+ Indians on Habuild',
  socialCount: '+2M',
  metrics: [
    { label: 'Metabolic Rate',   sublabel: 'Your internal energy engine',  iconBg: 'rgba(28,176,246,0.15)' },
    { label: 'Biological Age',   sublabel: 'Your real internal clock',      iconBg: 'rgba(206,130,255,0.15)' },
    { label: 'Flexibility Index', sublabel: 'Range of motion score',        iconBg: 'rgba(88,204,2,0.15)' },
  ],
} as const

export const WELCOME_ASSETS = {
  avatar1: 'https://www.figma.com/api/mcp/asset/bf0822ed-3d2d-4b12-83b6-213e5776e3aa',
  avatar2: 'https://www.figma.com/api/mcp/asset/8a9f29d0-2436-4c93-b52b-c55b688f340f',
  avatar3: 'https://www.figma.com/api/mcp/asset/252a5dd2-1fff-4631-a8b8-77f854d26cb2',
  heartbeat: 'https://www.figma.com/api/mcp/asset/6d9030ca-03cc-4e79-a67c-29f1e6d2a2af',
  checkmark: 'https://www.figma.com/api/mcp/asset/b49f6eeb-bdac-4cba-ae0f-103f5030a435',
  arrow: 'https://www.figma.com/api/mcp/asset/81d48fee-588d-4b9a-8a5f-2b0b9ae6a2c4',
  metabIcon: 'https://www.figma.com/api/mcp/asset/6f7e5e76-0208-4023-baa0-5fa4dc335d48',
  bioIcon: 'https://www.figma.com/api/mcp/asset/6cedf347-7381-4b53-b7ee-c66bb37f3c1d',
  flexIcon: 'https://www.figma.com/api/mcp/asset/8ac36be0-e609-4eca-8710-9f09c71652b6',
} as const
```

- [ ] **Step 2: Replace WelcomeScreen.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fcf9f4;
  position: relative;
  overflow: hidden;
  font-family: var(--font-main);
}

.illustrations {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  pointer-events: none;
}

.illTop {
  position: absolute;
  top: 80px;
  left: 30px;
  width: 120px;
  height: 120px;
  transform: rotate(-12deg);
}

.illBottom {
  position: absolute;
  bottom: 60px;
  right: 20px;
  width: 140px;
  height: 140px;
  transform: rotate(12deg);
  font-size: 96px;
  line-height: 1;
  color: #ff4b4b;
}

.inner {
  position: relative;
  max-width: 430px;
  margin: 0 auto;
  padding: 48px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

/* Brand icon */
.brandIconWrap {
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
}

.brandIconBg {
  width: 96px;
  height: 96px;
  background: rgba(83, 0, 183, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brandIconImg {
  width: 40px;
  height: 32px;
}

.checkBadge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: #58cc02;
  border: 4px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkBadge img {
  width: 10px;
  height: 8px;
}

/* Brand label */
.brandLabel {
  font-size: 14px;
  color: #5300b7;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-weight: 700;
  margin-bottom: 24px;
}

/* Headline */
.headline {
  font-size: 36px;
  font-weight: 800;
  color: #4b4b4b;
  text-align: center;
  line-height: 1.25;
  margin-bottom: 24px;
}

.purple { color: #5300b7; }
.red    { color: #ff4b4b; }

/* Subheadline */
.sub {
  font-size: 20px;
  color: #6b7280;
  text-align: center;
  line-height: 1.4;
  margin-bottom: 32px;
}

.subLight {
  color: #9ca3af;
}

/* CTA button */
.ctaBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px 24px;
  background: #ff845e;
  border: none;
  border-bottom: 4px solid #e56a47;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  margin-bottom: 20px;
}

.ctaBtn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.ctaArrow {
  width: 16px;
  height: 16px;
}

/* Social proof */
.socialCard {
  width: 100%;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(2px);
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.avatarRow {
  display: flex;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  margin-right: -12px;
}

.avatarCount {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: #58cc02;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  margin-right: -12px;
}

.socialText {
  font-size: 16px;
  color: #4b4b4b;
  text-align: center;
}

.socialGreen { color: #58cc02; font-weight: 700; }

/* Metrics grid */
.metricsGrid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metricCard {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.metricCard:nth-child(2) {
  border-color: rgba(83,0,183,0.2);
}

.metricIconWrap {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metricIconWrap img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.metricLabel {
  font-size: 18px;
  font-weight: 700;
  color: #4b4b4b;
}

.metricSublabel {
  font-size: 14px;
  color: #9ca3af;
  margin-top: 2px;
}
```

- [ ] **Step 3: Replace WelcomeScreen/index.tsx**
```tsx
import styles from './WelcomeScreen.module.css'
import { WELCOME_STRINGS, WELCOME_ASSETS } from './constants'

interface WelcomeScreenProps {
  onStart: () => void
}

const METRIC_ICONS = [WELCOME_ASSETS.metabIcon, WELCOME_ASSETS.bioIcon, WELCOME_ASSETS.flexIcon]

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.illustrations} aria-hidden>
        <img className={styles.illTop} src={WELCOME_ASSETS.bioIcon} alt="" />
        <div className={styles.illBottom}>&#x1F9D8;</div>
      </div>
      <div className={styles.inner}>
        <div className={styles.brandIconWrap}>
          <div className={styles.brandIconBg}>
            <img className={styles.brandIconImg} src={WELCOME_ASSETS.heartbeat} alt="" />
          </div>
          <div className={styles.checkBadge}>
            <img src={WELCOME_ASSETS.checkmark} alt="" />
          </div>
        </div>

        <p className={styles.brandLabel}>{WELCOME_STRINGS.brand}</p>

        <h1 className={styles.headline}>
          {WELCOME_STRINGS.headlinePart1}
          <span className={styles.purple}>{WELCOME_STRINGS.headlinePurple}</span>
          <br />
          {WELCOME_STRINGS.headlinePart2}
          <br />
          <span className={styles.red}>{WELCOME_STRINGS.headlineRed}</span>
        </h1>

        <p className={styles.sub}>
          {WELCOME_STRINGS.sub1}
          <br />
          <span className={styles.subLight}>{WELCOME_STRINGS.sub2}</span>
        </p>

        <button className={styles.ctaBtn} onClick={onStart}>
          {WELCOME_STRINGS.cta}
          <img className={styles.ctaArrow} src={WELCOME_ASSETS.arrow} alt="" />
        </button>

        <div className={styles.socialCard}>
          <div className={styles.avatarRow}>
            <img className={styles.avatar} src={WELCOME_ASSETS.avatar1} alt="" />
            <img className={styles.avatar} src={WELCOME_ASSETS.avatar2} alt="" />
            <img className={styles.avatar} src={WELCOME_ASSETS.avatar3} alt="" />
            <div className={styles.avatarCount}>{WELCOME_STRINGS.socialCount}</div>
          </div>
          <p className={styles.socialText}>
            Join <span className={styles.socialGreen}>20,00,000+ Indians</span> on Habuild
          </p>
        </div>

        <div className={styles.metricsGrid}>
          {WELCOME_STRINGS.metrics.map((m, i) => (
            <div className={styles.metricCard} key={m.label}>
              <div className={styles.metricIconWrap} style={{ background: m.iconBg }}>
                <img src={METRIC_ICONS[i]} alt="" />
              </div>
              <div>
                <div className={styles.metricLabel}>{m.label}</div>
                <div className={styles.metricSublabel}>{m.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify app renders (run dev server, open browser)**
```bash
cd body-age-calculator && npm run dev
```
Open http://localhost:5173. Welcome screen should show Figma design.

- [ ] **Step 5: Commit**
```bash
git add src/features/BodyAgeQuiz/components/WelcomeScreen/
git commit -m "feat: replace WelcomeScreen with Figma design"
```

---

## Task 5: AgeInput replacement

**Files:**
- Rewrite: `src/features/BodyAgeQuiz/components/AgeInput/constants.ts`
- Rewrite: `src/features/BodyAgeQuiz/components/AgeInput/AgeInput.module.css`
- Rewrite: `src/features/BodyAgeQuiz/components/AgeInput/index.tsx`

- [ ] **Step 1: Replace constants.ts**
```ts
export const AGE_INPUT_STRINGS = {
  heading: 'First, tell us your real age.',
  subtext: 'Accuracy helps us calculate your bio-age more precisely.',
  yearsLabel: 'YEARS OLD',
  cta: 'CONTINUE',
} as const

export const AGE_MIN = 10
export const AGE_MAX = 100
export const AGE_DEFAULT = 25
```

- [ ] **Step 2: Replace AgeInput.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fcf9f4;
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
}

.progressWrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 8px;
}

.closeBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #afafaf;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.progressTrack {
  flex: 1;
  height: 8px;
  background: #e5e5e5;
  border-radius: 999px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #58cc02;
  border-radius: 999px;
  width: 5%;
}

.inner {
  flex: 1;
  padding: 32px 20px 32px;
  display: flex;
  flex-direction: column;
}

.heading {
  font-size: 24px;
  font-weight: 800;
  color: #4b4b4b;
  margin-bottom: 8px;
}

.subtext {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 48px;
}

.stepperArea {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepperRow {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stepBtn {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #e8f4ff;
  border: 2px solid #b3deff;
  border-bottom: 4px solid #7bc8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #1cb0f6;
  cursor: pointer;
  transition: transform 0.1s;
  user-select: none;
}

.stepBtn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.ageCard {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 20px;
  width: 180px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ageNumber {
  font-size: 72px;
  font-weight: 800;
  color: #1cb0f6;
  line-height: 1;
}

.yearsLabel {
  font-size: 12px;
  font-weight: 700;
  color: #afafaf;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.ctaWrap {
  padding-top: 32px;
}

.ctaBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 18px;
  background: #58cc02;
  border: none;
  border-bottom: 4px solid #46a302;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s;
}

.ctaBtn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}
```

- [ ] **Step 3: Replace AgeInput/index.tsx**
```tsx
import { useState, useCallback } from 'react'
import styles from './AgeInput.module.css'
import { AGE_INPUT_STRINGS, AGE_MIN, AGE_MAX, AGE_DEFAULT } from './constants'

interface AgeInputProps {
  onSubmit: (age: number) => void
  onClose: () => void
}

export function AgeInput({ onSubmit, onClose }: AgeInputProps) {
  const [age, setAge] = useState(AGE_DEFAULT)

  const decrement = useCallback(() => setAge(a => Math.max(AGE_MIN, a - 1)), [])
  const increment = useCallback(() => setAge(a => Math.min(AGE_MAX, a + 1)), [])

  return (
    <div className={styles.screen}>
      <div className={styles.progressWrap}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&#x2715;</button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} />
        </div>
      </div>
      <div className={styles.inner}>
        <h1 className={styles.heading}>{AGE_INPUT_STRINGS.heading}</h1>
        <p className={styles.subtext}>{AGE_INPUT_STRINGS.subtext}</p>
        <div className={styles.stepperArea}>
          <div className={styles.stepperRow}>
            <button className={styles.stepBtn} onClick={decrement} aria-label="Decrease age">&#x2212;</button>
            <div className={styles.ageCard}>
              <span className={styles.ageNumber}>{age}</span>
              <span className={styles.yearsLabel}>{AGE_INPUT_STRINGS.yearsLabel}</span>
            </div>
            <button className={styles.stepBtn} onClick={increment} aria-label="Increase age">&#x2B;</button>
          </div>
        </div>
        <div className={styles.ctaWrap}>
          <button className={styles.ctaBtn} onClick={() => onSubmit(age)}>
            {AGE_INPUT_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update BodyAgeQuiz/index.tsx to pass onClose to AgeInput**

In `src/features/BodyAgeQuiz/index.tsx`, find the AgeInput usage and add `onClose={reset}`:
```tsx
{state.screen === 'age_input' && (
  <AgeInput onSubmit={setAge} onClose={reset} />
)}
```

- [ ] **Step 5: Verify in browser** — welcome → tap CTA → age input screen shows stepper.

- [ ] **Step 6: Commit**
```bash
git add src/features/BodyAgeQuiz/components/AgeInput/ src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: replace AgeInput with stepper design"
```

---

## Task 6: QuizScreen replacement

**Files:**
- Rewrite: `src/features/BodyAgeQuiz/components/QuizScreen/constants.ts`
- Rewrite: `src/features/BodyAgeQuiz/components/QuizScreen/QuizScreen.module.css`
- Rewrite: `src/features/BodyAgeQuiz/components/QuizScreen/index.tsx`

Note: The `Mascot/` and `AnswerOption/` sub-components are no longer needed after this rewrite. They can be left in place (they'll just be unused) — do not delete them to avoid breaking anything unexpectedly.

- [ ] **Step 1: Replace constants.ts**
```ts
export const QUIZ_STRINGS = {
  cta: 'CONTINUE',
} as const

export const OPTION_LABELS = ['1', '2', '3', '4'] as const
```

- [ ] **Step 2: Replace QuizScreen.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fcf9f4;
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
}

.progressWrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 8px;
}

.closeBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #afafaf;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.progressTrack {
  flex: 1;
  height: 8px;
  background: #e5e5e5;
  border-radius: 999px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #58cc02;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.inner {
  flex: 1;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
}

.heroEmoji {
  font-size: 80px;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1;
}

.question {
  font-size: 22px;
  font-weight: 800;
  color: #4b4b4b;
  text-align: center;
  line-height: 1.35;
  margin-bottom: 32px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.optionCard {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;
}

.optionCard.selected {
  border-color: #1cb0f6;
  border-bottom-color: #1cb0f6;
  background: #e8f4ff;
}

.badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #afafaf;
  flex-shrink: 0;
}

.optionCard.selected .badge {
  background: #1cb0f6;
  color: #fff;
}

.optionLabel {
  font-size: 16px;
  font-weight: 600;
  color: #4b4b4b;
}

.optionCard.selected .optionLabel {
  color: #1cb0f6;
}

.ctaWrap {
  padding-top: 24px;
}

.ctaBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 18px;
  background: #58cc02;
  border: none;
  border-bottom: 4px solid #46a302;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s;
}

.ctaBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ctaBtn:not(:disabled):active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}
```

- [ ] **Step 3: Replace QuizScreen/index.tsx**
```tsx
import styles from './QuizScreen.module.css'
import { QUIZ_STRINGS, OPTION_LABELS } from './constants'
import { QUESTIONS } from '../../constants/questions'
import type { QuizState } from '../../types'

interface QuizScreenProps {
  state: QuizState
  onSelectOption: (optionIndex: number, score: number) => void
  onNext: () => void
  onClose: () => void
}

const TOTAL_QUESTIONS = QUESTIONS.length

export function QuizScreen({ state, onSelectOption, onNext, onClose }: QuizScreenProps) {
  const question = QUESTIONS[state.currentQuestion]
  const progress = ((state.currentQuestion) / TOTAL_QUESTIONS) * 100

  return (
    <div className={styles.screen}>
      <div className={styles.progressWrap}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&times;</button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={styles.inner}>
        <div className={styles.heroEmoji}>{question.options[0].emoji}</div>
        <h2 className={styles.question}>{question.text}</h2>
        <div className={styles.options}>
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.optionCard}${state.selectedOption === i ? ` ${styles.selected}` : ''}`}
              onClick={() => onSelectOption(i, opt.score)}
            >
              <span className={styles.badge}>{OPTION_LABELS[i]}</span>
              <span className={styles.optionLabel}>{opt.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.ctaWrap}>
          <button
            className={styles.ctaBtn}
            onClick={onNext}
            disabled={state.selectedOption === null}
          >
            {QUIZ_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update BodyAgeQuiz/index.tsx QuizScreen usage**

The new QuizScreen no longer needs `streakCount`, `onPlayPop`, or `onPlayWhoosh`. Update the usage:
```tsx
{state.screen === 'quiz' && (
  <QuizScreen
    state={state}
    onSelectOption={selectOption}
    onNext={nextQuestion}
    onClose={reset}
  />
)}
```

- [ ] **Step 5: Verify in browser** — go through welcome → age → quiz. Options should show numbered cards, selected highlights blue, Continue activates.

- [ ] **Step 6: Commit**
```bash
git add src/features/BodyAgeQuiz/components/QuizScreen/ src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: replace QuizScreen with Figma card design"
```

---

## Task 7: RevealScreen replacement

**Files:**
- Rewrite: `src/features/BodyAgeQuiz/components/RevealScreen/constants.ts`
- Rewrite: `src/features/BodyAgeQuiz/components/RevealScreen/RevealScreen.module.css`
- Rewrite: `src/features/BodyAgeQuiz/components/RevealScreen/index.tsx`

- [ ] **Step 1: Replace constants.ts**
```ts
export const REVEAL_STRINGS = {
  heading: 'Calculating your body age...',
  subtext: 'ANALYZING YOUR LIFESTYLE DATA',
  processing: 'PROCESSING',
} as const

export const REVEAL_DURATION_MS = 3000
```

- [ ] **Step 2: Replace RevealScreen.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fdfaf5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-main);
  padding: 32px;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 360px;
}

.heading {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  text-align: center;
  letter-spacing: -0.6px;
  margin: 0;
}

.subtext {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2.8px;
  margin: 0;
}

.barWrap {
  margin-top: 32px;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.barTrack {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.barFill {
  height: 100%;
  background: #582c8b;
  border-radius: 999px;
  transition: width 0.1s linear;
}

.processingLabel {
  font-size: 12px;
  font-weight: 700;
  color: rgba(88, 44, 139, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-align: center;
}
```

- [ ] **Step 3: Replace RevealScreen/index.tsx**
```tsx
import { useEffect, useState } from 'react'
import styles from './RevealScreen.module.css'
import { REVEAL_STRINGS, REVEAL_DURATION_MS } from './constants'

interface RevealScreenProps {
  bodyAge: number
  onComplete: () => void
}

export function RevealScreen({ bodyAge: _bodyAge, onComplete }: RevealScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / REVEAL_DURATION_MS) * 100)
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(onComplete, 300)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{REVEAL_STRINGS.heading}</h2>
        <p className={styles.subtext}>{REVEAL_STRINGS.subtext}</p>
        <div className={styles.barWrap}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.processingLabel}>{REVEAL_STRINGS.processing}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update BodyAgeQuiz/index.tsx RevealScreen usage**

The new RevealScreen no longer needs `onPlayCountdown` or `onPlayCelebrate`. Update:
```tsx
{state.screen === 'reveal' && (
  <RevealScreen
    bodyAge={state.bodyAge}
    onComplete={() => revealComplete(state.bodyAge)}
  />
)}
```

- [ ] **Step 5: Verify in browser** — complete the quiz, loading screen should show animated purple progress bar.

- [ ] **Step 6: Commit**
```bash
git add src/features/BodyAgeQuiz/components/RevealScreen/ src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: replace RevealScreen with progress bar loading screen"
```

---

## Task 8: ResultScreen replacement (two variants)

**Files:**
- Rewrite: `src/features/BodyAgeQuiz/components/ResultScreen/constants.ts`
- Rewrite: `src/features/BodyAgeQuiz/components/ResultScreen/ResultScreen.module.css`
- Rewrite: `src/features/BodyAgeQuiz/components/ResultScreen/index.tsx`

Figma asset URLs for concern result factor icons (valid 7 days):
- Sitting icon: `https://www.figma.com/api/mcp/asset/ed576e1a-e0e9-41b7-bcfc-4a15d368dd70`
- Sleep icon: `https://www.figma.com/api/mcp/asset/85885dd9-73e1-498d-a606-a66c4a77db24`
- Stress icon: `https://www.figma.com/api/mcp/asset/d0a3f6d4-cdb6-4332-bf47-e9c6e1007efd`

- [ ] **Step 1: Replace constants.ts**
```ts
export const RESULT_STRINGS = {
  good: {
    header: 'AMAZING!',
    subheader: 'YOUR ASSESSMENT IS READY',
    statusBadge: 'STATUS: GOOD',
    bodyAgeLabel: 'BODY AGE',
    realAgePrefix: 'Real Age: ',
    factorTitle: 'FACTOR ANALYSIS',
    primaryCta: 'STAY HEALTHY \u2192',
    secondaryCta: 'SHARE REPORT',
  },
  concerning: {
    header: 'ESTIMATED BODY AGE',
    badge: 'CONCERNING',
    realAgePrefix: 'Real Age: ',
    factorTitle: 'Factor Analysis',
    hopeTitle: 'There is Hope!',
    hopeBody: 'Yoga can help reverse these factors. Feel younger in just 14 Days.',
    primaryCta: 'START REVERSING IT \u2014 FREE \u2192',
    footer: 'Join 12,000+ others transforming their health today!',
  },
} as const

export function getFeedbackMessage(bodyAge: number, realAge: number): string {
  const diff = realAge - bodyAge
  if (diff > 0) return `Your body is just ${diff} year${diff > 1 ? 's' : ''} younger than you. You're doing a fantastic job maintaining your vitality!`
  if (diff === 0) return "Your body age matches your real age. You're right on track — keep it up!"
  return `Your body is ${Math.abs(diff)} year${Math.abs(diff) > 1 ? 's' : ''} older than you! Your lifestyle may be accelerating aging.`
}
```

- [ ] **Step 2: Replace ResultScreen.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  padding: 32px 24px;
}

/* --- GOOD variant --- */
.goodHeader {
  text-align: center;
  margin-bottom: 20px;
}

.amazingText {
  font-size: 28px;
  font-weight: 800;
  color: #58cc02;
  margin: 0 0 4px;
}

.assessmentReady {
  font-size: 12px;
  font-weight: 700;
  color: #afafaf;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin: 0;
}

.circleWrap {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.circleGood {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 10px solid #58cc02;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.circleConcerning {
  width: 192px;
  height: 192px;
  border-radius: 50%;
  border: 10px solid #ff9600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
}

.circleAgeGood {
  font-size: 72px;
  font-weight: 800;
  color: #58cc02;
  line-height: 1;
}

.circleAgeConcerning {
  font-size: 72px;
  font-weight: 800;
  color: #ff9600;
  line-height: 1;
}

.circleLabel {
  font-size: 12px;
  font-weight: 700;
  color: #afafaf;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.concerningBadge {
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4b4b;
  border-bottom: 4px solid #d33131;
  border-radius: 20px;
  padding: 6px 16px 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.realAge {
  text-align: center;
  font-size: 18px;
  color: #4b4b4b;
  margin: 8px 0 12px;
}

.realAgeGreen { color: #58cc02; font-weight: 700; }
.realAgeOrange { color: #ff9600; font-weight: 700; }

.statusBadge {
  display: block;
  margin: 0 auto 20px;
  padding: 8px 20px;
  background: #58cc02;
  border-radius: 999px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.feedbackCard {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 20px;
  padding: 24px 26px;
  margin-bottom: 24px;
}

.feedbackText {
  font-size: 18px;
  color: #4b4b4b;
  text-align: center;
  line-height: 1.5;
  margin: 0;
}

.feedbackHighlight { color: #ff4b4b; font-weight: 700; }

.sectionTitle {
  font-size: 18px;
  font-weight: 800;
  color: #4b4b4b;
  margin-bottom: 12px;
}

.factorList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.factorCard {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.factorIconWrap {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #e8fff0;
  border: 2px solid rgba(88,204,2,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.factorIconWrapBad {
  background: #fff4e5;
  border-color: rgba(255,150,0,0.2);
}

.factorInfo {
  flex: 1;
}

.factorLabel {
  font-size: 16px;
  font-weight: 700;
  color: #4b4b4b;
}

.factorSublabel {
  font-size: 14px;
  color: #afafaf;
  margin-top: 2px;
}

.factorBadgeGood {
  font-size: 12px;
  font-weight: 800;
  color: #4b4b4b;
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 8px;
  text-transform: uppercase;
  white-space: nowrap;
}

.factorBadgeBad {
  font-size: 14px;
  font-weight: 800;
  color: #ff4b4b;
  white-space: nowrap;
}

.hopeCard {
  background: #fff4e5;
  border: 2px solid #ff9600;
  border-bottom: 4px solid #ff9600;
  border-radius: 20px;
  padding: 24px 26px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hopeIcon {
  font-size: 24px;
  flex-shrink: 0;
}

.hopeTitle {
  font-size: 18px;
  font-weight: 800;
  color: #ff9600;
  margin: 0 0 6px;
}

.hopeBody {
  font-size: 16px;
  color: #4b4b4b;
  line-height: 1.5;
  margin: 0;
}

.ctaSection {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.btnGreen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 18px;
  background: #58cc02;
  border: none;
  border-bottom: 4px solid #46a302;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.1s;
}

.btnGreen:active { transform: translateY(2px); border-bottom-width: 2px; }

.btnOutline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  background: #fff;
  border: 2px solid #58cc02;
  border-bottom: 4px solid #58cc02;
  border-radius: 999px;
  color: #58cc02;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s;
}

.btnOutline:active { transform: translateY(2px); border-bottom-width: 2px; }

.btnOrange {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 18px;
  background: #ff864b;
  border: none;
  border-bottom: 4px solid #d96a36;
  border-radius: 20px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s;
}

.btnOrange:active { transform: translateY(2px); border-bottom-width: 2px; }

.concerningSubfooter {
  text-align: center;
  font-size: 13px;
  color: #afafaf;
  margin-top: 12px;
}

/* Concerning header label */
.estimatedLabel {
  font-size: 14px;
  font-weight: 700;
  color: #afafaf;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  text-align: center;
  margin-bottom: 16px;
}
```

- [ ] **Step 3: Replace ResultScreen/index.tsx**
```tsx
import { useMemo } from 'react'
import styles from './ResultScreen.module.css'
import { RESULT_STRINGS, getFeedbackMessage } from './constants'
import { getFactorAnalysis } from '../../utils/scoring'
import type { QuizState } from '../../types'

interface ResultScreenProps {
  state: QuizState
  onRegister: () => void
}

export function ResultScreen({ state, onRegister }: ResultScreenProps) {
  const isGood = state.bodyAge <= state.age
  const { good, bad } = useMemo(() => getFactorAnalysis(state.answers), [state.answers])
  const feedbackMsg = getFeedbackMessage(state.bodyAge, state.age)

  if (isGood) {
    return (
      <div className={styles.screen}>
        <div className={styles.goodHeader}>
          <p className={styles.amazingText}>{RESULT_STRINGS.good.header}</p>
          <p className={styles.assessmentReady}>{RESULT_STRINGS.good.subheader}</p>
        </div>

        <div className={styles.circleWrap}>
          <div className={styles.circleGood}>
            <span className={styles.circleAgeGood}>{state.bodyAge}</span>
            <span className={styles.circleLabel}>{RESULT_STRINGS.good.bodyAgeLabel}</span>
          </div>
        </div>

        <p className={styles.realAge}>
          {RESULT_STRINGS.good.realAgePrefix}
          <span className={styles.realAgeGreen}>{state.age}</span>
        </p>

        <span className={styles.statusBadge}>{RESULT_STRINGS.good.statusBadge}</span>

        <div className={styles.feedbackCard}>
          <p className={styles.feedbackText}>{feedbackMsg}</p>
        </div>

        <p className={styles.sectionTitle}>{RESULT_STRINGS.good.factorTitle}</p>
        <div className={styles.factorList}>
          {good.map(f => (
            <div className={styles.factorCard} key={f.label}>
              <div className={styles.factorIconWrap}>{f.icon}</div>
              <div className={styles.factorInfo}>
                <div className={styles.factorLabel}>{f.label}</div>
                <div className={styles.factorSublabel}>{f.sublabel}</div>
              </div>
              <span className={styles.factorBadgeGood}>{f.badge}</span>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <button className={styles.btnGreen} onClick={onRegister}>
            {RESULT_STRINGS.good.primaryCta}
          </button>
          <button className={styles.btnOutline} onClick={onRegister}>
            {RESULT_STRINGS.good.secondaryCta}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <p className={styles.estimatedLabel}>{RESULT_STRINGS.concerning.header}</p>

      <div className={styles.circleWrap}>
        <div className={styles.circleConcerning}>
          <span className={styles.circleAgeConcerning}>{state.bodyAge}</span>
          <span className={styles.circleLabel}>YEARS OLD</span>
          <span className={styles.concerningBadge}>{RESULT_STRINGS.concerning.badge}</span>
        </div>
      </div>

      <p className={styles.realAge} style={{ marginTop: 28 }}>
        {RESULT_STRINGS.concerning.realAgePrefix}
        <span className={styles.realAgeOrange}>{state.age}</span>
      </p>

      <div className={styles.feedbackCard}>
        <p className={styles.feedbackText}>{feedbackMsg}</p>
      </div>

      <p className={styles.sectionTitle}>{RESULT_STRINGS.concerning.factorTitle}</p>
      <div className={styles.factorList}>
        {bad.map(f => (
          <div className={styles.factorCard} key={f.label}>
            <div className={`${styles.factorIconWrap} ${styles.factorIconWrapBad}`}>{f.icon}</div>
            <div className={styles.factorInfo}>
              <div className={styles.factorLabel}>{f.label}</div>
              <div className={styles.factorSublabel}>{f.sublabel}</div>
            </div>
            <span className={styles.factorBadgeBad}>{f.badge}</span>
          </div>
        ))}
      </div>

      <div className={styles.hopeCard}>
        <span className={styles.hopeIcon}>&#x1F4A1;</span>
        <div>
          <p className={styles.hopeTitle}>{RESULT_STRINGS.concerning.hopeTitle}</p>
          <p className={styles.hopeBody}>{RESULT_STRINGS.concerning.hopeBody}</p>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <button className={styles.btnOrange} onClick={onRegister}>
          {RESULT_STRINGS.concerning.primaryCta}
        </button>
        <p className={styles.concerningSubfooter}>{RESULT_STRINGS.concerning.footer}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update BodyAgeQuiz/index.tsx ResultScreen usage**

The new ResultScreen takes `onRegister` instead of `onReset`. `goToRegistration` is already exported from `useQuiz` (added in Task 2). Update the result block:
```tsx
{state.screen === 'result' && (
  <ResultScreen state={state} onRegister={goToRegistration} />
)}
```

- [ ] **Step 5: Verify both variants in browser** — set age to something low (e.g. 20) and pick all good answers to see green result; pick all bad answers to see concerning result.

- [ ] **Step 6: Commit**
```bash
git add src/features/BodyAgeQuiz/components/ResultScreen/ src/features/BodyAgeQuiz/types/index.ts src/features/BodyAgeQuiz/hooks/useQuiz.ts src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: replace ResultScreen with Figma two-variant design"
```

---

## Task 9: RegistrationScreen (new)

**Files:**
- Create: `src/features/BodyAgeQuiz/components/RegistrationScreen/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/RegistrationScreen/RegistrationScreen.module.css`
- Create: `src/features/BodyAgeQuiz/components/RegistrationScreen/index.tsx`

- [ ] **Step 1: Create constants.ts**
```ts
export const REG_STRINGS = {
  bodyAgeLabel: 'YOUR BODY AGE',
  yearsUnit: 'years',
  heading: "You're one step away!",
  subtext: 'Enter your details to lock in your free metabolic health plan.',
  nameLabel: 'NAME',
  namePlaceholder: 'Enter your name',
  phoneLabel: 'WHATSAPP NUMBER',
  phonePlaceholder: '98765 43210',
  phonePrefix: '+91',
  cta: 'RESERVE MY SPOT',
  privacy: 'YOUR DATA IS SAFE WITH US',
  errorName: 'Please enter your name',
  errorPhone: 'Please enter a valid 10-digit number',
} as const
```

- [ ] **Step 2: Create RegistrationScreen.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  font-family: var(--font-main);
}

.summaryCard {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.summaryIcon {
  width: 56px;
  height: 56px;
  background: rgba(83,0,183,0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.summaryBodyAgeLabel {
  font-size: 12px;
  font-weight: 700;
  color: #afafaf;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 4px;
}

.summaryBodyAgeValue {
  font-size: 28px;
  font-weight: 800;
  color: #5300b7;
  margin: 0;
  line-height: 1;
}

.summaryYears {
  font-size: 16px;
  font-weight: 600;
  color: #5300b7;
}

.heading {
  font-size: 28px;
  font-weight: 800;
  color: #4b4b4b;
  margin: 0 0 8px;
  line-height: 1.2;
}

.subtext {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.fieldGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 13px;
  font-weight: 700;
  color: #4b4b4b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.inputWrap {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
}

.input {
  width: 100%;
  padding: 16px 20px;
  border: none;
  outline: none;
  font-family: var(--font-main);
  font-size: 16px;
  color: #4b4b4b;
  background: transparent;
  box-sizing: border-box;
}

.input::placeholder {
  color: #afafaf;
}

.phoneRow {
  display: flex;
  align-items: stretch;
}

.phonePrefix {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-right: 2px solid #e5e5e5;
  font-size: 16px;
  font-weight: 600;
  color: #4b4b4b;
  flex-shrink: 0;
}

.phoneInput {
  flex: 1;
  padding: 16px;
  border: none;
  outline: none;
  font-family: var(--font-main);
  font-size: 16px;
  color: #4b4b4b;
  background: transparent;
}

.phoneInput::placeholder {
  color: #afafaf;
}

.errorMsg {
  font-size: 13px;
  color: #ff4b4b;
  margin-top: 4px;
}

.ctaBtn {
  width: 100%;
  padding: 18px;
  background: #ff4b4b;
  border: none;
  border-bottom: 4px solid #d03030;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s;
  margin-top: 8px;
}

.ctaBtn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.privacy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: #afafaf;
  text-align: center;
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

- [ ] **Step 3: Create RegistrationScreen/index.tsx**
```tsx
import { useState } from 'react'
import styles from './RegistrationScreen.module.css'
import { REG_STRINGS } from './constants'

interface RegistrationScreenProps {
  bodyAge: number
  onSubmit: (name: string, phone: string) => void
}

export function RegistrationScreen({ bodyAge, onSubmit }: RegistrationScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const handleSubmit = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = REG_STRINGS.errorName
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = REG_STRINGS.errorPhone
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(name.trim(), phone.replace(/\s/g, ''))
  }

  return (
    <div className={styles.screen}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryIcon}>&#x26A1;</div>
        <div>
          <p className={styles.summaryBodyAgeLabel}>{REG_STRINGS.bodyAgeLabel}</p>
          <p className={styles.summaryBodyAgeValue}>
            {bodyAge} <span className={styles.summaryYears}>{REG_STRINGS.yearsUnit}</span>
          </p>
        </div>
      </div>

      <h2 className={styles.heading}>{REG_STRINGS.heading}</h2>
      <p className={styles.subtext}>{REG_STRINGS.subtext}</p>

      <div className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{REG_STRINGS.nameLabel}</label>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              type="text"
              placeholder={REG_STRINGS.namePlaceholder}
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            />
          </div>
          {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{REG_STRINGS.phoneLabel}</label>
          <div className={styles.inputWrap}>
            <div className={styles.phoneRow}>
              <span className={styles.phonePrefix}>&#x1F1EE;&#x1F1F3; {REG_STRINGS.phonePrefix}</span>
              <input
                className={styles.phoneInput}
                type="tel"
                placeholder={REG_STRINGS.phonePlaceholder}
                value={phone}
                maxLength={10}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, phone: undefined })) }}
              />
            </div>
          </div>
          {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
        </div>

        <button className={styles.ctaBtn} onClick={handleSubmit}>
          {REG_STRINGS.cta}
        </button>
        <div className={styles.privacy}>&#x1F512; {REG_STRINGS.privacy}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Wire into BodyAgeQuiz/index.tsx**

Add import at top:
```tsx
import { RegistrationScreen } from './components/RegistrationScreen'
```

Add to the screen switcher (after result block):
```tsx
{state.screen === 'registration' && (
  <RegistrationScreen
    bodyAge={state.bodyAge}
    onSubmit={submitRegistration}
  />
)}
```

- [ ] **Step 5: Verify in browser** — go all the way through to result, click CTA, registration screen should appear with body age card, name + phone inputs, and RESERVE MY SPOT button.

- [ ] **Step 6: Commit**
```bash
git add src/features/BodyAgeQuiz/components/RegistrationScreen/ src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: add RegistrationScreen with name and phone form"
```

---

## Task 10: SuccessScreen (new)

**Files:**
- Create: `src/features/BodyAgeQuiz/components/SuccessScreen/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/SuccessScreen/SuccessScreen.module.css`
- Create: `src/features/BodyAgeQuiz/components/SuccessScreen/index.tsx`

- [ ] **Step 1: Create constants.ts**
```ts
export const SUCCESS_STRINGS = {
  headingPrefix: "You're in, ",
  headingSuffix: '!',
  subtext: 'Your health journey just took its first exciting step forward.',
  shareBtn: 'SHARE RESULT',
  dashboardBtn: 'GO TO DASHBOARD',
  shareMsg: 'I just discovered my body age with Habuild! Check yours for free at habuild.in',
  decorEmojis: ['\u{1F3C6}', '\u2B50', '\u{1F947}'],
} as const
```

- [ ] **Step 2: Create SuccessScreen.module.css**
```css
.screen {
  min-height: 100dvh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 40px;
  font-family: var(--font-main);
}

.celebIconWrap {
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 32px;
}

.celebCircle {
  width: 160px;
  height: 160px;
  background: #f3f3f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  line-height: 1;
}

.checkBadge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 40px;
  height: 40px;
  background: #58cc02;
  border: 4px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
}

.heading {
  font-size: 32px;
  font-weight: 800;
  color: #5300b7;
  text-align: center;
  margin: 0 0 12px;
}

.subtext {
  font-size: 18px;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
  margin: 0 0 48px;
  max-width: 300px;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btnShare {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px;
  background: #58cc02;
  border: none;
  border-bottom: 4px solid #46a302;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.1s;
}

.btnShare:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.btnDashboard {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px;
  background: #5300b7;
  border: none;
  border-bottom: 4px solid #3a0082;
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.1s;
}

.btnDashboard:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.decor {
  margin-top: 40px;
  font-size: 36px;
  display: flex;
  gap: 16px;
}
```

- [ ] **Step 3: Create SuccessScreen/index.tsx**
```tsx
import styles from './SuccessScreen.module.css'
import { SUCCESS_STRINGS } from './constants'

interface SuccessScreenProps {
  name: string
  onReset: () => void
}

export function SuccessScreen({ name, onReset }: SuccessScreenProps) {
  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(SUCCESS_STRINGS.shareMsg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.celebIconWrap}>
        <div className={styles.celebCircle}>&#x1F389;</div>
        <div className={styles.checkBadge}>&#x2713;</div>
      </div>

      <h1 className={styles.heading}>
        {SUCCESS_STRINGS.headingPrefix}{name || 'Friend'}{SUCCESS_STRINGS.headingSuffix}
      </h1>
      <p className={styles.subtext}>{SUCCESS_STRINGS.subtext}</p>

      <div className={styles.buttons}>
        <button className={styles.btnShare} onClick={handleShare}>
          &#x1F4E4; {SUCCESS_STRINGS.shareBtn}
        </button>
        <button className={styles.btnDashboard} onClick={onReset}>
          &#x229E; {SUCCESS_STRINGS.dashboardBtn}
        </button>
      </div>

      <div className={styles.decor} aria-hidden>
        {SUCCESS_STRINGS.decorEmojis.map(e => <span key={e}>{e}</span>)}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Wire into BodyAgeQuiz/index.tsx**

Add import at top:
```tsx
import { SuccessScreen } from './components/SuccessScreen'
```

Add to the screen switcher (after registration block):
```tsx
{state.screen === 'success' && (
  <SuccessScreen name={state.name} onReset={reset} />
)}
```

- [ ] **Step 5: Verify full flow in browser**
  - Welcome → CTA
  - Age input → stepper → Continue
  - Quiz → 9 questions with numbered cards → Continue
  - Loading screen → purple bar animates to 100%
  - Result screen (good or concerning variant)
  - Registration form → fill name + 10-digit phone → RESERVE MY SPOT
  - Success screen → "You're in, [name]!" with share + dashboard buttons

- [ ] **Step 6: Run tests**
```bash
cd body-age-calculator && npm test -- --run
```
Expected: all pass.

- [ ] **Step 7: Commit**
```bash
git add src/features/BodyAgeQuiz/components/SuccessScreen/ src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: add SuccessScreen completing full Figma flow"
```

---

## Task 11: Final cleanup and index.tsx audit

**Files:**
- Modify: `src/features/BodyAgeQuiz/index.tsx` — final review pass

- [ ] **Step 1: Read current BodyAgeQuiz/index.tsx and confirm all screens are wired**

The final `index.tsx` should look like this:
```tsx
import { useQuiz } from './hooks/useQuiz'
import { WelcomeScreen } from './components/WelcomeScreen'
import { AgeInput } from './components/AgeInput'
import { QuizScreen } from './components/QuizScreen'
import { RevealScreen } from './components/RevealScreen'
import { ResultScreen } from './components/ResultScreen'
import { RegistrationScreen } from './components/RegistrationScreen'
import { SuccessScreen } from './components/SuccessScreen'
import styles from './BodyAgeQuiz.module.css'

export function BodyAgeQuiz() {
  const { state, start, setAge, selectOption, nextQuestion, revealComplete, submitRegistration, goToRegistration, reset } = useQuiz()

  return (
    <div className={styles.root}>
      {state.screen === 'welcome' && (
        <WelcomeScreen onStart={start} />
      )}
      {state.screen === 'age_input' && (
        <AgeInput onSubmit={setAge} onClose={reset} />
      )}
      {state.screen === 'quiz' && (
        <QuizScreen
          state={state}
          onSelectOption={selectOption}
          onNext={nextQuestion}
          onClose={reset}
        />
      )}
      {state.screen === 'reveal' && (
        <RevealScreen
          bodyAge={state.bodyAge}
          onComplete={() => revealComplete(state.bodyAge)}
        />
      )}
      {state.screen === 'result' && (
        <ResultScreen state={state} onRegister={goToRegistration} />
      )}
      {state.screen === 'registration' && (
        <RegistrationScreen bodyAge={state.bodyAge} onSubmit={submitRegistration} />
      )}
      {state.screen === 'success' && (
        <SuccessScreen name={state.name} onReset={reset} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Remove unused imports** — `useSound` is no longer called in index.tsx; remove its import.

- [ ] **Step 3: Run tests one final time**
```bash
cd body-age-calculator && npm test -- --run
```
Expected: all pass.

- [ ] **Step 4: Final commit**
```bash
git add src/features/BodyAgeQuiz/index.tsx
git commit -m "feat: wire all 8 Figma screens into BodyAgeQuiz flow"
```
