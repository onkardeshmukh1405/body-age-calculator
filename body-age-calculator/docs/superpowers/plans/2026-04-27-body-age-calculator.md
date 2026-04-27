# Body Age Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a game-like body age quiz app with Lavender Dusk theme, peacock mascot, background music, animations, and shareable results — targeting women 30+.

**Architecture:** Single-page Vite + React + TypeScript app. All state lives in a `useQuiz` hook (state machine). Components are screen-level and dumb — they receive state + callbacks from the hook. All UI strings live in co-located `constants.ts` files. Sounds managed by `useSound` hook using HTML `<audio>` elements.

**Tech Stack:** Vite 8, React 19, TypeScript 6, CSS Modules, Vitest (unit tests for scoring logic), HTML Canvas (share card), HTML Audio API.

---

## Task 1: Install Vitest + add Nunito font

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `index.html`

- [ ] **Step 1: Install vitest**

```bash
cd /Users/sanket/body-age-calculator/body-age-calculator
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Add test config to vite.config.ts**

Full file replacement:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
```

- [ ] **Step 3: Add test script to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Add Nunito font to index.html**

In `<head>`, after `<title>`, add:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
```

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts index.html package-lock.json
git commit -m "chore: add vitest, Nunito font"
```

---

## Task 2: Types

**Files:**
- Create: `src/features/BodyAgeQuiz/types/index.ts`

- [ ] **Step 1: Create types file**

```ts
// src/features/BodyAgeQuiz/types/index.ts

export type Screen = 'welcome' | 'age_input' | 'quiz' | 'reveal' | 'result'

export interface AnswerOption {
  emoji: string
  label: string
  sublabel: string
  score: number // -2 | -1 | +2 | +3
}

export interface Question {
  id: number
  text: string
  options: [AnswerOption, AnswerOption, AnswerOption, AnswerOption]
  greenBadge: string  // shown when score <= -1
  redBadge: string    // shown when score >= +2
  tip: string         // shown in tips carousel when score >= +2
}

export interface QuizState {
  screen: Screen
  age: number
  currentQuestion: number // 0–8
  answers: number[]       // score per answered question
  selectedOption: number | null // index of selected option on current question
  bodyAge: number
}

export type QuizAction =
  | { type: 'START' }
  | { type: 'SET_AGE'; age: number }
  | { type: 'SELECT_OPTION'; optionIndex: number; score: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'REVEAL_COMPLETE'; bodyAge: number }
  | { type: 'RESET' }
```

- [ ] **Step 2: Commit**

```bash
git add src/features/BodyAgeQuiz/types/index.ts
git commit -m "feat: add BodyAgeQuiz types"
```

---

## Task 3: Theme constants

**Files:**
- Create: `src/features/BodyAgeQuiz/constants/theme.ts`

- [ ] **Step 1: Create theme file**

```ts
// src/features/BodyAgeQuiz/constants/theme.ts

export const THEME = {
  gradientBg: 'linear-gradient(150deg, #1e0a3c 0%, #6d28d9 45%, #a78bfa 80%, #f3e8ff 100%)',
  primaryGradient: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
  progressGradient: 'linear-gradient(90deg, #c4b5fd, #fbcfe8)',
  buttonShadow: '#4c1d95',
  cardBg: '#ffffff',
  bodyBg: '#fdf4ff',
  textPrimary: '#1e293b',
  textMuted: '#9ca3af',
  selectedBorder: '#7c3aed',
  selectedBg: '#f5f3ff',
  selectedShadow: '#4c1d95',
  greenBadgeBg: '#f0fdf4',
  greenBadgeText: '#16a34a',
  greenBadgeBorder: '#86efac',
  redBadgeBg: '#fff1f2',
  redBadgeText: '#e11d48',
  redBadgeBorder: '#fecdd3',
  dotPattern: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
} as const
```

- [ ] **Step 2: Commit**

```bash
git add src/features/BodyAgeQuiz/constants/theme.ts
git commit -m "feat: add Lavender Dusk theme constants"
```

---

## Task 4: Questions constants

**Files:**
- Create: `src/features/BodyAgeQuiz/constants/questions.ts`

- [ ] **Step 1: Create questions file**

```ts
// src/features/BodyAgeQuiz/constants/questions.ts
import type { Question } from '../types'

export const QUESTIONS: Question[] = [
  {
    id: 0,
    text: 'How often do you move your body?',
    options: [
      { emoji: '⚡', label: 'Every single day', sublabel: "Can't stop, won't stop", score: -2 },
      { emoji: '🏋️', label: 'A few times a week', sublabel: '3–5 sessions', score: -1 },
      { emoji: '🚶', label: 'Occasionally', sublabel: 'Light walks here and there', score: 2 },
      { emoji: '🛋️', label: 'Mostly chill', sublabel: 'I love my couch', score: 3 },
    ],
    greenBadge: '⚡ Active body',
    redBadge: '🛋️ Move more',
    tip: 'Try a 20-min walk 3x a week — your future self will thank you!',
  },
  {
    id: 1,
    text: 'How well do you sleep?',
    options: [
      { emoji: '🌟', label: '8+ hrs, always fresh', sublabel: 'Wake up glowing', score: -2 },
      { emoji: '😊', label: 'A solid 7–8 hrs', sublabel: 'Pretty good most nights', score: -1 },
      { emoji: '🥱', label: '5–6 hrs', sublabel: 'Could be better', score: 2 },
      { emoji: '😩', label: 'Under 5 hrs', sublabel: 'Running on empty', score: 3 },
    ],
    greenBadge: '😴 Great sleeper',
    redBadge: '😴 Sleep more',
    tip: 'Try sleeping 30 mins earlier tonight — even small changes help a lot!',
  },
  {
    id: 2,
    text: "How's your food mostly?",
    options: [
      { emoji: '🌿', label: 'Very clean', sublabel: 'Whole foods, barely processed', score: -2 },
      { emoji: '🥗', label: 'Mostly healthy', sublabel: 'Good choices most days', score: -1 },
      { emoji: '🍱', label: 'Mix of both', sublabel: 'Healthy-ish', score: 2 },
      { emoji: '🍔', label: 'Mostly junk', sublabel: "Fast food is my love language", score: 3 },
    ],
    greenBadge: '🥗 Healthy eater',
    redBadge: '🍔 Eat better',
    tip: 'Add one extra serving of vegetables per day — it makes a real difference!',
  },
  {
    id: 3,
    text: 'Do you smoke?',
    options: [
      { emoji: '🚫', label: 'Never', sublabel: "Never touched one", score: -2 },
      { emoji: '☁️', label: 'Occasionally', sublabel: 'Social only, rarely', score: -1 },
      { emoji: '🙈', label: 'Trying to quit', sublabel: "Working on it", score: 2 },
      { emoji: '🚬', label: 'Yes, regularly', sublabel: 'Daily habit', score: 3 },
    ],
    greenBadge: '🫁 Clean lungs',
    redBadge: '🚬 Quit smoking',
    tip: 'Every cigarette-free day adds time back to your life — keep going!',
  },
  {
    id: 4,
    text: 'How stressed are you usually?',
    options: [
      { emoji: '🧘', label: 'Rarely stressed', sublabel: 'Zen mode: on', score: -2 },
      { emoji: '😌', label: 'Sometimes', sublabel: 'Manageable most days', score: -1 },
      { emoji: '😟', label: 'Pretty often', sublabel: 'Always something going on', score: 2 },
      { emoji: '😤', label: 'Always stressed', sublabel: 'Stress is my default', score: 3 },
    ],
    greenBadge: '🧘 Low stress',
    redBadge: '😤 Stress less',
    tip: 'Even 5 mins of deep breathing daily can lower your stress significantly!',
  },
  {
    id: 5,
    text: 'How much water do you drink daily?',
    options: [
      { emoji: '🌊', label: '6+ glasses', sublabel: 'Hydration queen', score: -2 },
      { emoji: '💧', label: '3–5 glasses', sublabel: 'Doing alright', score: -1 },
      { emoji: '🥤', label: '1–2 glasses', sublabel: 'Not enough', score: 2 },
      { emoji: '🏜️', label: 'Barely any', sublabel: 'Running dry', score: 3 },
    ],
    greenBadge: '💧 Well hydrated',
    redBadge: '💧 Drink more water',
    tip: 'Keep a water bottle visible — you\'ll drink 40% more without even thinking!',
  },
  {
    id: 6,
    text: "How's your energy through the day?",
    options: [
      { emoji: '⚡', label: 'Always energetic', sublabel: 'Full battery all day', score: -2 },
      { emoji: '😊', label: 'Pretty good', sublabel: 'No major crashes', score: -1 },
      { emoji: '😐', label: 'Often low', sublabel: 'Afternoon slump hits hard', score: 2 },
      { emoji: '😴', label: 'Always tired', sublabel: 'Exhausted by noon', score: 3 },
    ],
    greenBadge: '⚡ High energy',
    redBadge: '😴 Boost energy',
    tip: 'A 10-min morning walk can boost your energy for the whole day!',
  },
  {
    id: 7,
    text: 'How often do you drink alcohol?',
    options: [
      { emoji: '🚫', label: 'Never', sublabel: "Don't drink at all", score: -2 },
      { emoji: '🎉', label: 'Rarely', sublabel: 'Special occasions only', score: -1 },
      { emoji: '🥂', label: 'Most weekends', sublabel: 'Weekend ritual', score: 2 },
      { emoji: '🍷', label: 'Most days', sublabel: 'Daily glass or more', score: 3 },
    ],
    greenBadge: '🍃 Alcohol-free',
    redBadge: '🍷 Drink less',
    tip: 'Try 2 alcohol-free days per week — your liver (and skin!) will love it.',
  },
  {
    id: 8,
    text: "How's your mood generally?",
    options: [
      { emoji: '🌈', label: 'Almost always great', sublabel: 'Life is beautiful', score: -2 },
      { emoji: '😊', label: 'Pretty happy', sublabel: 'Good vibes mostly', score: -1 },
      { emoji: '😐', label: 'Up and down', sublabel: 'Depends on the day', score: 2 },
      { emoji: '😞', label: 'Often low', sublabel: "Tough stretch lately", score: 3 },
    ],
    greenBadge: '🌈 Happy mind',
    redBadge: '💜 Nurture mood',
    tip: 'Even 10 mins of sunlight in the morning can lift your mood noticeably!',
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/features/BodyAgeQuiz/constants/questions.ts
git commit -m "feat: add quiz questions and scoring data"
```

