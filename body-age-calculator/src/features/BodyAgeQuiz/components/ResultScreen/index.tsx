import { useMemo, useRef, useEffect, useState } from 'react'
import { RESULT_STRINGS, getFeedbackMessage } from './constants'
import { getFactorAnalysis } from '../../utils/scoring'
import { SharePoster } from '../SharePoster'
import type { QuizState } from '../../types'

interface ResultScreenProps {
  state: QuizState
  onRegister: () => void
}

const SHAKE_KEYFRAMES: Keyframe[] = [
  { transform: 'translateX(0px)',  offset: 0 },
  { transform: 'translateX(-5px)', offset: 0.05 },
  { transform: 'translateX(5px)',  offset: 0.12 },
  { transform: 'translateX(-5px)', offset: 0.19 },
  { transform: 'translateX(5px)',  offset: 0.24 },
  { transform: 'translateX(0px)',  offset: 0.29 },
  { transform: 'translateX(0px)',  offset: 1 },
]

function useShake(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const anim = el.animate(SHAKE_KEYFRAMES, { duration: 2100, iterations: Infinity, easing: 'linear' })
    return () => anim.cancel()
  }, [ref])
}

export function ResultScreen({ state, onRegister }: ResultScreenProps) {
  const isGood = state.bodyAge <= state.age
  const { good, bad } = useMemo(() => getFactorAnalysis(state.answers), [state.answers])
  const feedbackMsg = getFeedbackMessage(state.bodyAge, state.age)

  const primaryGoodRef = useRef<HTMLButtonElement>(null)
  const primaryConcerningRef = useRef<HTMLButtonElement>(null)
  const [showPoster, setShowPoster] = useState(false)

  useShake(primaryGoodRef)
  useShake(primaryConcerningRef)

  const CTA_STYLE = {
    background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)',
    border: 'none',
    borderBottom: '4px solid #0f2035',
  }

  if (isGood) {
    return (
      <>
      {showPoster && <SharePoster state={state} onClose={() => setShowPoster(false)} />}
      <div className="h-[100dvh] bg-[#fcf9f4] flex flex-col font-nunito">
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
          <div className="text-center mb-3">
            <p className="text-[20px] font-extrabold text-[#3aadaa] m-0 mb-0.5">{RESULT_STRINGS.good.header}</p>
            <p className="text-[11px] font-bold text-[#afafaf] uppercase tracking-[1.4px] m-0">{RESULT_STRINGS.good.subheader}</p>
          </div>
          <div className="flex justify-center mb-2">
            <div className="w-[130px] h-[130px] rounded-full border-[7px] border-[#3aadaa] flex flex-col items-center justify-center bg-white">
              <span className="text-[50px] font-extrabold text-[#3aadaa] leading-none">{state.bodyAge}</span>
              <span className="text-[10px] font-bold text-[#afafaf] uppercase tracking-[1.2px]">{RESULT_STRINGS.good.bodyAgeLabel}</span>
            </div>
          </div>
          <p className="text-center text-[14px] text-[#4b4b4b] mb-2">
            {RESULT_STRINGS.good.realAgePrefix}
            <span className="text-[#3aadaa] font-bold">{state.age}</span>
          </p>
          <span className="block mx-auto mb-3 px-4 py-1.5 bg-[#3aadaa] rounded-full text-white text-[12px] font-extrabold uppercase tracking-[0.5px] w-fit">{RESULT_STRINGS.good.statusBadge}</span>
          <div className="bg-white rounded-2xl px-4 py-3 mb-3" style={{ border: '1.5px solid #e5e5e5' }}>
            <p className="text-[13px] text-[#4b4b4b] text-center leading-[1.5] m-0">{feedbackMsg}</p>
          </div>
          <p className="text-[14px] font-extrabold text-[#1a3558] mb-2">{RESULT_STRINGS.good.factorTitle}</p>
          <div className="flex flex-col gap-2 mb-3">
            {good.map(f => (
              <div className="bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3" style={{ border: '1.5px solid #e5e5e5' }} key={f.label}>
                <div className="w-9 h-9 rounded-xl bg-[#edf8f8] flex items-center justify-center text-[18px] flex-shrink-0">{f.icon}</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[#4b4b4b]">{f.label}</div>
                  <div className="text-[12px] text-[#afafaf]">{f.sublabel}</div>
                </div>
                <span className="text-[11px] font-extrabold text-[#3aadaa] bg-[#edf8f8] px-2 py-1 rounded-lg whitespace-nowrap">{f.badge}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-3 bg-[#fcf9f4] flex flex-col gap-2" style={{ borderTop: '1px solid #e5e5e5' }}>
          <button ref={primaryGoodRef} onClick={onRegister} className="flex items-center justify-center w-full py-4 rounded-full text-white font-nunito text-[15px] font-extrabold tracking-[0.5px] transition-transform active:translate-y-0.5 cursor-pointer border-none" style={CTA_STYLE}>{RESULT_STRINGS.good.primaryCta}</button>
          <button onClick={() => setShowPoster(true)} className="flex items-center justify-center w-full py-3 rounded-full font-nunito text-[14px] font-extrabold transition-transform active:translate-y-0.5 cursor-pointer" style={{ background: 'transparent', border: '1.5px solid #3aadaa', color: '#3aadaa' }}>{RESULT_STRINGS.good.secondaryCta}</button>
        </div>
      </div>
      </>
    )
  }

  return (
    <div className="h-[100dvh] bg-[#fcf9f4] flex flex-col font-nunito">
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        <p className="text-[11px] font-bold text-[#afafaf] uppercase tracking-[1.4px] text-center mb-2">{RESULT_STRINGS.concerning.header}</p>
        <div className="flex justify-center mb-2">
          <div className="w-[130px] h-[130px] rounded-full border-[7px] border-[#ff4b4b] flex flex-col items-center justify-center bg-white relative">
            <span className="text-[50px] font-extrabold text-[#ff4b4b] leading-none">{state.bodyAge}</span>
            <span className="text-[10px] font-bold text-[#afafaf] uppercase tracking-[1.2px]">YEARS OLD</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#ff4b4b] rounded-xl px-3 text-white text-[11px] font-extrabold uppercase tracking-[0.5px] whitespace-nowrap" style={{ paddingBottom: '6px', paddingTop: '4px', borderBottom: '3px solid #d33131' }}>{RESULT_STRINGS.concerning.badge}</span>
          </div>
        </div>
        <p className="text-center text-[14px] text-[#4b4b4b] mb-3" style={{ marginTop: 20 }}>
          {RESULT_STRINGS.concerning.realAgePrefix}
          <span className="text-[#ff4b4b] font-bold">{state.age}</span>
        </p>
        <div className="bg-white rounded-2xl px-4 py-3 mb-3" style={{ border: '1.5px solid #e5e5e5' }}>
          <p className="text-[13px] text-[#4b4b4b] text-center leading-[1.5] m-0">{feedbackMsg}</p>
        </div>
        <p className="text-[14px] font-extrabold text-[#1a3558] mb-2">{RESULT_STRINGS.concerning.factorTitle}</p>
        <div className="flex flex-col gap-2 mb-3">
          {bad.map(f => (
            <div className="bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3" style={{ border: '1.5px solid #e5e5e5' }} key={f.label}>
              <div className="w-9 h-9 rounded-xl bg-[#fff0f0] flex items-center justify-center text-[18px] flex-shrink-0">{f.icon}</div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#4b4b4b]">{f.label}</div>
                <div className="text-[12px] text-[#afafaf]">{f.sublabel}</div>
              </div>
              <span className="text-[11px] font-extrabold text-[#ff4b4b] whitespace-nowrap">{f.badge}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#fff0f0] rounded-2xl px-4 py-3 mb-3 flex gap-2 items-start" style={{ border: '1.5px solid #ff4b4b' }}>
          <span className="text-[18px] flex-shrink-0">💡</span>
          <div>
            <p className="text-[13px] font-extrabold text-[#ff4b4b] m-0 mb-1">{RESULT_STRINGS.concerning.hopeTitle}</p>
            <p className="text-[12px] text-[#4b4b4b] leading-[1.5] m-0">{RESULT_STRINGS.concerning.hopeBody}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-[#fcf9f4]" style={{ borderTop: '1px solid #e5e5e5' }}>
        <button ref={primaryConcerningRef} onClick={onRegister} className="flex items-center justify-center w-full py-4 rounded-full text-white font-nunito text-[15px] font-extrabold tracking-[0.5px] uppercase transition-transform active:translate-y-0.5 cursor-pointer border-none" style={CTA_STYLE}>{RESULT_STRINGS.concerning.primaryCta}</button>
        <p className="text-center text-[12px] text-[#afafaf] mt-2 mb-0">{RESULT_STRINGS.concerning.footer}</p>
      </div>
    </div>
  )
}
