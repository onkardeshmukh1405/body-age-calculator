export const SHARE_STRINGS = {
  btnLabel: 'Share my result 🚀',
  canvasTitle: 'Body Age Quiz',
  canvasSubtitle: 'My body age is',
  canvasHashtag: '#BodyAgeQuiz',
  shareTitle: 'My Body Age Quiz Result',
  shareText: (bodyAge: number, realAge: number) =>
    `I just found out my body age is ${bodyAge} (real age: ${realAge})! 💜 Try it yourself! #BodyAgeQuiz`,
} as const