---

## Task 5: Scoring utility (TDD)

**Files:**
- Create: `src/features/BodyAgeQuiz/utils/scoring.ts`
- Create: `src/features/BodyAgeQuiz/utils/__tests__/scoring.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/features/BodyAgeQuiz/utils/__tests__/scoring.test.ts
import { describe, it, expect } from 'vitest'
import { calculateBodyAge, getVerdict, getHabitResults } from '../scoring'

describe('calculateBodyAge', () => {
  it('adds positive scores to chronological age', () => {
    // 9 answers all scoring +3 = +27, clamped to age+15
    const answers = [3, 3, 3, 3, 3, 3, 3, 3, 3]
    expect(calculateBodyAge(30, answers)).toBe(45)
  })

  it('subtracts negative scores from chronological age', () => {
    // 9 answers all scoring -2 = -18, clamped to age-15
    const answers = [-2, -2, -2, -2, -2, -2, -2, -2, -2]
    expect(calculateBodyAge(30, answers)).toBe(15)
  })

  it('never goes below 18 even if age is low', () => {
    const answers = [-2, -2, -2, -2, -2, -2, -2, -2, -2]
    expect(calculateBodyAge(20, answers)).toBe(18)
  })

  it('calculates mixed scores correctly', () => {
    // scores: -2,-1,-2,-1,-2,-1,-2,-1,-2 = -12, age 35 → 23
    const answers = [-2, -1, -2, -1, -2, -1, -2, -1, -2]
    expect(calculateBodyAge(35, answers)).toBe(23)
  })

  it('returns exact age when all scores are zero-balanced', () => {
    const answers = [-2, 3, -2, 3, -2, 3, -2, 3, -2] // sum = -2
    expect(calculateBodyAge(40, answers)).toBe(38)
  })
})

describe('getVerdict', () => {
  it('returns fine wine message when 5+ years younger', () => {
    expect(getVerdict(40, 34)).toContain('fine wine')
  })

  it('returns younger message when 1-4 years younger', () => {
    expect(getVerdict(40, 37)).toContain('younger')
  })

  it('returns on track message when same age', () => {
    expect(getVerdict(40, 40)).toContain('track')
  })

  it('returns room to grow message when 1-4 years older', () => {
    expect(getVerdict(40, 43)).toContain('room')
  })

  it('returns love message when 5+ years older', () => {
    expect(getVerdict(40, 46)).toContain('love')
  })
})

describe('getHabitResults', () => {
  it('returns green for scores <= -1', () => {
    const results = getHabitResults([-2, -1, 2, 3, -2, -1, 2, 3, -2])
    expect(results[0].type).toBe('green')
    expect(results[1].type).toBe('green')
  })

  it('returns red for scores >= +2', () => {
    const results = getHabitResults([-2, -1, 2, 3, -2, -1, 2, 3, -2])
    expect(results[2].type).toBe('red')
    expect(results[3].type).toBe('red')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd /Users/sanket/body-age-calculator/body-age-calculator && npm test
```

Expected: fail with "Cannot find module '../scoring'"

- [ ] **Step 3: Implement scoring.ts**

```ts
// src/features/BodyAgeQuiz/utils/scoring.ts
import { QUESTIONS } from '../constants/questions'

export function calculateBodyAge(age: number, answers: number[]): number {
  const total = answers.reduce((sum, score) => sum + score, 0)
  const raw = age + total
  const min = Math.max(18, age - 15)
  const max = age + 15
  return Math.min(max, Math.max(min, raw))
}

export function getVerdict(realAge: number, bodyAge: number): string {
  const diff = realAge - bodyAge
  if (diff >= 5) return "You're aging like fine wine! 🌟"
  if (diff >= 1) return 'Your body is younger than you think! 💜'
  if (diff === 0) return 'Right on track — keep going! 🦚'
  if (diff >= -4) return "A little room to grow — you've got this! 🌱"
  return 'Time to show your body some love! 💪'
}

export interface HabitResult {
  type: 'green' | 'red'
  badge: string
  tip: string
}

export function getHabitResults(answers: number[]): HabitResult[] {
  return answers.map((score, i) => {
    const q = QUESTIONS[i]
    return {
      type: score <= -1 ? 'green' : 'red',
      badge: score <= -1 ? q.greenBadge : q.redBadge,
      tip: q.tip,
    }
  })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd /Users/sanket/body-age-calculator/body-age-calculator && npm test
```

