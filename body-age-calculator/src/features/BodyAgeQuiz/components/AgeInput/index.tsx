import { useState, useCallback } from 'react'
import styles from './AgeInput.module.css'
import { AGE_INPUT_STRINGS, AGE_MIN, AGE_MAX, AGE_DEFAULT } from './constants'

interface AgeInputProps {
  onSubmit: (age: number) => void
  onClose: () => void
}

export function AgeInput({ onSubmit, onClose }: AgeInputProps) {
  const [age, setAge] = useState(AGE_DEFAULT)

  const decrement = useCallback(() => setAge(a => Math.max(AGE_MIN, a - 1)), [])
  const increment = useCallback(() => setAge(a => Math.min(AGE_MAX, a + 1)), [])

  return (
    <div className={styles.screen}>
      <div className={styles.progressWrap}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&#x2715;</button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} />
        </div>
      </div>
      <div className={styles.inner}>
        <h1 className={styles.heading}>{AGE_INPUT_STRINGS.heading}</h1>
        <p className={styles.subtext}>{AGE_INPUT_STRINGS.subtext}</p>
        <div className={styles.stepperArea}>
          <div className={styles.stepperRow}>
            <button className={styles.stepBtn} onClick={decrement} aria-label="Decrease age">&#x2212;</button>
            <div className={styles.ageCard}>
              <span className={styles.ageNumber}>{age}</span>
              <span className={styles.yearsLabel}>{AGE_INPUT_STRINGS.yearsLabel}</span>
            </div>
            <button className={styles.stepBtn} onClick={increment} aria-label="Increase age">&#x2B;</button>
          </div>
        </div>
        <div className={styles.ctaWrap}>
          <button className={styles.ctaBtn} onClick={() => onSubmit(age)}>
            {AGE_INPUT_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
