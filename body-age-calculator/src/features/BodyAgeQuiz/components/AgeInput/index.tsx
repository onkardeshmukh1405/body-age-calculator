import { useState, useCallback } from 'react'
import { AGE_INPUT_STRINGS, AGE_MIN, AGE_MAX, AGE_DEFAULT } from './constants'

interface AgeInputProps {
  onSubmit: (age: number) => void
  onClose: () => void
}

export function AgeInput({ onSubmit, onClose }: AgeInputProps) {
  const [age, setAge] = useState(AGE_DEFAULT)

  const decrement = useCallback(() => setAge(a => Math.max(AGE_MIN, a - 1)), [])
  const increment = useCallback(() => setAge(a => Math.min(AGE_MAX, a + 1)), [])

  return (
    <div className="min-h-[100dvh] bg-[#fcf9f4] flex flex-col font-nunito">
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <button className="bg-transparent border-none cursor-pointer text-[20px] text-[#afafaf] p-0 leading-none flex-shrink-0" onClick={onClose} aria-label="Close">&#x2715;</button>
        <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
          <div className="h-full bg-[#ff845e] rounded-full w-[5%]" />
        </div>
      </div>
      <div className="flex-1 px-5 py-8 flex flex-col">
        <h1 className="text-[24px] font-extrabold text-[#4b4b4b] m-0 mb-2">{AGE_INPUT_STRINGS.heading}</h1>
        <p className="text-[14px] text-[#6b7280] leading-[1.5] m-0 mb-12">{AGE_INPUT_STRINGS.subtext}</p>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-5">
            <button
              className="w-14 h-14 rounded-xl bg-[#fff1eb] flex items-center justify-center text-[28px] font-bold text-[#ff845e] cursor-pointer transition-transform select-none active:translate-y-0.5"
              style={{ border: '2px solid #ffd0be', borderBottom: '4px solid #ffb89e' }}
              onClick={decrement}
              aria-label="Decrease age"
            >&#x2212;</button>
            <div
              className="bg-white rounded-[20px] w-[180px] h-[180px] flex flex-col items-center justify-center gap-1"
              style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}
            >
              <span className="text-[72px] font-extrabold text-[#ff845e] leading-none">{age}</span>
              <span className="text-[12px] font-bold text-[#afafaf] uppercase tracking-[1.2px]">{AGE_INPUT_STRINGS.yearsLabel}</span>
            </div>
            <button
              className="w-14 h-14 rounded-xl bg-[#fff1eb] flex items-center justify-center text-[28px] font-bold text-[#ff845e] cursor-pointer transition-transform select-none active:translate-y-0.5"
              style={{ border: '2px solid #ffd0be', borderBottom: '4px solid #ffb89e' }}
              onClick={increment}
              aria-label="Increase age"
            >&#x2B;</button>
          </div>
        </div>
        <div className="pt-8">
          <button
            className="flex items-center justify-center w-full py-[18px] rounded-full text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] uppercase cursor-pointer transition-transform active:translate-y-0.5"
            style={{ background: '#ff845e', border: 'none', borderBottom: '4px solid #e56a47' }}
            onClick={() => onSubmit(age)}
          >
            {AGE_INPUT_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
