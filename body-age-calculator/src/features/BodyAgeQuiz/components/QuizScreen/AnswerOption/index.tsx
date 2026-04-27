import styles from './AnswerOption.module.css'
import type { AnswerOption as AnswerOptionType } from '../../../types'

interface AnswerOptionProps {
  option: AnswerOptionType
  isSelected: boolean
  onSelect: () => void
}

export function AnswerOption({ option, isSelected, onSelect }: AnswerOptionProps) {
  return (
    <button
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <span className={styles.emoji}>{option.emoji}</span>
      <span className={styles.textWrap}>
        <span className={styles.label}>{option.label}</span>
        <span className={styles.sublabel}>{option.sublabel}</span>
      </span>
    </button>
  )
}
