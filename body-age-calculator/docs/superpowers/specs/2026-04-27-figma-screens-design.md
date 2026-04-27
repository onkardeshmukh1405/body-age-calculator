# Figma Screens Implementation Design
**Date:** 2026-04-27
**Approach:** Option A — In-place replacement of all existing screens with new Figma designs

---

## Overview

Replace all 5 existing screens with new Figma designs and add 2 new screens (Registration, Success). The full user flow becomes:

```
welcome -> age_input -> quiz -> reveal -> result -> registration -> success
```

---

## Design System Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#5300b7` | Brand purple, progress fill |
| `--color-accent-red` | `#ff4b4b` | Concerning badge, warning text |
| `--color-accent-green` | `#58cc02` | Good badge, success, green buttons |
| `--color-accent-orange` | `#ff9600` | Concerning ring, orange text |
| `--color-cta` | `#ff845e` | Landing CTA button |
| `--color-cta-border` | `#e56a47` | Landing CTA button bottom border |
| `--color-blue` | `#1cb0f6` | Age stepper, quiz selection |
| `--color-bg` | `#fcf9f4` | Screen background (warm cream) |
| `--color-text` | `#4b4b4b` | Primary text |
| `--color-text-muted` | `#6b7280` | Secondary text |
| `--color-text-light` | `#afafaf` | Hint/disabled text |
| `--color-border` | `#e5e5e5` | Card borders |
| Font | Nunito (Google Fonts) | All text |

Card pattern: white bg, `border: 2px solid var(--color-border)`, `border-bottom: 4px solid`, `border-radius: 16-20px`
Button pattern: pill shape (`border-radius: 999px`), bottom border for 3D effect

---

## State Changes

### types/index.ts
- `Screen`: add `'registration'` and `'success'`
- `QuizState`: add `name: string` and `phone: string`
- `QuizAction`: add `{ type: 'SUBMIT_REGISTRATION'; name: string; phone: string }`

### hooks/useQuiz.ts
- Handle `SUBMIT_REGISTRATION`: set name + phone, transition to `'success'`
- Expose `submitRegistration(name: string, phone: string)` from hook
- `result` primary CTA navigates to `registration` (not reset)

### BodyAgeQuiz/index.tsx
- Wire `RegistrationScreen` and `SuccessScreen` into the screen switcher
- Pass `submitRegistration` to RegistrationScreen, `reset` to SuccessScreen

---

## Screen Specifications

### 1. WelcomeScreen
- Background: `#fcf9f4`
- Floating illustrations layer (opacity 10%): decorative icons top-left and bottom-right
- Brand icon: 96x96 purple rounded square, heartbeat icon inside; green checkmark badge top-right
- Brand label: "HABUILD WELLNESS" — 14px, `#5300b7`, uppercase, letter-spacing 0.7px
- Hero headline (36px): "Your age is just a number. Your body's age is the truth." with purple/red highlights
- Subheadline (20px, muted): "Find out how old your body REALLY is. Takes only 60 seconds!"
- CTA: orange pill (`#ff845e`, bottom-border `#e56a47 4px`), "CHECK MY BODY AGE - FREE", full width
- Social proof card: white 80% + blur 2px, 3 avatars + "+2M" badge, "Join 20,00,000+ Indians on Habuild"
- Metrics grid: 3 cards (Metabolic Rate / Biological Age / Flexibility Index) with coloured icon backgrounds
- Remove music toggle

### 2. AgeInput
- Background: `#fcf9f4`
- Progress bar: X close button + thin green track bar
- Header: "First, tell us your real age." + subtext
- Age stepper: white card centre; blue (-) button left, large age (72px blue), "YEARS OLD" label, blue (+) button right
- Range: 10-100; default 25
- CTA: green pill (`#58cc02`, bottom-border `#46a302 4px`), "CONTINUE", full width
- Remove text input and Mascot

### 3. QuizScreen
- Background: `#fcf9f4`
- Progress bar: X close button + green fill bar (currentQ / totalQ)
- Hero: large question emoji (~80px), question text (20px, centred)
- 4 option cards, full width:
  - Numbered badge (1/2/3/4) in grey circle; selected = blue filled circle
  - Option label text (16px)
  - Selected card: blue border `#1cb0f6`, light blue bg `#e8f4ff`
