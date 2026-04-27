import { useEffect, useState } from 'react'
import styles from './RevealScreen.module.css'
import { Mascot } from '../QuizScreen/Mascot'
import { REVEAL_STRINGS } from './constants'

interface RevealScreenProps {
  bodyAge: number
  onComplete: () => void
  onPlayCountdown: () => void
  onPlayCelebrate: () => void
}

type Phase = 'loading' | 'countdown' | 'done'

export function RevealScreen({ bodyAge, onComplete, onPlayCountdown, onPlayCelebrate }: RevealScreenProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [countdownIdx, setCountdownIdx] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('countdown'); onPlayCountdown() }, 2000)
    return () => clearTimeout(t1)
  }, [onPlayCountdown])

  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdownIdx < REVEAL_STRINGS.countdown.length - 1) {
      const t = setTimeout(() => setCountdownIdx(i => i + 1), 900)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { onPlayCelebrate(); setPhase('done'); setTimeout(onComplete, 800) }, 900)
      return () => clearTimeout(t)
    }
  }, [phase, countdownIdx, onComplete, onPlayCelebrate])

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <Mascot speech={REVEAL_STRINGS.mascotSpeech} animate={phase === 'countdown'} />
        {phase === 'loading' && (
          <>
            <div className={styles.loadingText}>{REVEAL_STRINGS.loading}</div>
            <div className={styles.spinner} />
          </>
        )}
        {phase === 'countdown' && (
          <div key={countdownIdx} className={styles.countdown}>
            {REVEAL_STRINGS.countdown[countdownIdx]}
          </div>
        )}
        {phase === 'done' && (
          <div key="done" className={styles.countdown}>{bodyAge}</div>
        )}
      </div>
    </div>
  )
}
