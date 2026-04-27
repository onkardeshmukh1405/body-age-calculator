import styles from './HabitBadge.module.css'
import type { HabitResult } from '../../../utils/scoring'

interface HabitBadgeProps {
  results: HabitResult[]
}

export function HabitBadge({ results }: HabitBadgeProps) {
  return (
    <div className={styles.wrap}>
      {results.map((r, i) => (
        <span
          key={i}
          className={`${styles.badge} ${r.type === 'green' ? styles.green : styles.red}`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {r.badge}
        </span>
      ))}
    </div>
  )
}
