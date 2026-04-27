import { useState } from 'react'
import styles from './AgeInput.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { Mascot } from '../QuizScreen/Mascot'
import { AGE_INPUT_STRINGS, AGE_MIN, AGE_MAX } from './constants'

interface AgeInputProps {
  onSubmit: (age: number) => void
}

export function AgeInput({ onSubmit }: AgeInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const age = Number(value)
    if (age < AGE_MIN) { setError(AGE_INPUT_STRINGS.errorMin); return }
    if (age > AGE_MAX) { setError(AGE_INPUT_STRINGS.errorMax); return }
    setError('')
    onSubmit(age)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <Mascot speech={AGE_INPUT_STRINGS.mascotSpeech} />
        <h2 className={styles.heading}>{AGE_INPUT_STRINGS.heading}</h2>
        <div className={styles.inputWrap}>
          <input
            className={styles.ageInput}
            type="number"
            min={AGE_MIN}
            max={AGE_MAX}
            value={value}
            placeholder={AGE_INPUT_STRINGS.placeholder}
            onChange={e => { setValue(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.ctaWrap}>
          <button
            className={globalStyles.btn3d}
            onClick={handleSubmit}
            disabled={!value}
          >
            {AGE_INPUT_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
