import { useEffect, useRef } from 'react'
import { MASCOT_SPEECHES } from './constants'

interface MascotProps {
  speech: string
  animate?: boolean
}

export function Mascot({ speech, animate = false }: MascotProps) {
  const mascotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!animate || !mascotRef.current) return
    mascotRef.current.classList.remove('mascot-bounce')
    void mascotRef.current.offsetWidth
    mascotRef.current.classList.add('mascot-bounce')
  }, [animate, speech])

  return (
    <div className="relative flex items-end gap-[10px] mb-2">
      <span
        ref={mascotRef}
        className="mascot-float text-[clamp(52px,14vw,72px)] leading-none select-none"
        style={{ filter: 'drop-shadow(0 6px 12px rgba(109,40,217,0.4))' }}
      >🦚</span>
      {speech && (
        <div className="bg-white/95 rounded-2xl px-[clamp(10px,3vw,14px)] py-[clamp(6px,2vw,8px)] text-[clamp(11px,3vw,13px)] font-extrabold text-[#374151] leading-[1.4] max-w-[180px]"
          style={{ boxShadow: '0 3px 12px rgba(0,0,0,0.1)' }}
        >{speech}</div>
      )}
    </div>
  )
}

export { MASCOT_SPEECHES }
