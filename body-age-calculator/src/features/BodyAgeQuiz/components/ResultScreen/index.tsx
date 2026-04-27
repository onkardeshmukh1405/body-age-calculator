import { useMemo } from 'react'
import { RESULT_STRINGS, getFeedbackMessage } from './constants'
import { getFactorAnalysis } from '../../utils/scoring'
import type { QuizState } from '../../types'

interface ResultScreenProps {
  state: QuizState
  onRegister: () => void
}

export function ResultScreen({ state, onRegister }: ResultScreenProps) {
  const isGood = state.bodyAge <= state.age
  const { good, bad } = useMemo(() => getFactorAnalysis(state.answers), [state.answers])
  const feedbackMsg = getFeedbackMessage(state.bodyAge, state.age)

  if (isGood) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col font-nunito px-6 py-8">
        <div className="text-center mb-5">
          <p className="text-[28px] font-extrabold text-[#58cc02] m-0 mb-1">{RESULT_STRINGS.good.header}</p>
          <p className="text-[12px] font-bold text-[#afafaf] uppercase tracking-[1.4px] m-0">{RESULT_STRINGS.good.subheader}</p>
        </div>
        <div className="flex justify-center mb-3">
          <div className="w-[200px] h-[200px] rounded-full border-[10px] border-[#58cc02] flex flex-col items-center justify-center bg-white">
            <span className="text-[72px] font-extrabold text-[#58cc02] leading-none">{state.bodyAge}</span>
            <span className="text-[12px] font-bold text-[#afafaf] uppercase tracking-[1.2px]">{RESULT_STRINGS.good.bodyAgeLabel}</span>
          </div>
        </div>
        <p className="text-center text-[18px] text-[#4b4b4b] my-2 mb-3">
          {RESULT_STRINGS.good.realAgePrefix}
          <span className="text-[#58cc02] font-bold">{state.age}</span>
        </p>
        <span className="block mx-auto mb-5 px-5 py-2 bg-[#58cc02] rounded-full text-white text-[14px] font-extrabold uppercase tracking-[0.5px] w-fit">{RESULT_STRINGS.good.statusBadge}</span>
        <div className="bg-white rounded-[20px] px-[26px] py-6 mb-6" style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}>
          <p className="text-[18px] text-[#4b4b4b] text-center leading-[1.5] m-0">{feedbackMsg}</p>
        </div>
        <p className="text-[18px] font-extrabold text-[#4b4b4b] mb-3">{RESULT_STRINGS.good.factorTitle}</p>
        <div className="flex flex-col gap-3 mb-6">
          {good.map(f => (
            <div className="bg-white rounded-[20px] p-[18px] flex items-center gap-3" style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }} key={f.label}>
              <div className="w-12 h-12 rounded-2xl bg-[#e8fff0] flex items-center justify-center text-[22px] flex-shrink-0" style={{ border: '2px solid rgba(88,204,2,0.2)' }}>{f.icon}</div>
              <div className="flex-1">
                <div className="text-[16px] font-bold text-[#4b4b4b]">{f.label}</div>
                <div className="text-[14px] text-[#afafaf] mt-0.5">{f.sublabel}</div>
              </div>
              <span className="text-[12px] font-extrabold text-[#4b4b4b] bg-[#f0f0f0] px-2.5 py-1 rounded-lg uppercase whitespace-nowrap">{f.badge}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <button className="flex items-center justify-center w-full py-[18px] rounded-full text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] cursor-pointer transition-transform active:translate-y-0.5" style={{ background: '#58cc02', border: 'none', borderBottom: '4px solid #46a302' }} onClick={onRegister}>{RESULT_STRINGS.good.primaryCta}</button>
          <button className="flex items-center justify-center w-full py-4 rounded-full text-[#58cc02] font-nunito text-[16px] font-extrabold cursor-pointer transition-transform active:translate-y-0.5" style={{ background: '#fff', border: '2px solid #58cc02', borderBottom: '4px solid #58cc02' }} onClick={onRegister}>{RESULT_STRINGS.good.secondaryCta}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col font-nunito px-6 py-8">
      <p className="text-[14px] font-bold text-[#afafaf] uppercase tracking-[1.4px] text-center mb-4">{RESULT_STRINGS.concerning.header}</p>
      <div className="flex justify-center mb-3">
        <div className="w-[192px] h-[192px] rounded-full border-[10px] border-[#ff9600] flex flex-col items-center justify-center bg-white relative">
          <span className="text-[72px] font-extrabold text-[#ff9600] leading-none">{state.bodyAge}</span>
          <span className="text-[12px] font-bold text-[#afafaf] uppercase tracking-[1.2px]">YEARS OLD</span>
          <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#ff4b4b] rounded-[20px] px-4 text-white text-[12px] font-extrabold uppercase tracking-[0.5px] whitespace-nowrap" style={{ borderBottom: '4px solid #d33131', paddingBottom: '10px', paddingTop: '6px' }}>{RESULT_STRINGS.concerning.badge}</span>
        </div>
      </div>
      <p className="text-center text-[18px] text-[#4b4b4b] my-2 mb-3" style={{ marginTop: 28 }}>
        {RESULT_STRINGS.concerning.realAgePrefix}
        <span className="text-[#ff9600] font-bold">{state.age}</span>
      </p>
      <div className="bg-white rounded-[20px] px-[26px] py-6 mb-6" style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}>
        <p className="text-[18px] text-[#4b4b4b] text-center leading-[1.5] m-0">{feedbackMsg}</p>
      </div>
      <p className="text-[18px] font-extrabold text-[#4b4b4b] mb-3">{RESULT_STRINGS.concerning.factorTitle}</p>
      <div className="flex flex-col gap-3 mb-6">
        {bad.map(f => (
          <div className="bg-white rounded-[20px] p-[18px] flex items-center gap-3" style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }} key={f.label}>
            <div className="w-12 h-12 rounded-2xl bg-[#fff4e5] flex items-center justify-center text-[22px] flex-shrink-0" style={{ border: '2px solid rgba(255,150,0,0.2)' }}>{f.icon}</div>
            <div className="flex-1">
              <div className="text-[16px] font-bold text-[#4b4b4b]">{f.label}</div>
              <div className="text-[14px] text-[#afafaf] mt-0.5">{f.sublabel}</div>
            </div>
            <span className="text-[14px] font-extrabold text-[#ff4b4b] whitespace-nowrap">{f.badge}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#fff4e5] rounded-[20px] px-[26px] py-6 mb-6 flex gap-3 items-start" style={{ border: '2px solid #ff9600', borderBottom: '4px solid #ff9600' }}>
        <span className="text-[24px] flex-shrink-0">&#x1F4A1;</span>
        <div>
          <p className="text-[18px] font-extrabold text-[#ff9600] m-0 mb-1.5">{RESULT_STRINGS.concerning.hopeTitle}</p>
          <p className="text-[16px] text-[#4b4b4b] leading-[1.5] m-0">{RESULT_STRINGS.concerning.hopeBody}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <button className="flex items-center justify-center gap-2 w-full py-[18px] rounded-[20px] text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] uppercase cursor-pointer transition-transform active:translate-y-0.5" style={{ background: '#ff864b', border: 'none', borderBottom: '4px solid #d96a36' }} onClick={onRegister}>{RESULT_STRINGS.concerning.primaryCta}</button>
        <p className="text-center text-[13px] text-[#afafaf] mt-3">{RESULT_STRINGS.concerning.footer}</p>
      </div>
    </div>
  )
}
