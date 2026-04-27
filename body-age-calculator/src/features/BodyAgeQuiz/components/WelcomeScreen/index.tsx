import styles from './WelcomeScreen.module.css'
import { WELCOME_STRINGS, WELCOME_ASSETS } from './constants'

interface WelcomeScreenProps {
  onStart: () => void
}

const METRIC_ICONS = [WELCOME_ASSETS.metabIcon, WELCOME_ASSETS.bioIcon, WELCOME_ASSETS.flexIcon]

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.illustrations} aria-hidden>
        <img className={styles.illTop} src={WELCOME_ASSETS.bioIcon} alt="" />
        <div className={styles.illBottom}>&#x1F9D8;</div>
      </div>
      <div className={styles.inner}>
        <div className={styles.brandIconWrap}>
          <div className={styles.brandIconBg}>
            <img className={styles.brandIconImg} src={WELCOME_ASSETS.heartbeat} alt="" />
          </div>
          <div className={styles.checkBadge}>
            <img src={WELCOME_ASSETS.checkmark} alt="" />
          </div>
        </div>

        <p className={styles.brandLabel}>{WELCOME_STRINGS.brand}</p>

        <h1 className={styles.headline}>
          {WELCOME_STRINGS.headlinePart1}
          <span className={styles.purple}>{WELCOME_STRINGS.headlinePurple}</span>
          <br />
          {WELCOME_STRINGS.headlinePart2}
          <br />
          <span className={styles.red}>{WELCOME_STRINGS.headlineRed}</span>
        </h1>

        <p className={styles.sub}>
          {WELCOME_STRINGS.sub1}
          <span className={styles.subLight}>{WELCOME_STRINGS.sub2}</span>
        </p>

        <button className={styles.ctaBtn} onClick={onStart}>
          {WELCOME_STRINGS.cta}
          <img className={styles.ctaArrow} src={WELCOME_ASSETS.arrow} alt="" />
        </button>

        <div className={styles.socialCard}>
          <div className={styles.avatarRow}>
            <img className={styles.avatar} src={WELCOME_ASSETS.avatar1} alt="" />
            <img className={styles.avatar} src={WELCOME_ASSETS.avatar2} alt="" />
            <img className={styles.avatar} src={WELCOME_ASSETS.avatar3} alt="" />
            <div className={styles.avatarCount}>{WELCOME_STRINGS.socialCount}</div>
          </div>
          <p className={styles.socialText}>
            Join <span className={styles.socialGreen}>20,00,000+ Indians</span> on Habuild
          </p>
        </div>

        <div className={styles.metricsGrid}>
          {WELCOME_STRINGS.metrics.map((m, i) => (
            <div className={styles.metricCard} key={m.label}>
              <div className={styles.metricIconWrap} style={{ background: m.iconBg }}>
                <img src={METRIC_ICONS[i]} alt="" />
              </div>
              <div>
                <div className={styles.metricLabel}>{m.label}</div>
                <div className={styles.metricSublabel}>{m.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
