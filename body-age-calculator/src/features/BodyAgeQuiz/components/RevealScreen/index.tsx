import { useEffect, useState } from 'react'
import styles from './RevealScreen.module.css'
import { REVEAL_STRINGS, REVEAL_DURATION_MS } from './constants'

interface RevealScreenProps {
  bodyAge: number
  onComplete: () => void
}

export function RevealScreen({ bodyAge: _bodyAge, onComplete }: RevealScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / REVEAL_DURATION_MS) * 100)
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(onComplete, 300)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{REVEAL_STRINGS.heading}</h2>
        <p className={styles.subtext}>{REVEAL_STRINGS.subtext}</p>
        <div className={styles.barWrap}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.processingLabel}>{REVEAL_STRINGS.processing}</span>
        </div>
      </div>
    </div>
  )
}