Expected: all 11 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/features/BodyAgeQuiz/utils/scoring.ts src/features/BodyAgeQuiz/utils/__tests__/scoring.test.ts
git commit -m "feat: add body age scoring utility (TDD)"
```

---

## Task 6: useQuiz hook

**Files:**
- Create: `src/features/BodyAgeQuiz/hooks/useQuiz.ts`

- [ ] **Step 1: Create hook**

```ts
// src/features/BodyAgeQuiz/hooks/useQuiz.ts
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
}

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'age_input' }

    case 'SET_AGE':
      return { ...state, age: action.age, screen: 'quiz', currentQuestion: 0, answers: [], selectedOption: null }

    case 'SELECT_OPTION':
      return { ...state, selectedOption: action.optionIndex }

    case 'NEXT_QUESTION': {
      if (state.selectedOption === null) return state
      // get score from the selected option — stored via SELECT_OPTION action's score
      // score is stored in answers optimistically; here we just advance
      const isLast = state.currentQuestion === 8
      if (isLast) {
        const bodyAge = calculateBodyAge(state.age, state.answers)
        return { ...state, screen: 'reveal', bodyAge, selectedOption: null }
      }
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        selectedOption: null,
      }
    }

    case 'SELECT_OPTION': {
      const newAnswers = [...state.answers]
      newAnswers[state.currentQuestion] = action.score
      return { ...state, selectedOption: action.optionIndex, answers: newAnswers }
    }

    case 'REVEAL_COMPLETE':
      return { ...state, screen: 'result' }

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
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const streakCount = state.answers.filter(s => s <= -1).length

  return { state, start, setAge, selectOption, nextQuestion, revealComplete, reset, streakCount }
}
```

- [ ] **Step 2: Fix duplicate case in reducer**

The `SELECT_OPTION` case appears twice — TypeScript will warn. Replace the entire reducer with the corrected version:

```ts
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

    case 'RESET':
      return initialState

    default:
      return state
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/BodyAgeQuiz/hooks/useQuiz.ts
git commit -m "feat: add useQuiz state machine hook"
```

---

## Task 7: useSound hook

**Files:**
- Create: `src/features/BodyAgeQuiz/hooks/useSound.ts`

- [ ] **Step 1: Create hook**

```ts
// src/features/BodyAgeQuiz/hooks/useSound.ts
import { useRef, useCallback, useEffect, useState } from 'react'

const SOUND_FILES = {
  bg: '/sounds/bg-music.mp3',
  pop: '/sounds/pop.mp3',
  whoosh: '/sounds/whoosh.mp3',
  countdown: '/sounds/countdown.mp3',
  celebrate: '/sounds/celebrate.mp3',
} as const

type SoundKey = keyof typeof SOUND_FILES

export function useSound() {
  const [musicOn, setMusicOn] = useState(true)
  const audioRefs = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({})

  useEffect(() => {
    // pre-load all audio elements
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      const audio = new Audio(src)
      if (key === 'bg') {
        audio.loop = true
        audio.volume = 0.3
      } else {
        audio.volume = 0.6
      }
      audioRefs.current[key as SoundKey] = audio
    })
    return () => {
      Object.values(audioRefs.current).forEach(a => a?.pause())
    }
  }, [])

  const play = useCallback((key: SoundKey) => {
    const audio = audioRefs.current[key]
    if (!audio) return
    if (key === 'bg' && !musicOn) return
    audio.currentTime = 0
    audio.play().catch(() => {/* autoplay blocked — silently ignore */})
  }, [musicOn])

  const startBgMusic = useCallback(() => {
    if (!musicOn) return
    play('bg')
  }, [musicOn, play])

  const stopBgMusic = useCallback(() => {
    audioRefs.current.bg?.pause()
  }, [])

  const toggleMusic = useCallback(() => {
    setMusicOn(prev => {
      const next = !prev
      if (!next) audioRefs.current.bg?.pause()
      else {
        audioRefs.current.bg!.play().catch(() => {})
      }
      return next
    })
  }, [])

  return { play, startBgMusic, stopBgMusic, toggleMusic, musicOn }
}
```

- [ ] **Step 2: Add placeholder sound files so app doesn't throw 404s**

```bash
mkdir -p /Users/sanket/body-age-calculator/body-age-calculator/public/sounds
# Create silent placeholder mp3 files (1 byte) — will be replaced with real files
touch /Users/sanket/body-age-calculator/body-age-calculator/public/sounds/bg-music.mp3
touch /Users/sanket/body-age-calculator/body-age-calculator/public/sounds/pop.mp3
touch /Users/sanket/body-age-calculator/body-age-calculator/public/sounds/whoosh.mp3
touch /Users/sanket/body-age-calculator/body-age-calculator/public/sounds/countdown.mp3
touch /Users/sanket/body-age-calculator/body-age-calculator/public/sounds/celebrate.mp3
```

Note: Replace these with real royalty-free MP3s from https://pixabay.com/sound-effects/ (search: "lofi loop", "pop click", "whoosh", "countdown", "success chime").

- [ ] **Step 3: Commit**

```bash
git add src/features/BodyAgeQuiz/hooks/useSound.ts public/sounds/
git commit -m "feat: add useSound hook and sound file placeholders"
```

---

## Task 8: Global CSS + Mascot component

**Files:**
- Create: `src/features/BodyAgeQuiz/BodyAgeQuiz.module.css`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/Mascot/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/Mascot/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/Mascot/Mascot.module.css`

- [ ] **Step 1: Create global quiz CSS module**

```css
/* src/features/BodyAgeQuiz/BodyAgeQuiz.module.css */

.root {
  font-family: 'Nunito', sans-serif;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fdf4ff;
  padding: 0;
  overflow-x: hidden;
}

.gradientScreen {
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(150deg, #1e0a3c 0%, #6d28d9 45%, #a78bfa 80%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 40px;
  position: relative;
  overflow: hidden;
}

.gradientScreen::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  pointer-events: none;
}

.contentWrap {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* 3D button */
.btn3d {
  width: 100%;
  max-width: 480px;
  padding: clamp(13px, 3.5vw, 16px);
  border-radius: 16px;
  border: none;
  font-family: 'Nunito', sans-serif;
  font-size: clamp(14px, 4vw, 17px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffffff;
  background: linear-gradient(90deg, #7c3aed, #a78bfa);
  box-shadow: 0 5px 0 #4c1d95;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}

.btn3d:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 0 #4c1d95;
}

.btn3d:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #4c1d95;
}

.btn3d:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 5px 0 #4c1d95;
}

/* White card */
.card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 24px;
  padding: clamp(16px, 5vw, 24px);
  box-shadow: 0 6px 0 rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08);
}
```

- [ ] **Step 2: Create Mascot constants**

```ts
// src/features/BodyAgeQuiz/components/QuizScreen/Mascot/constants.ts

export const MASCOT_SPEECHES = {
  good: [
    'Amazing! Keep it up! ✨',
    'Love that for you! 💜',
    "Yes queen! That's the spirit! 🌟",
    'You're doing so well! 🦚',
    'That's what I'm talking about! 🎉',
  ],
  bad: [
    "No worries — you can change that! 💪",
    "It's okay, small steps matter! 🌱",
    "That's honest — progress starts here! 💜",
    "We all have room to grow! 🤗",
    "Awareness is the first step! 🌸",
  ],
  welcome: "Let's find out how young your body really is! 🌙",
  ageInput: "This stays between us! 🤫",
  reveal: "Drumroll please... 🥁",
} as const
```

