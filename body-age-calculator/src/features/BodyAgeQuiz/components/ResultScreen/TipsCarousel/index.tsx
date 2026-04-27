import { TIPS_STRINGS } from './constants'
import type { HabitResult } from '../../../utils/scoring'

interface TipsCarouselProps {
  results: HabitResult[]
}

export function TipsCarousel({ results }: TipsCarouselProps) {
  const tips = results.filter(r => r.type === 'red').map(r => r.tip)
  return (
    <div className="w-full">
      <div className="text-[clamp(10px,2.5vw,11px)] font-black uppercase tracking-[1.5px] text-[#9ca3af] mb-2">
        {TIPS_STRINGS.sectionLabel}
      </div>
      {tips.length === 0 ? (
        <div className="text-[clamp(13px,3.5vw,14px)] font-bold text-[#16a34a] text-center px-3 py-3">
          {TIPS_STRINGS.noTips}
        </div>
      ) : (
        <div
          className="flex gap-[10px] overflow-x-auto pb-1"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {tips.map((tip, i) => (
            <div
              key={i}
              className="flex-[0_0_calc(100%-32px)] rounded-2xl px-4 py-[14px] text-[clamp(13px,3.5vw,14px)] font-bold text-[#4c1d95] leading-[1.5] border-2 border-[#ddd6fe]"
              style={{ scrollSnapAlign: 'start', background: 'linear-gradient(135deg, #f5f3ff, #fdf4ff)' }}
            >{tip}</div>
          ))}
        </div>
      )}
    </div>
  )
}
