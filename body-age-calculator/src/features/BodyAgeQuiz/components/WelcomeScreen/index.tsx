import styles from './WelcomeScreen.module.css'
import globalStyles from '../../BodyAgeQuiz.module.css'
import { Mascot } from '../QuizScreen/Mascot'
import { WELCOME_STRINGS } from './constants'

interface WelcomeScreenProps {
  onStart: () => void
  onToggleMusic: () => void
  musicOn: boolean
}

export function WelcomeScreen({ onStart, onToggleMusic, musicOn }: WelcomeScreenProps) {
  return (
    <div className={styles.screen}>
      <button className={styles.musicBtn} onClick={onToggleMusic} aria-label="Toggle music">
        {musicOn ? WELCOME_STRINGS.musicOn : WELCOME_STRINGS.musicOff}
      </button>
      <div className={styles.inner}>
        <Mascot speech={WELCOME_STRINGS.mascotSpeech} />
        <h1 className={styles.title}>{WELCOME_STRINGS.title}</h1>
        <p className={styles.subtitle}>{WELCOME_STRINGS.subtitle}</p>
        <div className={styles.ctaWrap}>
          <button className={globalStyles.btn3d} onClick={onStart}>
            {WELCOME_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
