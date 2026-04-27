# Body Age Calculator — Design Spec
**Date:** 2026-04-27
**Status:** Approved
**Audience:** Women 30+

---

## Overview

A game-like, single-page body age quiz app built with Vite + React + TypeScript. Users answer 9 simple, jargon-free lifestyle questions, then get a dramatic reveal of their "body age" vs their real age. The experience is designed to feel like a premium self-care app — fun, encouraging, and shareable.

---

## Theme: Lavender Dusk

| Property | Value |
|---|---|
| Background gradient | Deep plum `#1e0a3c` → violet `#6d28d9` → soft lilac `#a78bfa` → `#f3e8ff` |
| Primary CTA color | `#7c3aed` → `#a78bfa` gradient |
| Button shadow | `#1e0a3c` (3D press effect) |
| Card background | White (`#ffffff`) |
| Body background | `#fdf4ff` (very light lilac) |
| Font | Nunito (700, 800, 900 weights) |
| Mascot | Peacock 🦚 — floats, reacts to answers |
| Progress fill | `#c4b5fd` → `#fbcfe8` gradient |
| Dot pattern overlay | `rgba(255,255,255,0.12)` on all gradient backgrounds |

---

## Screen Flow

```
Welcome → Age Input → Quiz (9 questions) → Loading/Reveal → Result
```

### 1. Welcome Screen
- Full-screen lavender gradient background
- Floating peacock mascot with speech bubble: "Let's find out how young your body really is! 🌙"
- App title: **Body Age Quiz**
- Subtitle: "9 quick questions — no medical stuff, promise!"
- Music toggle button (top right)
- Big CTA button: **Start Quiz →**

### 2. Age Input Screen
- Question: "First, how old are you?"
- Large number input styled as a pill (min: 18, max: 90)
- Mascot encourages: "This stays between us! 🤫"
- CTA: **Let's Go →**

### 3. Quiz Screen (9 questions, one per screen)
**Top bar (always visible):**
- X / close button (left) — tapping resets quiz state and returns to Welcome screen
- Progress bar (fills as questions complete)
- Streak badge 🔥 (increments on each answer)

**Card layout:**
- Question label: "Question N of 9"
- Question text (large, bold)
- 4 answer options — each a 3D-style button with:
  - Emoji icon
  - Short bold label
  - Subtle sub-label for context
  - On select: border turns violet, background tints lilac, box-shadow presses down
- Mascot reacts after selection:
  - Good answer (−2 or −1): mascot smiles, speech bubble says something encouraging
  - Bad answer (+2 or +3): mascot looks sad, speech bubble says something gentle/non-judgmental
- **Next →** button activates after an option is selected
- Sound effect: soft pop on option select, whoosh on Next

### 4. Loading / Reveal Screen
- Mascot bounces excitedly
- Text: "Calculating your body age…"
- Animated progress spinner (2 seconds)
- Then: countdown animation — **3… 2… 1…**
- Music swells during countdown
- Big number pops in with scale animation + confetti burst
- Celebration sound effect

### 5. Result Screen
**Header:**
- "Your Body Age is"
- Large animated number (body age) in gradient text
- "vs your real age of [X]"
- Verdict message:
  - Body age < real age by 5+: "You're aging like fine wine! 🌟"
  - Body age < real age by 1–4: "Your body is younger than you think! 💜"
  - Body age = real age ±0: "Right on track — keep going! 🦚"
  - Body age > real age by 1–4: "A little room to grow — you've got this! 🌱"
  - Body age > real age by 5+: "Time to show your body some love! 💪"

**Habit Breakdown (badges row):**
- Green pill badge for each question answered well: e.g. "😴 Great sleeper", "💧 Well hydrated"
- Red/amber pill badge for each weak area: e.g. "🛋️ Move more", "😤 Stress less"

**Tips Carousel:**
- 2–3 simple tips based on weak areas
- e.g. "Try a 20-min walk 3x a week — your future self will thank you!"
- Swipeable cards

**Actions:**
- **Share my result 🚀** — generates a branded card image (canvas-based) for WhatsApp/Instagram
- **Retake Quiz** — resets state and starts over

---

## Quiz Questions & Scoring

Each question has 4 options scored from −2 to +3. Body Age = Chronological Age + Σ(scores), clamped to [max(18, age−15), age+15].

| # | Question | Option A (−2) | Option B (−1) | Option C (+2) | Option D (+3) |
|---|---|---|---|---|---|
| 1 | How often do you move your body? | ⚡ Every day | 🏋️ Few times/week | 🚶 Occasionally | 🛋️ Rarely |
| 2 | How well do you sleep? | 🌟 8+ hrs, always fresh | 😊 7–8 hrs | 🥱 5–6 hrs | 😩 Under 5 hrs |
| 3 | How's your food mostly? | 🌿 Very clean | 🥗 Mostly healthy | 🍱 Mix of both | 🍔 Mostly junk |
| 4 | Do you smoke? | 🚫 Never | ☁️ Occasionally | 🙈 Trying to quit | 🚬 Yes regularly |
| 5 | How stressed are you usually? | 🧘 Rarely | 😌 Sometimes | 😟 Often | 😤 Always |
| 6 | How much water do you drink? | 🌊 6+ glasses | 💧💧 3–5 glasses | 🥤 1–2 glasses | 💧 Barely any |
| 7 | How's your energy through the day? | ⚡ Always energetic | 😊 Pretty good | 😐 Often low | 😴 Always tired |
| 8 | How often do you drink alcohol? | 🚫 Never | 🎉 Rarely | 🥂 Weekends | 🍷 Every day |
| 9 | How's your mood generally? | 🌈 Almost always great | 😊 Pretty happy | 😐 Up and down | 😞 Often low |

