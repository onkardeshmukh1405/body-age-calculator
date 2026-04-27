import { useState, useEffect } from 'react'
import styles from './QuizScreen.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { Mascot, MASCOT_SPEECHES } from './Mascot'
import { AnswerOption } from './AnswerOption'
import { QUIZ_SCREEN_STRINGS } from './constants'
import { QUESTIONS } from '../../constants/questions'
import type { QuizState } from '../../types'

interface QuizScreenProps {
  state: QuizState
  streakCount: number
  onSelectOption: (optionIndex: number, score: number) => void
  onNext: () => void
  onClose: () => void
  onPlayPop: () => void
  onPlayWhoosh: () => void
}

export function QuizScreen({
  state, streakCount, onSelectOption, onNext, onClose, onPlayPop, onPlayWhoosh,
}: QuizScreenProps) {
  const [animKey, setAnimKey] = useState(0)
  const [mascotSpeech, setMascotSpeech] = useState('')
  const [mascotAnimate, setMascotAnimate] = useState(false)

  const question = QUESTIONS[state.currentQuestion]
  const progress = (state.currentQuestion / QUIZ_SCREEN_STRINGS.totalQuestions) * 100

  useEffect(() => {
    setAnimKey(k => k + 1)
    setMascotSpeech('')
  }, [state.currentQuestion])

  const handleSelect = (idx: number, score: number) => {
    onSelectOption(idx, score)
    onPlayPop()
    const speeches = score <= -1 ? MASCOT_SPEECHES.good : MASCOT_SPEECHES.bad
    setMascotSpeech(speeches[Math.floor(Math.random() * speeches.length)])
    setMascotAnimate(true)
    setTimeout(() => setMascotAnimate(false), 500)
  }

  const handleNext = () => {
    onPlayWhoosh()
    onNext()
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.topbar}>
          <button className={styles.closeBtn} onClick={onClose} aria-label={QUIZ_SCREEN_STRINGS.closeAriaLabel}>✕</button>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.streakBadge}>🔥 {streakCount}</div>
        </div>

        <Mascot speech={mascotSpeech} animate={mascotAnimate} />

        <div key={animKey} className={`${styles.card} ${styles.slideIn}`}>
          <div className={styles.questionLabel}>
            {QUIZ_SCREEN_STRINGS.questionLabel(state.currentQuestion + 1, QUIZ_SCREEN_STRINGS.totalQuestions)}
          </div>
          <div className={styles.questionText}>{question.text}</div>
          <div className={styles.options}>
            {question.options.map((opt, idx) => (
              <AnswerOption
                key={idx}
                option={opt}
                isSelected={state.selectedOption === idx}
                onSelect={() => handleSelect(idx, opt.score)}
              />
            ))}
          </div>
        </div>

        <div className={styles.nextWrap}>
          <button
            className={globalStyles.btn3d}
            onClick={handleNext}
            disabled={state.selectedOption === null}
          >
            {QUIZ_SCREEN_STRINGS.nextBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