- CTA: green pill "CONTINUE", enabled only after selection
- Remove Mascot, streak counter

### 4. RevealScreen
- Background: `#fdfaf5`, fully centred layout
- Heading: "Calculating your body age..." (24px, `#111827`)
- Subtext: "ANALYZING YOUR LIFESTYLE DATA" (14px uppercase, spaced)
- Progress bar: 6px track (`#e5e7eb`), purple fill (`#582c8b`), 280px wide
  - Animates 0->100% over 3 seconds, then calls onComplete
- Label: "PROCESSING" (12px uppercase, purple-muted, centred below bar)
- Remove countdown, mascot, old spinner

### 5. ResultScreen (two variants)

Condition: `bodyAge <= realAge` -> Good (green); `bodyAge > realAge` -> Concerning (orange)

#### Good Variant
- "AMAZING!" (24px, `#58cc02`) + "YOUR ASSESSMENT IS READY"
- Circular display: green ring (`#58cc02`, 10px border), body age (72px green), "BODY AGE"
- "Real Age: [N]" with age in green; "STATUS: GOOD" green pill badge
- Feedback card: computed message, e.g. "Your body is just X year(s) younger than you!"
- Factor Analysis: 3 best-scoring factors from quiz answers, each with icon + name + OPTIMAL/GOOD/GREAT badge
- Primary CTA: green "STAY HEALTHY" -> goes to registration
- Secondary CTA: white outline "SHARE REPORT" -> goes to registration

#### Concerning Variant
- "ESTIMATED BODY AGE" label (muted uppercase)
- Circular display: orange ring (`#ff9600`, 10px border), body age (72px orange), "YEARS OLD"
- "CONCERNING" red badge below circle; "Real Age: [N]" with age in orange
- Feedback card: "Your body is X years older than you! Your lifestyle may be accelerating aging."
- Factor Analysis: 3 worst-scoring factors, each with `+X YRS` in red
- Hope Message card (orange bg `#fff4e5`): "There is Hope! Yoga can help reverse these factors."
- Primary CTA: orange "START REVERSING IT - FREE" -> goes to registration
- Footer: "Join 12,000+ others transforming their health today!"

Factor icons and year-impact values are derived from quiz answers (map each question to a body system).

### 6. RegistrationScreen (NEW)
**Path:** `components/RegistrationScreen/index.tsx`

- Background: white
- Result summary card: purple icon, "YOUR BODY AGE" label, body age + "years"
- Heading: "You're one step away!" (28px bold)
- Subtext: "Enter your details to lock in your free metabolic health plan."
- NAME label + text input, placeholder "Enter your name"
- WHATSAPP NUMBER label + input: India flag + "+91" prefix, placeholder "98765 43210"
- CTA: red/salmon pill "RESERVE MY SPOT", full width
- Privacy note: lock icon + "YOUR DATA IS SAFE WITH US" (12px muted, centred)
- Validation: name non-empty, phone exactly 10 digits
- On valid submit: calls `submitRegistration(name, phone)`

### 7. SuccessScreen (NEW)
**Path:** `components/SuccessScreen/index.tsx`

- Background: white
- Celebration icon: 160x160 circle (light grey bg), party popper emoji (96px), green checkmark badge
- Heading: "You're in, [name]!" (32px, `#5300b7`)
- Subtext: "Your health journey just took its first exciting step forward." (18px, muted, centred)
- Green pill button: share icon + "SHARE RESULT" -> opens WhatsApp share link
- Purple pill button: grid icon + "GO TO DASHBOARD" -> calls onReset (back to welcome)
- Trophy/star/medal emojis row at bottom (decorative)
- No batch slots section

---

## New Files to Create

```
components/RegistrationScreen/
  index.tsx
  RegistrationScreen.module.css
  constants.ts

components/SuccessScreen/
  index.tsx
  SuccessScreen.module.css
  constants.ts
```

---

## Assets

Figma MCP asset URLs (7-day expiry) to download into `public/assets/`:
- Social proof avatars x3 (Landing)
- Brand icon + heartbeat icon + checkmark icon (Landing)
- Metric grid icons x3 (Landing)
- Factor analysis icons x3 (Result:Concerning — sitting, sleep, stress)

Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

---

## Out of Scope

- No API calls for registration (local state only)
- No batch slot section on Success screen
- No city field on Registration screen
- Music toggle removed
