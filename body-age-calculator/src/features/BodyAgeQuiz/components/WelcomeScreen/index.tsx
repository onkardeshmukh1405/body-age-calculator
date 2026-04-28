import { WELCOME_STRINGS, WELCOME_ASSETS } from './constants'
import { useEffect, useRef } from 'react'

interface WelcomeScreenProps {
  onStart: () => void
}

const METRIC_ICONS = [WELCOME_ASSETS.metabIcon, WELCOME_ASSETS.bioIcon, WELCOME_ASSETS.flexIcon]

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = btnRef.current
    if (!el) return
    const anim = el.animate(
      [
        { transform: 'translateX(0px)',  offset: 0 },
        { transform: 'translateX(-5px)', offset: 0.05 },
        { transform: 'translateX(5px)',  offset: 0.12 },
        { transform: 'translateX(-5px)', offset: 0.19 },
        { transform: 'translateX(5px)',  offset: 0.24 },
        { transform: 'translateX(0px)',  offset: 0.29 },
        { transform: 'translateX(0px)',  offset: 1 },
      ],
      { duration: 2100, iterations: Infinity, easing: 'linear' }
    )
    return () => anim.cancel()
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#fcf9f4] font-nunito">
      <div className="max-w-[430px] mx-auto px-5 pt-6 pb-5 flex flex-col">

        <img src={WELCOME_ASSETS.logo} alt="Habuild" className="h-8 w-auto object-contain self-center mb-5" />

        <h1 className="text-[24px] font-extrabold text-[#1a3558] text-center leading-[1.3] m-0 mb-3">
          {WELCOME_STRINGS.headlinePart1}
          <span className="text-[#3aadaa]">{WELCOME_STRINGS.headlinePurple}</span>
          <br />
          {WELCOME_STRINGS.headlinePart2}
          <br />
          <span className="text-[#ff4b4b]">{WELCOME_STRINGS.headlineRed}</span>
        </h1>

        <p className="text-[13px] text-[#6b7280] text-center leading-[1.5] m-0 mb-4">
          {WELCOME_STRINGS.sub1}{' '} <br />
          <span className="inline-flex items-center gap-1 bg-[#fff3cd] text-[#b45309] font-extrabold px-2 py-0.5 mt-2 rounded-full text-[12px]">
            ⏱ {WELCOME_STRINGS.sub2}
          </span>
        </p>

        <button
          ref={btnRef}
          className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-full text-white font-nunito text-[14px] font-extrabold tracking-[0.3px] cursor-pointer mb-2 active:translate-y-0.5 whitespace-nowrap"
          style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', border: 'none', borderBottom: '4px solid #0f2035', boxShadow: '0 8px 20px rgba(26,53,88,0.2)' }}
          onClick={onStart}
        >
          {WELCOME_STRINGS.cta}
        </button>

        {/* Social proof */}
        <div className="bg-white/80 rounded-2xl px-3 py-2.5 flex items-center gap-3 mb-4" style={{ border: '1.5px solid #e5e5e5' }}>
          <div className="flex items-center flex-shrink-0">
            <img src={WELCOME_ASSETS.avatarStrip} alt="Habuild users" className="h-9 w-auto object-contain" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#3aadaa] flex items-center justify-center text-[8px] font-extrabold text-white -ml-2 flex-shrink-0">{WELCOME_STRINGS.socialCount}</div>
          </div>
          <p className="text-[12px] text-[#4b4b4b] m-0 leading-snug">
            {WELCOME_STRINGS.socialProof} <span className="text-[#3aadaa] font-bold">{WELCOME_STRINGS.socialHighlight}</span> {WELCOME_STRINGS.socialSuffix}
          </p>
        </div>

        <div className="w-full bg-[#edf8f8] rounded-2xl px-4 py-3 mb-4 flex gap-2 items-start" style={{ border: '1.5px solid #3aadaa' }}>
          <span className="text-[18px] flex-shrink-0">🧬</span>
          <div>
            <p className="text-[13px] font-extrabold text-[#1a3558] m-0 mb-0.5">{WELCOME_STRINGS.bodyAgeExplainerTitle}</p>
            <p className="text-[12px] text-[#4b6080] leading-[1.6] m-0">{WELCOME_STRINGS.bodyAgeExplainerBody}</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="flex flex-col gap-2">
          {WELCOME_STRINGS.metrics.map((m, i) => (
            <div
              className="bg-white rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ border: '1.5px solid #e5e5e5' }}
              key={m.label}
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: m.iconBg }}>
                <img className="w-5 h-5 object-contain" src={METRIC_ICONS[i]} alt="" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#1a3558]">{m.label}</div>
                <div className="text-[12px] text-[#9ca3af]">{m.sublabel}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