- [ ] **Step 3: Create Mascot CSS**

```css
/* src/features/BodyAgeQuiz/components/QuizScreen/Mascot/Mascot.module.css */

.wrap {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 8px;
}

.mascot {
  font-size: clamp(52px, 14vw, 72px);
  filter: drop-shadow(0 6px 12px rgba(109,40,217,0.4));
  animation: float 3s ease-in-out infinite;
  line-height: 1;
  user-select: none;
}

.mascot.bounce {
  animation: bounce 0.4s cubic-bezier(.34,1.56,.64,1);
}

.bubble {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  padding: clamp(6px, 2vw, 8px) clamp(10px, 3vw, 14px);
  font-size: clamp(11px, 3vw, 13px);
  font-weight: 800;
  color: #374151;
  box-shadow: 0 3px 12px rgba(0,0,0,0.1);
  line-height: 1.4;
  max-width: 180px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

@keyframes bounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}
```

- [ ] **Step 4: Create Mascot component**

```tsx
// src/features/BodyAgeQuiz/components/QuizScreen/Mascot/index.tsx
import { useEffect, useRef } from 'react'
import styles from './Mascot.module.css'
import { MASCOT_SPEECHES } from './constants'

interface MascotProps {
  speech: string
  animate?: boolean
}

export function Mascot({ speech, animate = false }: MascotProps) {
  const mascotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!animate || !mascotRef.current) return
    mascotRef.current.classList.remove(styles.bounce)
    void mascotRef.current.offsetWidth // force reflow
    mascotRef.current.classList.add(styles.bounce)
  }, [animate, speech])

  return (
    <div className={styles.wrap}>
      <span ref={mascotRef} className={styles.mascot}>🦚</span>
      {speech && <div className={styles.bubble}>{speech}</div>}
    </div>
  )
}

export { MASCOT_SPEECHES }
```

- [ ] **Step 5: Commit**

```bash
git add src/features/BodyAgeQuiz/BodyAgeQuiz.module.css \
        src/features/BodyAgeQuiz/components/QuizScreen/Mascot/
git commit -m "feat: global quiz CSS and Mascot component"
```

---

## Task 9: AnswerOption component

**Files:**
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/AnswerOption.module.css`

- [ ] **Step 1: Create constants**

```ts
// src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/constants.ts
export const ANSWER_OPTION_STRINGS = {
  selectedAriaLabel: 'Selected',
  selectAriaLabel: 'Select',
} as const
```

- [ ] **Step 2: Create CSS**

```css
/* src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/AnswerOption.module.css */

.option {
  display: flex;
  align-items: center;
  gap: clamp(10px, 3vw, 14px);
  background: #ffffff;
  border: 2.5px solid #e5e7eb;
  border-radius: 16px;
  padding: clamp(10px, 3vw, 14px) clamp(12px, 3.5vw, 16px);
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.15s, border-color 0.15s, background 0.15s;
  box-shadow: 0 4px 0 #e5e7eb;
  width: 100%;
  text-align: left;
  font-family: 'Nunito', sans-serif;
}

.option:hover {
  border-color: #a78bfa;
  box-shadow: 0 4px 0 #a78bfa;
  transform: translateY(-2px);
}

.option.selected {
  border-color: #7c3aed;
  background: #f5f3ff;
  box-shadow: 0 4px 0 #4c1d95;
  transform: translateY(-2px);
}

.option:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #e5e7eb;
}

.emoji {
  font-size: clamp(22px, 6vw, 28px);
  line-height: 1;
  flex-shrink: 0;
}

.textWrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: clamp(13px, 3.5vw, 15px);
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.sublabel {
  font-size: clamp(11px, 2.8vw, 12px);
  font-weight: 700;
  color: #9ca3af;
}

.selected .label {
  color: #4c1d95;
}
```

- [ ] **Step 3: Create component**

```tsx
// src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/index.tsx
import styles from './AnswerOption.module.css'
import type { AnswerOption as AnswerOptionType } from '../../../types'

interface AnswerOptionProps {
  option: AnswerOptionType
  isSelected: boolean
  onSelect: () => void
}

