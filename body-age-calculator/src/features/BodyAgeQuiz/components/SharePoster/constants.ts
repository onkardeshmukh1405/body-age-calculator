export const SHARE_STRINGS = {
  heading: 'Your Body Age Report',
  download: 'Download',
  share: 'Share',
  close: 'Close',
  goodBadge: 'OPTIMAL HEALTH',
  concerningBadge: 'NEEDS ATTENTION',
  goodHeadline1: (diff: number) => `My body is ${diff} yrs`,
  goodHeadline2: 'younger inside! 🎉',
  badHeadline1: (diff: number) => `My body is ${diff} yrs`,
  badHeadline2: 'older inside! 💪',
  goodBody: 'Your biological data suggests a high\nmetabolic efficiency and excellent\ncardiovascular health.',
  badBody: "Yoga can help reverse these factors.\nFeel younger in just 14 days with\nHabuild's guided yoga program.",
  cta: '• Discover YOUR Body Age — FREE!',
  bodyAgeResult: 'BODY AGE RESULT',
  yearsOld: 'YEARS OLD',
  url: 'habit.yoga/body-age',
} as const

export const POSTER_ASSETS = {
  logo: '/habuild_logo.png',
  avatarStrip: 'https://habuildassets.s3.ap-south-1.amazonaws.com/habuildassets/hbin-banner-miniusers.webp',
} as const
