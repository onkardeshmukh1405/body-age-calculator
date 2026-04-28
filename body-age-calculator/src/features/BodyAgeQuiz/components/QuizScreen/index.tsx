import { QUIZ_STRINGS, OPTION_LABELS } from './constants'
import { QUESTIONS } from '../../constants/questions'
import type { QuizState } from '../../types'

interface QuizScreenProps {
  state: QuizState
  onSelectOption: (optionIndex: number, score: number) => void
  onNext: () => void
  onBack: () => void
}

const TOTAL_QUESTIONS = QUESTIONS.length

export function QuizScreen({ state, onSelectOption, onNext, onBack }: QuizScreenProps) {
  const question = QUESTIONS[state.currentQuestion]
  const progress = (state.currentQuestion / TOTAL_QUESTIONS) * 100

  return (
    <div className="min-h-[100dvh] bg-[#fcf9f4] flex flex-col font-nunito">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button
          className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[13px] font-bold text-[#afafaf] flex-shrink-0 p-0"
          onClick={onBack}
        >
          <span className="text-[16px] leading-none">←</span>
          <span>{QUIZ_STRINGS.back}</span>
        </button>
        <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-in-out"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1a3558, #3aadaa)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 flex flex-col">
        <div className="text-[60px] text-center mb-3 leading-none">{question.options[0].emoji}</div>

        <h2 className="text-[18px] font-extrabold text-[#1a3558] text-center leading-[1.35] m-0 mb-5">
          {question.text}
        </h2>

        <div className="flex flex-col gap-2.5 flex-1">
          {question.options.map((opt, i) => {
            const isSelected = state.selectedOption === i
            return (
              <button
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer text-left w-full transition-all duration-150"
                style={{
                  background: isSelected ? '#edf8f8' : 'white',
                  border: isSelected ? '2px solid #3aadaa' : '2px solid #e5e5e5',
                  borderBottom: isSelected ? '4px solid #2a8d8a' : '4px solid #e5e5e5',
                }}
                onClick={() => onSelectOption(i, opt.score)}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                  style={{
                    background: isSelected ? '#3aadaa' : '#f0f0f0',
                    color: isSelected ? 'white' : '#afafaf',
                  }}
                >
                  {OPTION_LABELS[i]}
                </span>
                <span
                  className="text-[15px] font-semibold"
                  style={{ color: isSelected ? '#1a3558' : '#4b4b4b' }}
                >
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="pt-4">
          <button
            className="flex items-center justify-center w-full py-4 rounded-full text-white font-nunito text-[15px] font-extrabold tracking-[0.5px] uppercase cursor-pointer transition-transform active:translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', border: 'none', borderBottom: '4px solid #0f2035' }}
            onClick={onNext}
            disabled={state.selectedOption === null}
          >
            {QUIZ_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
