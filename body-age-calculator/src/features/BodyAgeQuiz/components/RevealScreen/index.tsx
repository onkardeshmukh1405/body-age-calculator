import { useEffect, useState } from 'react'
import { REVEAL_STRINGS, REVEAL_DURATION_MS } from './constants'

interface RevealScreenProps {
  bodyAge: number
  onComplete: () => void
}

export function RevealScreen({ bodyAge: _bodyAge, onComplete }: RevealScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / REVEAL_DURATION_MS) * 100)
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(onComplete, 300)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div className="min-h-[100dvh] bg-[#fdfaf5] flex items-center justify-center font-nunito p-8">
      <div className="flex flex-col items-center gap-4 w-full max-w-[360px]">
        <h2 className="text-[24px] font-extrabold text-[#111827] text-center tracking-[-0.6px] m-0">{REVEAL_STRINGS.heading}</h2>
        <p className="text-[14px] font-semibold text-[#6b7280] text-center uppercase tracking-[2.8px] m-0">{REVEAL_STRINGS.subtext}</p>
        <div className="mt-8 w-[280px] flex flex-col items-center gap-3">
          <div className="w-full h-[6px] bg-[#e5e7eb] rounded-full overflow-hidden">
            <div className="h-full bg-[#582c8b] rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[12px] font-bold text-[rgba(88,44,139,0.6)] uppercase tracking-[1.2px] text-center">{REVEAL_STRINGS.processing}</span>
        </div>
      </div>
    </div>
  )
}
