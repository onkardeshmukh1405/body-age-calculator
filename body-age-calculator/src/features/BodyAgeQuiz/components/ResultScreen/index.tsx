import { useMemo, useRef, useEffect } from 'react'
import styles from './ResultScreen.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { getVerdict, getHabitResults } from '../../utils/scoring'
import { HabitBadge } from './HabitBadge'
import { TipsCarousel } from './TipsCarousel'
import { ShareCard } from './ShareCard'
import { RESULT_STRINGS } from './constants'
import type { QuizState } from '../../types'

interface ResultScreenProps {
  state: QuizState
  onReset: () => void
}

const CONFETTI_COLORS = ['#a78bfa', '#fbcfe8', '#fde68a', '#6ee7b7', '#ffffff', '#c4b5fd']

function useConfetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      width: `${6 + Math.random() * 6}px`,
      height: `${10 + Math.random() * 8}px`,
      duration: `${1.5 + Math.random() * 1.5}s`,
      delay: `${Math.random() * 0.6}s`,
    }))
  }, [])
  return pieces
}

export function ResultScreen({ state, onReset }: ResultScreenProps) {
  const verdict = useMemo(() => getVerdict(state.age, state.bodyAge), [state.age, state.bodyAge])
  const habitResults = useMemo(() => getHabitResults(state.answers), [state.answers])
  const confetti = useConfetti()
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className={styles.screen} ref={topRef}>
      <div className={styles.confetti} aria-hidden="true">
        {confetti.map(p => (
          <div
            key={p.id}
            className={styles.confettiPiece}
            style={{
              left: p.left,
              top: '-20px',
              width: p.width,
              height: p.height,
              background: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className={styles.inner}>
        <div className={styles.headerCard}>
          <div className={styles.heading}>{RESULT_STRINGS.heading}</div>
          <div className={styles.bodyAge}>{state.bodyAge}</div>
          <div className={styles.vs}>{RESULT_STRINGS.vsLabel(state.age)}</div>
          <div className={styles.verdict}>{verdict}</div>
        </div>

        <div className={styles.whiteCard}>
          <div className={styles.sectionLabel}>{RESULT_STRINGS.habitsLabel}</div>
          <HabitBadge results={habitResults} />
        </div>

        <TipsCarousel results={habitResults} />

        <ShareCard bodyAge={state.bodyAge} realAge={state.age} />

        <button className={globalStyles.btn3d} onClick={onReset}>
          {RESULT_STRINGS.retakeBtn}
        </button>
      </div>
    </div>
  )
}