export function AnswerOption({ option, isSelected, onSelect }: AnswerOptionProps) {
  return (
    <button
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <span className={styles.emoji}>{option.emoji}</span>
      <span className={styles.textWrap}>
        <span className={styles.label}>{option.label}</span>
        <span className={styles.sublabel}>{option.sublabel}</span>
      </span>
    </button>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/QuizScreen/AnswerOption/
git commit -m "feat: AnswerOption component with 3D press effect"
```

---

## Task 10: WelcomeScreen

**Files:**
- Create: `src/features/BodyAgeQuiz/components/WelcomeScreen/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/WelcomeScreen/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/WelcomeScreen/WelcomeScreen.module.css`

- [ ] **Step 1: Create constants**

```ts
// src/features/BodyAgeQuiz/components/WelcomeScreen/constants.ts
export const WELCOME_STRINGS = {
  title: 'Body Age Quiz',
  subtitle: '9 quick questions — no medical stuff, promise!',
  cta: 'Start Quiz →',
  mascotSpeech: "Let's find out how young your body really is! 🌙",
  musicOn: '🎵',
  musicOff: '🔇',
} as const
```

- [ ] **Step 2: Create CSS**

```css
/* src/features/BodyAgeQuiz/components/WelcomeScreen/WelcomeScreen.module.css */

.screen {
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(150deg, #1e0a3c 0%, #6d28d9 45%, #a78bfa 80%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px 48px;
  position: relative;
  overflow: hidden;
}

.screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  pointer-events: none;
}

.musicBtn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.musicBtn:hover { background: rgba(255,255,255,0.3); }

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.title {
  font-size: clamp(28px, 8vw, 40px);
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 2px 12px rgba(0,0,0,0.2);
  margin: 0;
}

.subtitle {
  font-size: clamp(13px, 3.5vw, 15px);
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  text-align: center;
  margin: 0;
}

.ctaWrap {
  width: 100%;
  margin-top: 8px;
}
```

- [ ] **Step 3: Create component**

```tsx
// src/features/BodyAgeQuiz/components/WelcomeScreen/index.tsx
import styles from './WelcomeScreen.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { Mascot } from '../QuizScreen/Mascot'
import { WELCOME_STRINGS } from './constants'

interface WelcomeScreenProps {
  onStart: () => void
  onToggleMusic: () => void
  musicOn: boolean
}

export function WelcomeScreen({ onStart, onToggleMusic, musicOn }: WelcomeScreenProps) {
  return (
    <div className={styles.screen}>
      <button className={styles.musicBtn} onClick={onToggleMusic} aria-label="Toggle music">
        {musicOn ? WELCOME_STRINGS.musicOn : WELCOME_STRINGS.musicOff}
      </button>
      <div className={styles.inner}>
        <Mascot speech={WELCOME_STRINGS.mascotSpeech} />
        <h1 className={styles.title}>{WELCOME_STRINGS.title}</h1>
        <p className={styles.subtitle}>{WELCOME_STRINGS.subtitle}</p>
        <div className={styles.ctaWrap}>
          <button className={globalStyles.btn3d} onClick={onStart}>
            {WELCOME_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/WelcomeScreen/
git commit -m "feat: WelcomeScreen component"
```

---

## Task 11: AgeInput screen

**Files:**
- Create: `src/features/BodyAgeQuiz/components/AgeInput/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/AgeInput/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/AgeInput/AgeInput.module.css`

- [ ] **Step 1: Create constants**

```ts
// src/features/BodyAgeQuiz/components/AgeInput/constants.ts
export const AGE_INPUT_STRINGS = {
  heading: 'First, how old are you?',
  placeholder: '30',
  cta: "Let's Go →",
  mascotSpeech: 'This stays between us! 🤫',
  errorMin: 'Please enter an age of 18 or above',
  errorMax: 'Please enter an age of 90 or below',
} as const

export const AGE_MIN = 18
export const AGE_MAX = 90
```

- [ ] **Step 2: Create CSS**

```css
/* src/features/BodyAgeQuiz/components/AgeInput/AgeInput.module.css */

.screen {
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(150deg, #1e0a3c 0%, #6d28d9 45%, #a78bfa 80%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px 48px;
  position: relative;
  overflow: hidden;
}

.screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  pointer-events: none;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.heading {
  font-size: clamp(22px, 6vw, 30px);
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  margin: 0;
}

.inputWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.ageInput {
  font-family: 'Nunito', sans-serif;
  font-size: clamp(40px, 12vw, 64px);
  font-weight: 900;
  color: #4c1d95;
  background: #ffffff;
  border: 3px solid #e5e7eb;
  border-radius: 24px;
  width: clamp(140px, 40vw, 180px);
  text-align: center;
  padding: 16px 8px;
  outline: none;
  box-shadow: 0 5px 0 #e5e7eb;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: textfield;
  -moz-appearance: textfield;
}

.ageInput::-webkit-inner-spin-button,
.ageInput::-webkit-outer-spin-button { appearance: none; }

.ageInput:focus {
  border-color: #7c3aed;
  box-shadow: 0 5px 0 #4c1d95;
}

.error {
  font-size: 13px;
  font-weight: 700;
  color: #fca5a5;
  text-align: center;
}

.ctaWrap { width: 100%; }
```

- [ ] **Step 3: Create component**

```tsx
// src/features/BodyAgeQuiz/components/AgeInput/index.tsx
import { useState } from 'react'
import styles from './AgeInput.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { Mascot } from '../QuizScreen/Mascot'
import { AGE_INPUT_STRINGS, AGE_MIN, AGE_MAX } from './constants'

interface AgeInputProps {
  onSubmit: (age: number) => void
}

export function AgeInput({ onSubmit }: AgeInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const age = Number(value)
    if (age < AGE_MIN) { setError(AGE_INPUT_STRINGS.errorMin); return }
    if (age > AGE_MAX) { setError(AGE_INPUT_STRINGS.errorMax); return }
    setError('')
    onSubmit(age)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <Mascot speech={AGE_INPUT_STRINGS.mascotSpeech} />
        <h2 className={styles.heading}>{AGE_INPUT_STRINGS.heading}</h2>
        <div className={styles.inputWrap}>
          <input
            className={styles.ageInput}
            type="number"
            min={AGE_MIN}
            max={AGE_MAX}
            value={value}
            placeholder={AGE_INPUT_STRINGS.placeholder}
            onChange={e => { setValue(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.ctaWrap}>
          <button
            className={globalStyles.btn3d}
            onClick={handleSubmit}
            disabled={!value}
          >
            {AGE_INPUT_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/AgeInput/
git commit -m "feat: AgeInput screen"
```

---

## Task 12: QuizScreen

**Files:**
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/QuizScreen/QuizScreen.module.css`

- [ ] **Step 1: Create constants**

```ts
// src/features/BodyAgeQuiz/components/QuizScreen/constants.ts
export const QUIZ_SCREEN_STRINGS = {
  questionLabel: (current: number, total: number) => `Question ${current} of ${total}`,
  nextBtn: 'Next →',
  closeAriaLabel: 'Close quiz',
  totalQuestions: 9,
} as const
```

- [ ] **Step 2: Create CSS**

```css
/* src/features/BodyAgeQuiz/components/QuizScreen/QuizScreen.module.css */

.screen {
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(150deg, #1e0a3c 0%, #6d28d9 45%, #a78bfa 80%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 32px;
  position: relative;
  overflow: hidden;
}

.screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  pointer-events: none;
}

.inner {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

/* Top bar */
.topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.closeBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: none;
  color: rgba(255,255,255,0.9);
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.closeBtn:hover { background: rgba(255,255,255,0.3); }

.progressTrack {
  flex: 1;
  height: 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 99px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, #c4b5fd, #fbcfe8);
  border-radius: 99px;
  transition: width 0.4s ease;
}

.streakBadge {
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 99px;
  background: rgba(255,255,255,0.2);
  color: #ffffff;
  flex-shrink: 0;
  min-width: 52px;
  text-align: center;
}

/* Question card */
.card {
  background: #ffffff;
  border-radius: 24px;
  padding: clamp(16px, 5vw, 24px);
  box-shadow: 0 6px 0 rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08);
}

.questionLabel {
  font-size: clamp(10px, 2.5vw, 11px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #9ca3af;
  margin-bottom: 6px;
}

.questionText {
  font-size: clamp(16px, 4.5vw, 20px);
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.3;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nextWrap {
  width: 100%;
}

/* Slide-in animation */
.slideIn {
  animation: slideIn 0.3s cubic-bezier(.34,1.56,.64,1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

- [ ] **Step 3: Create component**

```tsx
// src/features/BodyAgeQuiz/components/QuizScreen/index.tsx
import { useState, useEffect } from 'react'
import styles from './QuizScreen.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { Mascot, MASCOT_SPEECHES } from './Mascot'
import { AnswerOption } from './AnswerOption'
import { QUIZ_SCREEN_STRINGS } from './constants'
import { QUESTIONS } from '../../constants/questions'
import type { QuizState } from '../../types'

interface QuizScreenProps {
  state: QuizState
  streakCount: number
  onSelectOption: (optionIndex: number, score: number) => void
  onNext: () => void
  onClose: () => void
  onPlayPop: () => void
  onPlayWhoosh: () => void
}

export function QuizScreen({
  state, streakCount, onSelectOption, onNext, onClose, onPlayPop, onPlayWhoosh,
}: QuizScreenProps) {
  const [animKey, setAnimKey] = useState(0)
  const [mascotSpeech, setMascotSpeech] = useState('')
  const [mascotAnimate, setMascotAnimate] = useState(false)

  const question = QUESTIONS[state.currentQuestion]
  const progress = ((state.currentQuestion) / QUIZ_SCREEN_STRINGS.totalQuestions) * 100

  useEffect(() => {
    setAnimKey(k => k + 1)
    setMascotSpeech('')
  }, [state.currentQuestion])

  const handleSelect = (idx: number, score: number) => {
    onSelectOption(idx, score)
    onPlayPop()
    const speeches = score <= -1 ? MASCOT_SPEECHES.good : MASCOT_SPEECHES.bad
    setMascotSpeech(speeches[Math.floor(Math.random() * speeches.length)])
    setMascotAnimate(true)
    setTimeout(() => setMascotAnimate(false), 500)
  }

  const handleNext = () => {
    onPlayWhoosh()
    onNext()
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.topbar}>
          <button className={styles.closeBtn} onClick={onClose} aria-label={QUIZ_SCREEN_STRINGS.closeAriaLabel}>✕</button>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.streakBadge}>🔥 {streakCount}</div>
        </div>

        <Mascot speech={mascotSpeech} animate={mascotAnimate} />

        <div key={animKey} className={`${styles.card} ${styles.slideIn}`}>
          <div className={styles.questionLabel}>
            {QUIZ_SCREEN_STRINGS.questionLabel(state.currentQuestion + 1, QUIZ_SCREEN_STRINGS.totalQuestions)}
          </div>
          <div className={styles.questionText}>{question.text}</div>
          <div className={styles.options}>
            {question.options.map((opt, idx) => (
              <AnswerOption
                key={idx}
                option={opt}
                isSelected={state.selectedOption === idx}
                onSelect={() => handleSelect(idx, opt.score)}
              />
            ))}
          </div>
        </div>

        <div className={styles.nextWrap}>
          <button
            className={globalStyles.btn3d}
            onClick={handleNext}
            disabled={state.selectedOption === null}
          >
            {QUIZ_SCREEN_STRINGS.nextBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/QuizScreen/
git commit -m "feat: QuizScreen with progress bar, streak, slide animation"
```

---

## Task 13: RevealScreen

**Files:**
- Create: `src/features/BodyAgeQuiz/components/RevealScreen/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/RevealScreen/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/RevealScreen/RevealScreen.module.css`

- [ ] **Step 1: Create constants**

```ts
// src/features/BodyAgeQuiz/components/RevealScreen/constants.ts
export const REVEAL_STRINGS = {
  loading: 'Calculating your body age…',
  revealHeading: 'Your Body Age is',
  countdown: ['3', '2', '1'],
  mascotSpeech: 'Drumroll please... 🥁',
} as const
```

- [ ] **Step 2: Create CSS**

```css
/* src/features/BodyAgeQuiz/components/RevealScreen/RevealScreen.module.css */

.screen {
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(150deg, #1e0a3c 0%, #6d28d9 45%, #a78bfa 80%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}

.screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  pointer-events: none;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.loadingText {
  font-size: clamp(16px, 4vw, 20px);
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255,255,255,0.2);
  border-top-color: #c4b5fd;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.countdown {
  font-size: clamp(80px, 22vw, 120px);
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 4px 24px rgba(109,40,217,0.4);
  animation: pop 0.4s cubic-bezier(.34,1.56,.64,1);
  line-height: 1;
}

@keyframes pop {
  0%   { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}
```

- [ ] **Step 3: Create component**

```tsx
// src/features/BodyAgeQuiz/components/RevealScreen/index.tsx
import { useEffect, useState } from 'react'
import styles from './RevealScreen.module.css'
import { Mascot } from '../QuizScreen/Mascot'
import { REVEAL_STRINGS } from './constants'

interface RevealScreenProps {
  bodyAge: number
  onComplete: () => void
  onPlayCountdown: () => void
  onPlayCelebrate: () => void
}

type Phase = 'loading' | 'countdown' | 'done'

export function RevealScreen({ bodyAge, onComplete, onPlayCountdown, onPlayCelebrate }: RevealScreenProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [countdownIdx, setCountdownIdx] = useState(0)

  useEffect(() => {
    // 2s loading → countdown → complete
    const t1 = setTimeout(() => { setPhase('countdown'); onPlayCountdown() }, 2000)
    return () => clearTimeout(t1)
  }, [onPlayCountdown])

  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdownIdx < REVEAL_STRINGS.countdown.length - 1) {
      const t = setTimeout(() => setCountdownIdx(i => i + 1), 900)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { onPlayCelebrate(); setPhase('done'); setTimeout(onComplete, 800) }, 900)
      return () => clearTimeout(t)
    }
  }, [phase, countdownIdx, onComplete, onPlayCelebrate])

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <Mascot speech={REVEAL_STRINGS.mascotSpeech} animate={phase === 'countdown'} />
        {phase === 'loading' && (
          <>
            <div className={styles.loadingText}>{REVEAL_STRINGS.loading}</div>
            <div className={styles.spinner} />
          </>
        )}
        {phase === 'countdown' && (
          <div key={countdownIdx} className={styles.countdown}>
            {REVEAL_STRINGS.countdown[countdownIdx]}
          </div>
        )}
        {phase === 'done' && (
          <div key="done" className={styles.countdown}>{bodyAge}</div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/RevealScreen/
git commit -m "feat: RevealScreen with spinner and countdown animation"
```

---

## Task 14: HabitBadge + TipsCarousel + ShareCard

**Files:**
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/HabitBadge.module.css`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/TipsCarousel.module.css`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/ShareCard/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/ShareCard/constants.ts`

- [ ] **Step 1: HabitBadge constants + CSS + component**

```ts
// src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/constants.ts
export const HABIT_BADGE_STRINGS = {
  sectionLabel: 'Your habits',
} as const
```

```css
/* src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/HabitBadge.module.css */

.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: clamp(11px, 3vw, 13px);
  font-weight: 800;
  animation: fadeUp 0.4s ease both;
}

.green {
  background: #f0fdf4;
  color: #16a34a;
  border: 2px solid #86efac;
}

.red {
  background: #fff1f2;
  color: #e11d48;
  border: 2px solid #fecdd3;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

```tsx
// src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/index.tsx
import styles from './HabitBadge.module.css'
import type { HabitResult } from '../../../utils/scoring'

interface HabitBadgeProps {
  results: HabitResult[]
}

export function HabitBadge({ results }: HabitBadgeProps) {
  return (
    <div className={styles.wrap}>
      {results.map((r, i) => (
        <span
          key={i}
          className={`${styles.badge} ${r.type === 'green' ? styles.green : styles.red}`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {r.badge}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: TipsCarousel constants + CSS + component**

```ts
// src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/constants.ts
export const TIPS_STRINGS = {
  sectionLabel: 'Quick wins for you',
  noTips: 'Amazing — you\'re crushing it! 🌟',
} as const
```

```css
/* src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/TipsCarousel.module.css */

.wrap { width: 100%; }

.label {
  font-size: clamp(10px, 2.5vw, 11px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.track {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.track::-webkit-scrollbar { display: none; }

.tip {
  flex: 0 0 calc(100% - 32px);
  scroll-snap-align: start;
  background: linear-gradient(135deg, #f5f3ff, #fdf4ff);
  border: 2px solid #ddd6fe;
  border-radius: 16px;
  padding: 14px 16px;
  font-size: clamp(13px, 3.5vw, 14px);
  font-weight: 700;
  color: #4c1d95;
  line-height: 1.5;
}

.noTips {
  font-size: clamp(13px, 3.5vw, 14px);
  font-weight: 700;
  color: #16a34a;
  text-align: center;
  padding: 12px;
}
```

```tsx
// src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/index.tsx
import styles from './TipsCarousel.module.css'
import { TIPS_STRINGS } from './constants'
import type { HabitResult } from '../../../utils/scoring'

interface TipsCarouselProps {
  results: HabitResult[]
}

export function TipsCarousel({ results }: TipsCarouselProps) {
  const tips = results.filter(r => r.type === 'red').map(r => r.tip)

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>{TIPS_STRINGS.sectionLabel}</div>
      {tips.length === 0 ? (
        <div className={styles.noTips}>{TIPS_STRINGS.noTips}</div>
      ) : (
        <div className={styles.track}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tip}>{tip}</div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: ShareCard constants + component**

```ts
// src/features/BodyAgeQuiz/components/ResultScreen/ShareCard/constants.ts
export const SHARE_STRINGS = {
  btnLabel: 'Share my result 🚀',
  canvasTitle: 'Body Age Quiz',
  canvasSubtitle: 'My body age is',
  canvasHashtag: '#BodyAgeQuiz',
  shareTitle: 'My Body Age Quiz Result',
  shareText: (bodyAge: number, realAge: number) =>
    `I just found out my body age is ${bodyAge} (real age: ${realAge})! 💜 Try it yourself! #BodyAgeQuiz`,
} as const
```

```tsx
// src/features/BodyAgeQuiz/components/ResultScreen/ShareCard/index.tsx
import { useCallback } from 'react'
import globalStyles from '../../../BodyAgeQuiz.module.css'
import { SHARE_STRINGS } from './constants'

interface ShareCardProps {
  bodyAge: number
  realAge: number
}

export function ShareCard({ bodyAge, realAge }: ShareCardProps) {
  const handleShare = useCallback(async () => {
    // Draw share card on canvas
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')!

    // Gradient bg
    const grad = ctx.createLinearGradient(0, 0, 800, 800)
    grad.addColorStop(0, '#1e0a3c')
    grad.addColorStop(0.5, '#6d28d9')
    grad.addColorStop(1, '#a78bfa')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 800)

    // Dot pattern
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    for (let x = 0; x < 800; x += 24) {
      for (let y = 0; y < 800; y += 24) {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
      }
    }

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(SHARE_STRINGS.canvasTitle, 400, 120)

    // Mascot emoji
    ctx.font = '160px serif'
    ctx.fillText('🦚', 400, 320)

    // Body age number
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 160px sans-serif'
    ctx.fillText(String(bodyAge), 400, 530)

    // Subtitle
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(SHARE_STRINGS.canvasSubtitle, 400, 600)
    ctx.fillText(`vs real age ${realAge}`, 400, 648)

    // Hashtag
    ctx.fillStyle = '#c4b5fd'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(SHARE_STRINGS.canvasHashtag, 400, 740)

    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'))
    if (!blob) return

    if (navigator.share) {
      try {
        const file = new File([blob], 'body-age.png', { type: 'image/png' })
        await navigator.share({
          title: SHARE_STRINGS.shareTitle,
          text: SHARE_STRINGS.shareText(bodyAge, realAge),
          files: [file],
        })
        return
      } catch { /* fallback to download */ }
    }

    // Fallback: download the image
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'body-age-result.png'
    a.click()
    URL.revokeObjectURL(url)
  }, [bodyAge, realAge])

  return (
    <button className={globalStyles.btn3d} onClick={handleShare}>
      {SHARE_STRINGS.btnLabel}
    </button>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/ResultScreen/HabitBadge/ \
        src/features/BodyAgeQuiz/components/ResultScreen/TipsCarousel/ \
        src/features/BodyAgeQuiz/components/ResultScreen/ShareCard/
git commit -m "feat: HabitBadge, TipsCarousel, ShareCard components"
```

---

## Task 15: ResultScreen + confetti

**Files:**
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/index.tsx`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/constants.ts`
- Create: `src/features/BodyAgeQuiz/components/ResultScreen/ResultScreen.module.css`

- [ ] **Step 1: Create constants**

```ts
// src/features/BodyAgeQuiz/components/ResultScreen/constants.ts
export const RESULT_STRINGS = {
  heading: 'Your Body Age is',
  vsLabel: (realAge: number) => `vs your real age of ${realAge}`,
  retakeBtn: 'Retake Quiz 🔄',
  habitsLabel: 'Your habits',
} as const
```

- [ ] **Step 2: Create CSS with confetti**

```css
/* src/features/BodyAgeQuiz/components/ResultScreen/ResultScreen.module.css */

.screen {
  width: 100%;
  min-height: 100dvh;
  background: #fdf4ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 48px;
  position: relative;
  overflow: hidden;
}

.inner {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

/* Header card */
.headerCard {
  background: linear-gradient(150deg, #1e0a3c 0%, #6d28d9 60%, #a78bfa 100%);
  border-radius: 24px;
  padding: clamp(20px, 5vw, 28px);
  text-align: center;
  box-shadow: 0 6px 0 #4c1d95, 0 8px 24px rgba(109,40,217,0.2);
  position: relative;
  overflow: hidden;
}

.headerCard::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
  pointer-events: none;
}

.heading {
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 800;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.bodyAge {
  font-size: clamp(72px, 20vw, 100px);
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  animation: ageReveal 0.6s cubic-bezier(.34,1.56,.64,1);
  text-shadow: 0 4px 24px rgba(0,0,0,0.2);
}

@keyframes ageReveal {
  0% { transform: scale(0.3); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.vs {
  font-size: clamp(13px, 3vw, 15px);
  font-weight: 700;
  color: rgba(255,255,255,0.6);
  margin-top: 4px;
}

.verdict {
  font-size: clamp(15px, 4vw, 18px);
  font-weight: 900;
  color: #ffffff;
  margin-top: 10px;
  line-height: 1.3;
}

/* White card */
.whiteCard {
  background: #ffffff;
  border-radius: 20px;
  padding: clamp(16px, 4vw, 20px);
  box-shadow: 0 4px 0 #e5e7eb, 0 6px 16px rgba(0,0,0,0.06);
}

.sectionLabel {
  font-size: clamp(10px, 2.5vw, 11px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #9ca3af;
  margin-bottom: 10px;
}

/* Confetti */
.confetti {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 100vh;
  pointer-events: none;
  z-index: 99;
}

.confettiPiece {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confettiFall linear both;
}

@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

- [ ] **Step 3: Create component**

```tsx
// src/features/BodyAgeQuiz/components/ResultScreen/index.tsx
import { useMemo } from 'react'
import styles from './ResultScreen.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { HabitBadge } from './HabitBadge'
import { TipsCarousel } from './TipsCarousel'
import { ShareCard } from './ShareCard'
import { RESULT_STRINGS } from './constants'
import { getVerdict, getHabitResults } from '../../utils/scoring'
import type { QuizState } from '../../types'

const CONFETTI_COLORS = ['#7c3aed','#a78bfa','#f472b6','#fbbf24','#34d399','#60a5fa']

interface ResultScreenProps {
  state: QuizState
  onReset: () => void
}

export function ResultScreen({ state, onReset }: ResultScreenProps) {
  const verdict = getVerdict(state.age, state.bodyAge)
  const habitResults = useMemo(() => getHabitResults(state.answers), [state.answers])

  const confettiPieces = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: `${1.5 + Math.random() * 2}s`,
      delay: `${Math.random() * 0.8}s`,
      size: `${8 + Math.random() * 10}px`,
    })), [])

  return (
    <div className={styles.screen}>
      {/* Confetti burst */}
      <div className={styles.confetti}>
        {confettiPieces.map(p => (
          <div
            key={p.id}
            className={styles.confettiPiece}
            style={{
              left: p.left,
              top: 0,
              background: p.color,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.headerCard}>
          <div className={styles.heading}>{RESULT_STRINGS.heading}</div>
          <div className={styles.bodyAge}>{state.bodyAge}</div>
          <div className={styles.vs}>{RESULT_STRINGS.vsLabel(state.age)}</div>
          <div className={styles.verdict}>{verdict}</div>
        </div>

        {/* Habits */}
        <div className={styles.whiteCard}>
          <div className={styles.sectionLabel}>{RESULT_STRINGS.habitsLabel}</div>
          <HabitBadge results={habitResults} />
        </div>

        {/* Tips */}
        <div className={styles.whiteCard}>
          <TipsCarousel results={habitResults} />
        </div>

        {/* Share */}
        <ShareCard bodyAge={state.bodyAge} realAge={state.age} />

        {/* Retake */}
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: '2.5px solid #a78bfa',
            borderRadius: 16,
            color: '#6d28d9',
            fontFamily: 'Nunito, sans-serif',
            fontSize: 15,
            fontWeight: 800,
            padding: '13px 0',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          {RESULT_STRINGS.retakeBtn}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/BodyAgeQuiz/components/ResultScreen/
git commit -m "feat: ResultScreen with confetti, badges, tips, share"
```

---

## Task 16: BodyAgeQuiz feature root + wire App.tsx

**Files:**
- Create: `src/features/BodyAgeQuiz/index.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css` (clear default styles)
- Modify: `src/index.css` (reset)

- [ ] **Step 1: Create feature root**

```tsx
// src/features/BodyAgeQuiz/index.tsx
import { useEffect } from 'react'
import { useQuiz } from './hooks/useQuiz'
import { useSound } from './hooks/useSound'
import { WelcomeScreen } from './components/WelcomeScreen'
import { AgeInput } from './components/AgeInput'
import { QuizScreen } from './components/QuizScreen'
import { RevealScreen } from './components/RevealScreen'
import { ResultScreen } from './components/ResultScreen'
import styles from './BodyAgeQuiz.module.css'

export function BodyAgeQuiz() {
  const { state, start, setAge, selectOption, nextQuestion, revealComplete, reset, streakCount } = useQuiz()
  const { play, startBgMusic, toggleMusic, musicOn } = useSound()

  const handleStart = () => {
    startBgMusic()
    start()
  }

  return (
    <div className={styles.root}>
      {state.screen === 'welcome' && (
        <WelcomeScreen
          onStart={handleStart}
          onToggleMusic={toggleMusic}
          musicOn={musicOn}
        />
      )}
      {state.screen === 'age_input' && (
        <AgeInput onSubmit={setAge} />
      )}
      {state.screen === 'quiz' && (
        <QuizScreen
          state={state}
          streakCount={streakCount}
          onSelectOption={selectOption}
          onNext={nextQuestion}
          onClose={reset}
          onPlayPop={() => play('pop')}
          onPlayWhoosh={() => play('whoosh')}
        />
      )}
      {state.screen === 'reveal' && (
        <RevealScreen
          bodyAge={state.bodyAge}
          onComplete={() => revealComplete(state.bodyAge)}
          onPlayCountdown={() => play('countdown')}
          onPlayCelebrate={() => play('celebrate')}
        />
      )}
      {state.screen === 'result' && (
        <ResultScreen state={state} onReset={reset} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Clear App.css**

Replace entire `src/App.css` with:
```css
/* App.css — cleared for BodyAgeQuiz */
```

- [ ] **Step 3: Update index.css**

Replace entire `src/index.css` with:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { min-height: 100dvh; overflow-x: hidden; }
#root { min-height: 100dvh; }
```

- [ ] **Step 4: Update App.tsx**

Replace entire `src/App.tsx` with:
```tsx
import { BodyAgeQuiz } from './features/BodyAgeQuiz'

function App() {
  return <BodyAgeQuiz />
}

export default App
```

- [ ] **Step 5: Run dev server and verify the app loads**

```bash
cd /Users/sanket/body-age-calculator/body-age-calculator && npm run dev
```

Expected: App loads at `http://localhost:5173`, shows WelcomeScreen with purple gradient and peacock mascot. No console errors (audio 404s are expected until real sound files are added).

- [ ] **Step 6: Commit**

```bash
git add src/features/BodyAgeQuiz/index.tsx src/App.tsx src/App.css src/index.css
git commit -m "feat: wire BodyAgeQuiz into App — full flow working"
```

---

## Task 17: Responsive polish + TypeScript check

**Files:**
- Modify: `src/features/BodyAgeQuiz/BodyAgeQuiz.module.css`

- [ ] **Step 1: Run TypeScript check**

```bash
cd /Users/sanket/body-age-calculator/body-age-calculator && npx tsc --noEmit
```

Fix any type errors before continuing.

- [ ] **Step 2: Test at 360px in browser**

Open DevTools → toggle device toolbar → set width to 360px. Verify:
- No horizontal scroll
- All text readable (not clipped)
- All buttons tappable (min 44px height)
- Mascot and card visible without overflow

- [ ] **Step 3: Add 360px safety rule to global CSS**

Add to end of `src/features/BodyAgeQuiz/BodyAgeQuiz.module.css`:
```css
@media (max-width: 375px) {
  .btn3d {
    font-size: 13px;
    padding: 12px;
    letter-spacing: 0.5px;
  }
  .card {
    padding: 14px;
    border-radius: 18px;
  }
}
```

- [ ] **Step 4: Run tests one final time**

```bash
cd /Users/sanket/body-age-calculator/body-age-calculator && npm test
```

Expected: all tests pass

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: responsive polish, TypeScript clean, all tests passing"
```

---

## Task 18: Add real sound files

- [ ] **Step 1: Download royalty-free sounds**

Go to https://pixabay.com/sound-effects/ and download:
- Search **"lofi chill loop"** → save as `public/sounds/bg-music.mp3`
- Search **"pop click ui"** → save as `public/sounds/pop.mp3`
- Search **"whoosh swoosh"** → save as `public/sounds/whoosh.mp3`
- Search **"countdown beep"** → save as `public/sounds/countdown.mp3`
- Search **"success chime sparkle"** → save as `public/sounds/celebrate.mp3`

- [ ] **Step 2: Verify sounds play in browser**

Start dev server, complete a quiz, confirm:
- BG music starts on "Start Quiz"
- Pop sound plays on answer select
- Whoosh plays on Next
- Countdown tone plays during 3-2-1
- Celebration plays on result reveal

- [ ] **Step 3: Commit**

```bash
git add public/sounds/
git commit -m "feat: add royalty-free sound files"
```

---

## Self-Review Checklist

- [x] Welcome screen with music toggle — Task 10
- [x] Age input screen — Task 11
- [x] Quiz (9 questions, progress bar, streak, mascot reactions) — Task 12
- [x] Reveal screen (spinner → countdown → body age) — Task 13
- [x] Result screen (verdict, habit badges, tips, share, retake) — Task 15
- [x] Scoring logic with tests — Task 5
- [x] All strings in constants.ts — Every component has co-located constants
- [x] Background music + SFX — Tasks 7, 16
- [x] 3D button animations — Task 8 (global CSS)
- [x] Confetti on result — Task 15
- [x] Mascot reacts to answers — Task 12
- [x] Slide-in transition between questions — Task 12
- [x] Responsive 360px support — Task 17
- [x] ShareCard with Canvas — Task 14
- [x] TypeScript types throughout — Task 2
