import { useEffect, useRef } from 'react'
import styles from './Mascot.module.css'
import { MASCOT_SPEECHES } from './constants'

interface MascotProps {
  speech: string
  animate?: boolean
}

export function Mascot({ speech, animate = false }: MascotProps) {
  const mascotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!animate || !mascotRef.current) return
    mascotRef.current.classList.remove(styles.bounce)
    void mascotRef.current.offsetWidth
    mascotRef.current.classList.add(styles.bounce)
  }, [animate, speech])

  return (
    <div className={styles.wrap}>
      <span ref={mascotRef} className={styles.mascot}>🦚</span>
      {speech && <div className={styles.bubble}>{speech}</div>}
    </div>
  )
}

export { MASCOT_SPEECHES }
