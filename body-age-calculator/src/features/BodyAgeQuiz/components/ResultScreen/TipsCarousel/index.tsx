import styles from './TipsCarousel.module.css'
import { TIPS_STRINGS } from './constants'
import type { HabitResult } from '../../../utils/scoring'

interface TipsCarouselProps {
  results: HabitResult[]
}

export function TipsCarousel({ results }: TipsCarouselProps) {
  const tips = results.filter(r => r.type === 'red').map(r => r.tip)
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>{TIPS_STRINGS.sectionLabel}</div>
      {tips.length === 0 ? (
        <div className={styles.noTips}>{TIPS_STRINGS.noTips}</div>
      ) : (
        <div className={styles.track}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tip}>{tip}</div>
          ))}
        </div>
      )}
    </div>
  )
}
