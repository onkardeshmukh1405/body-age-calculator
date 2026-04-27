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
