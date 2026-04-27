import { QUIZ_STRINGS, OPTION_LABELS } from './constants'
import { QUESTIONS } from '../../constants/questions'
import type { QuizState } from '../../types'

interface QuizScreenProps {
  state: QuizState
  onSelectOption: (optionIndex: number, score: number) => void
  onNext: () => void
  onClose: () => void
}

const TOTAL_QUESTIONS = QUESTIONS.length

export function QuizScreen({ state, onSelectOption, onNext, onClose }: QuizScreenProps) {
  const question = QUESTIONS[state.currentQuestion]
  const progress = (state.currentQuestion / TOTAL_QUESTIONS) * 100

  return (
    <div className="min-h-[100dvh] bg-[#fcf9f4] flex flex-col font-nunito">
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <button
          className="bg-transparent border-none cursor-pointer text-[20px] text-[#afafaf] p-0 leading-none flex-shrink-0"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#58cc02] rounded-full transition-[width] duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex-1 px-5 py-8 flex flex-col">
        <div className="text-[80px] text-center mb-5 leading-none">{question.options[0].emoji}</div>
        <h2 className="text-[22px] font-extrabold text-[#4b4b4b] text-center leading-[1.35] m-0 mb-8">
          {question.text}
        </h2>
        <div className="flex flex-col gap-3 flex-1">
          {question.options.map((opt, i) => {
            const isSelected = state.selectedOption === i
            const cardClass = isSelected
              ? 'flex items-center gap-4 px-5 py-4 bg-[#e8f4ff] rounded-2xl cursor-pointer text-left w-full transition-all duration-150'
              : 'flex items-center gap-4 px-5 py-4 bg-white rounded-2xl cursor-pointer text-left w-full transition-all duration-150'
            const cardStyle = isSelected
              ? { border: '2px solid #1cb0f6', borderBottom: '4px solid #1cb0f6' }
              : { border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }
            const badgeClass = isSelected
              ? 'w-9 h-9 rounded-full bg-[#1cb0f6] flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0'
              : 'w-9 h-9 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[14px] font-bold text-[#afafaf] flex-shrink-0'
            const labelClass = isSelected
              ? 'text-[16px] font-semibold text-[#1cb0f6]'
              : 'text-[16px] font-semibold text-[#4b4b4b]'

            return (
              <button
                key={i}
                className={cardClass}
                style={cardStyle}
                onClick={() => onSelectOption(i, opt.score)}
              >
                <span className={badgeClass}>{OPTION_LABELS[i]}</span>
                <span className={labelClass}>{opt.label}</span>
              </button>
            )
          })}
        </div>
        <div className="pt-6">
          <button
            className="flex items-center justify-center w-full py-[18px] rounded-full text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] uppercase cursor-pointer transition-transform active:translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{ background: '#58cc02', border: 'none', borderBottom: '4px solid #46a302' }}
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
