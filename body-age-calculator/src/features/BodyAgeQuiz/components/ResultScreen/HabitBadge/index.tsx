import type { HabitResult } from '../../../utils/scoring'

interface HabitBadgeProps {
  results: HabitResult[]
}

export function HabitBadge({ results }: HabitBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {results.map((r, i) => (
        <span
          key={i}
          className={`badge-fade-up inline-flex items-center gap-[5px] px-[14px] py-[6px] rounded-[99px] text-[clamp(11px,3vw,13px)] font-extrabold ${
            r.type === 'green'
              ? 'bg-[#f0fdf4] text-[#16a34a] border-2 border-[#86efac]'
              : 'bg-[#fff1f2] text-[#e11d48] border-2 border-[#fecdd3]'
          }`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {r.badge}
        </span>
      ))}
    </div>
  )
}
