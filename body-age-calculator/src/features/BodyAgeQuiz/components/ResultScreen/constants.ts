export const RESULT_STRINGS = {
  good: {
    header: 'AMAZING!',
    subheader: 'YOUR ASSESSMENT IS READY',
    statusBadge: 'STATUS: GOOD',
    bodyAgeLabel: 'BODY AGE',
    realAgePrefix: 'Real Age: ',
    factorTitle: 'FACTOR ANALYSIS',
    primaryCta: 'CLAIM YOUR FREE GIFT \u2192',
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
