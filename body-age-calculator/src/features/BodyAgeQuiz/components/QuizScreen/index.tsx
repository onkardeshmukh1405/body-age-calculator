import styles from './QuizScreen.module.css'
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
    <div className={styles.screen}>
      <div className={styles.progressWrap}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&times;</button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={styles.inner}>
        <div className={styles.heroEmoji}>{question.options[0].emoji}</div>
        <h2 className={styles.question}>{question.text}</h2>
        <div className={styles.options}>
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.optionCard}${state.selectedOption === i ? ` ${styles.selected}` : ''}`}
              onClick={() => onSelectOption(i, opt.score)}
            >
              <span className={styles.badge}>{OPTION_LABELS[i]}</span>
              <span className={styles.optionLabel}>{opt.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.ctaWrap}>
          <button
            className={styles.ctaBtn}
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
