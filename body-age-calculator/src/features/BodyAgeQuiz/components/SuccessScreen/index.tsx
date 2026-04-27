import styles from './SuccessScreen.module.css'
import { SUCCESS_STRINGS } from './constants'

interface SuccessScreenProps {
  name: string
  onReset: () => void
}

export function SuccessScreen({ name, onReset }: SuccessScreenProps) {
  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(SUCCESS_STRINGS.shareMsg)}`
    window.open(url, '_blank')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.celebrationWrap}>
        <div className={styles.celebrationCircle}>
          <span className={styles.popperEmoji}>🎉</span>
        </div>
        <span className={styles.checkBadge}>✅</span>
      </div>
      <h1 className={styles.heading}>
        {SUCCESS_STRINGS.headingPrefix}{name}{SUCCESS_STRINGS.headingSuffix}
      </h1>
      <p className={styles.subtext}>{SUCCESS_STRINGS.subtext}</p>
      <div className={styles.ctaGroup}>
        <button className={styles.btnShare} onClick={handleShare}>
          📤 {SUCCESS_STRINGS.shareBtn}
        </button>
        <button className={styles.btnDashboard} onClick={onReset}>
          ⊞ {SUCCESS_STRINGS.dashboardBtn}
        </button>
      </div>
      <div className={styles.decorRow}>🏆 ⭐ 🥇</div>
    </div>
  )
}
