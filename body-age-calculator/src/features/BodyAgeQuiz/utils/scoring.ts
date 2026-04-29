import { QUESTIONS } from '../constants/questions'

const BASE_PENALTY = 5

export function calculateBodyAge(age: number, answers: number[]): number {
  const total = answers.reduce((sum, score) => sum + score, 0)
  const raw = age + total + BASE_PENALTY
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

export interface Factor {
  icon: string
  label: string
  sublabel: string
  badge: string
  isPositive: boolean
  score: number
  index: number
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
  if (score === -2) return '✓ Great'
  if (score === -1) return '✓ Good'
  if (score === 2)  return '⚠ Needs work'
  return '⚠ Needs attention'
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
      score,
      index: i,
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
      score,
      index: i,
    }))

  return { good: goodFactors, bad: badFactors }
}
