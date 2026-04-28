import { useReducer, useCallback } from 'react'
import type { QuizState, QuizAction } from '../types'
import { calculateBodyAge } from '../utils/scoring'
import { QUESTIONS } from '../constants/questions'

const initialState: QuizState = {
  screen: 'welcome',
  age: 0,
  currentQuestion: 0,
  answers: [],
  selectedOption: null,
  bodyAge: 0,
  name: '',
  phone: '',
  dialCode: '',
  isLoggedIn: false,
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

    case 'PREV_QUESTION': {
      if (state.currentQuestion === 0) {
        return { ...state, screen: 'age_input', selectedOption: null }
      }
      const prevIndex = state.currentQuestion - 1
      const prevAnswerScore = state.answers[prevIndex]
      const prevSelectedOption = prevAnswerScore !== undefined
        ? QUESTIONS[prevIndex]?.options.findIndex(o => o.score === prevAnswerScore) ?? null
        : null
      return { ...state, currentQuestion: prevIndex, selectedOption: prevSelectedOption !== null && prevSelectedOption >= 0 ? prevSelectedOption : null }
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
      return { ...state, name: action.name, phone: action.phone, dialCode: action.dialCode, isLoggedIn: true, screen: 'age_input', currentQuestion: 0, answers: [], selectedOption: null }

    case 'ALREADY_REGISTERED':
      return { ...state, name: action.name, phone: action.phone, dialCode: action.dialCode, isLoggedIn: true, screen: 'already_registered' }

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
  const prevQuestion = useCallback(() => dispatch({ type: 'PREV_QUESTION' }), [])
  const revealComplete = useCallback((bodyAge: number) =>
    dispatch({ type: 'REVEAL_COMPLETE', bodyAge }), [])
  const goToRegistration = useCallback(() => dispatch({ type: 'GO_TO_REGISTRATION' }), [])
  const submitRegistration = useCallback((name: string, phone: string, dialCode: string) =>
    dispatch({ type: 'SUBMIT_REGISTRATION', name, phone, dialCode }), [])
  const alreadyRegistered = useCallback((name: string, phone: string, dialCode: string) =>
    dispatch({ type: 'ALREADY_REGISTERED', name, phone, dialCode }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, start, setAge, selectOption, nextQuestion, prevQuestion, revealComplete, goToRegistration, submitRegistration, alreadyRegistered, reset }
}
