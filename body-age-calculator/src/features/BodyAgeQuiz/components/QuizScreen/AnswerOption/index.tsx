import type { AnswerOption as AnswerOptionType } from '../../../types'

interface AnswerOptionProps {
  option: AnswerOptionType
  isSelected: boolean
  onSelect: () => void
}

export function AnswerOption({ option, isSelected, onSelect }: AnswerOptionProps) {
  return (
    <button
      className="flex items-center gap-[clamp(10px,3vw,14px)] bg-white rounded-2xl px-[clamp(12px,3.5vw,16px)] py-[clamp(10px,3vw,14px)] cursor-pointer text-left w-full font-nunito transition-all duration-150"
      style={{
        border: isSelected ? '2.5px solid #7c3aed' : '2.5px solid rgba(255,255,255,0.9)',
        boxShadow: isSelected ? '0 4px 0 #7c3aed' : '0 4px 0 rgba(167,139,250,0.25)',
        transform: isSelected ? 'translateY(-2px)' : undefined,
      }}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <span className="text-[clamp(22px,6vw,28px)] leading-none flex-shrink-0">{option.emoji}</span>
      <span className="flex flex-col gap-0.5">
        <span className={`text-[clamp(13px,3.5vw,15px)] font-extrabold leading-[1.2] ${isSelected ? 'text-[#7c3aed]' : 'text-[#1e293b]'}`}>{option.label}</span>
        <span className={`text-[clamp(11px,2.8vw,12px)] font-bold ${isSelected ? 'text-[#a78bfa]' : 'text-[#9ca3af]'}`}>{option.sublabel}</span>
      </span>
    </button>
  )
}