**Scoring rule for habit breakdown:**
- Score ≤ −1 on a question → green badge (strength)
- Score ≥ +2 on a question → red/amber badge (area to improve)

---

## Sound & Music

| Event | Sound |
|---|---|
| Background | Lofi ambient loop (soft piano/synth), auto-plays on Start, loops |
| Answer selected | Soft pop / click SFX |
| Next question | Gentle whoosh SFX |
| Countdown (3-2-1) | Rising suspense tone |
| Result reveal | Celebration sparkle burst SFX |
| Music toggle | On/off button top-right, persists preference |

Audio files: royalty-free, bundled in `public/sounds/`. Use Web Audio API or HTML `<audio>` tags.

---

## Animations

| Element | Animation |
|---|---|
| Mascot | Continuous float (translateY loop, 3s) |
| Mascot reaction | Scale bounce on answer select |
| Answer options | 3D press on hover/select (translateY + box-shadow shrink) |
| Screen transitions | Slide-in from right (new question), fade out (old) |
| Progress bar | Smooth width transition (0.4s ease) |
| Countdown numbers | Scale-in pop (cubic-bezier bounce) |
| Result number | Scale from 0 → 1 with spring easing |
| Confetti | CSS keyframe burst (20 particles, random directions) |
| Badges | Stagger fade-in (50ms delay each) |

---

## Responsiveness

- Minimum width supported: **360px** (iPhone SE)
- Maximum content width: **480px** (centered on desktop)
- Font sizes scale down on < 375px using clamp()
- All tap targets minimum 44px height
- No horizontal scroll at any viewport width
- Tested breakpoints: 360px, 390px, 430px, 768px, 1280px

---

## Feature Structure (follows STRUCTURE.md)

```
src/
├── features/
│   └── BodyAgeQuiz/
│       ├── index.tsx                  # Feature entry point
│       ├── components/
│       │   ├── WelcomeScreen/
│       │   │   ├── index.tsx
│       │   │   └── constants.ts       # Strings: title, subtitle, CTA label, mascot speech
│       │   ├── AgeInput/
│       │   │   ├── index.tsx
│       │   │   └── constants.ts       # Strings: heading, placeholder, CTA label, mascot speech
│       │   ├── QuizScreen/
│       │   │   ├── index.tsx
│       │   │   ├── constants.ts       # Strings: progress label format, next button label
│       │   │   ├── AnswerOption/
│       │   │   │   ├── index.tsx
│       │   │   │   └── constants.ts   # Strings: aria labels, selected state text
│       │   │   └── Mascot/
│       │   │       ├── index.tsx
│       │   │       └── constants.ts   # Strings: all mascot speech bubbles (good/bad per question)
│       │   ├── RevealScreen/
│       │   │   ├── index.tsx
│       │   │   └── constants.ts       # Strings: countdown labels, loading text, reveal heading
│       │   └── ResultScreen/
│       │       ├── index.tsx
│       │       ├── constants.ts       # Strings: verdict messages, share text, retake label
│       │       ├── HabitBadge/
│       │       │   ├── index.tsx
│       │       │   └── constants.ts   # Strings: badge labels per question (green & red variants)
│       │       ├── TipsCarousel/
│       │       │   ├── index.tsx
│       │       │   └── constants.ts   # Strings: all tip messages mapped to each question
│       │       └── ShareCard/
│       │           ├── index.tsx
│       │           └── constants.ts   # Strings: share card headline, caption, hashtags
│       ├── hooks/
│       │   ├── useQuiz.ts             # Quiz state machine
│       │   └── useSound.ts            # Audio playback hook
│       ├── utils/
│       │   └── scoring.ts             # Body age calculation logic
│       ├── types/
│       │   └── index.ts               # Question, Answer, QuizState types
│       └── constants/
│           ├── questions.ts           # All 9 questions + options + scores
│           └── theme.ts               # Lavender Dusk color tokens
├── App.tsx                            # Renders BodyAgeQuiz feature
public/
└── sounds/
    ├── bg-music.mp3
    ├── pop.mp3
    ├── whoosh.mp3
    ├── countdown.mp3
    └── celebrate.mp3
```

**Rule:** Every string rendered in the UI (labels, headings, button text, mascot speech, tips, error messages) must live in the `constants.ts` co-located with that component. No hardcoded strings inside JSX.

---

## State Machine (useQuiz hook)

```
WELCOME → AGE_INPUT → QUIZ(0..8) → REVEAL → RESULT
```

State shape:
```ts
type QuizState = {
  screen: 'welcome' | 'age_input' | 'quiz' | 'reveal' | 'result'
  age: number
  currentQuestion: number          // 0–8
  answers: number[]                // score per question
  bodyAge: number                  // computed on reveal
}
```

---

## Out of Scope (v1)

- User accounts / login
- Backend / API calls
- Leaderboard
- Retake reminder push notifications (can add later via localStorage date check)
- Multiple languages
