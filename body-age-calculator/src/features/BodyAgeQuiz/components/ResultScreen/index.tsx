import { useMemo } from 'react'
import styles from './ResultScreen.module.css'
import { RESULT_STRINGS, getFeedbackMessage } from './constants'
import { getFactorAnalysis } from '../../utils/scoring'
import type { QuizState } from '../../types'

interface ResultScreenProps {
  state: QuizState
  onRegister: () => void
}

export function ResultScreen({ state, onRegister }: ResultScreenProps) {
  const isGood = state.bodyAge <= state.age
  const { good, bad } = useMemo(() => getFactorAnalysis(state.answers), [state.answers])
  const feedbackMsg = getFeedbackMessage(state.bodyAge, state.age)

  if (isGood) {
    return (
      <div className={styles.screen}>
        <div className={styles.goodHeader}>
          <p className={styles.amazingText}>{RESULT_STRINGS.good.header}</p>
          <p className={styles.assessmentReady}>{RESULT_STRINGS.good.subheader}</p>
        </div>
        <div className={styles.circleWrap}>
          <div className={styles.circleGood}>
            <span className={styles.circleAgeGood}>{state.bodyAge}</span>
            <span className={styles.circleLabel}>{RESULT_STRINGS.good.bodyAgeLabel}</span>
          </div>
        </div>
        <p className={styles.realAge}>
          {RESULT_STRINGS.good.realAgePrefix}
          <span className={styles.realAgeGreen}>{state.age}</span>
        </p>
        <span className={styles.statusBadge}>{RESULT_STRINGS.good.statusBadge}</span>
        <div className={styles.feedbackCard}>
          <p className={styles.feedbackText}>{feedbackMsg}</p>
        </div>
        <p className={styles.sectionTitle}>{RESULT_STRINGS.good.factorTitle}</p>
        <div className={styles.factorList}>
          {good.map(f => (
            <div className={styles.factorCard} key={f.label}>
              <div className={styles.factorIconWrap}>{f.icon}</div>
              <div className={styles.factorInfo}>
                <div className={styles.factorLabel}>{f.label}</div>
                <div className={styles.factorSublabel}>{f.sublabel}</div>
              </div>
              <span className={styles.factorBadgeGood}>{f.badge}</span>
            </div>
          ))}
        </div>
        <div className={styles.ctaSection}>
          <button className={styles.btnGreen} onClick={onRegister}>{RESULT_STRINGS.good.primaryCta}</button>
          <button className={styles.btnOutline} onClick={onRegister}>{RESULT_STRINGS.good.secondaryCta}</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <p className={styles.estimatedLabel}>{RESULT_STRINGS.concerning.header}</p>
      <div className={styles.circleWrap}>
        <div className={styles.circleConcerning}>
          <span className={styles.circleAgeConcerning}>{state.bodyAge}</span>
          <span className={styles.circleLabel}>YEARS OLD</span>
          <span className={styles.concerningBadge}>{RESULT_STRINGS.concerning.badge}</span>
        </div>
      </div>
      <p className={styles.realAge} style={{ marginTop: 28 }}>
        {RESULT_STRINGS.concerning.realAgePrefix}
        <span className={styles.realAgeOrange}>{state.age}</span>
      </p>
      <div className={styles.feedbackCard}>
        <p className={styles.feedbackText}>{feedbackMsg}</p>
      </div>
      <p className={styles.sectionTitle}>{RESULT_STRINGS.concerning.factorTitle}</p>
      <div className={styles.factorList}>
        {bad.map(f => (
          <div className={styles.factorCard} key={f.label}>
            <div className={`${styles.factorIconWrap} ${styles.factorIconWrapBad}`}>{f.icon}</div>
            <div className={styles.factorInfo}>
              <div className={styles.factorLabel}>{f.label}</div>
              <div className={styles.factorSublabel}>{f.sublabel}</div>
            </div>
            <span className={styles.factorBadgeBad}>{f.badge}</span>
          </div>
        ))}
      </div>
      <div className={styles.hopeCard}>
        <span className={styles.hopeIcon}>&#x1F4A1;</span>
        <div>
          <p className={styles.hopeTitle}>{RESULT_STRINGS.concerning.hopeTitle}</p>
          <p className={styles.hopeBody}>{RESULT_STRINGS.concerning.hopeBody}</p>
        </div>
      </div>
      <div className={styles.ctaSection}>
        <button className={styles.btnOrange} onClick={onRegister}>{RESULT_STRINGS.concerning.primaryCta}</button>
        <p className={styles.concerningSubfooter}>{RESULT_STRINGS.concerning.footer}</p>
      </div>
    </div>
  )
}
