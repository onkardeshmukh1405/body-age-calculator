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
