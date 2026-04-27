import { WELCOME_STRINGS, WELCOME_ASSETS } from './constants'

interface WelcomeScreenProps {
  onStart: () => void
}

const METRIC_ICONS = [WELCOME_ASSETS.metabIcon, WELCOME_ASSETS.bioIcon, WELCOME_ASSETS.flexIcon]

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-[100dvh] bg-[#fcf9f4] relative overflow-hidden font-nunito">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
        <img className="absolute top-20 left-[30px] w-[120px] h-[120px] -rotate-12" src={WELCOME_ASSETS.bioIcon} alt="" />
        <div className="absolute bottom-[60px] right-5 text-[96px] leading-none text-[#ff4b4b]">&#x1F9D8;</div>
      </div>
      <div className="relative max-w-[430px] mx-auto px-6 pt-12 pb-10 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <div className="w-24 h-24 bg-[rgba(83,0,183,0.1)] rounded-[24px] flex items-center justify-center">
            <img className="w-10 h-8" src={WELCOME_ASSETS.heartbeat} alt="" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#58cc02] border-4 border-white rounded-full flex items-center justify-center">
            <img className="w-[10px] h-2" src={WELCOME_ASSETS.checkmark} alt="" />
          </div>
        </div>

        <p className="text-[14px] text-[#5300b7] uppercase tracking-[0.7px] font-bold mb-6">{WELCOME_STRINGS.brand}</p>

        <h1 className="text-[36px] font-extrabold text-[#4b4b4b] text-center leading-[1.25] mb-6">
          {WELCOME_STRINGS.headlinePart1}
          <span className="text-[#5300b7]">{WELCOME_STRINGS.headlinePurple}</span>
          <br />
          {WELCOME_STRINGS.headlinePart2}
          <br />
          <span className="text-[#ff4b4b]">{WELCOME_STRINGS.headlineRed}</span>
        </h1>

        <p className="text-[20px] text-[#6b7280] text-center leading-[1.4] mb-8">
          {WELCOME_STRINGS.sub1}
          <span className="text-[#9ca3af] block">{WELCOME_STRINGS.sub2}</span>
        </p>

        <button
          className="flex items-center justify-center gap-2.5 w-full py-[18px] px-6 rounded-full text-white font-nunito text-[18px] font-extrabold tracking-[0.5px] cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.12)] mb-5 active:translate-y-0.5"
          style={{ background: '#ff845e', border: 'none', borderBottom: '4px solid #e56a47' }}
          onClick={onStart}
        >
          {WELCOME_STRINGS.cta}
          <img className="w-4 h-4" src={WELCOME_ASSETS.arrow} alt="" />
        </button>

        <div className="w-full bg-white/80 backdrop-blur-sm border-2 border-[#e5e5e5] border-b-4 rounded-2xl p-[18px] flex flex-col items-center gap-3 mb-5">
          <div className="flex items-center pr-3">
            <img className="w-12 h-12 rounded-full border-4 border-white object-cover -mr-3" src={WELCOME_ASSETS.avatar1} alt="" />
            <img className="w-12 h-12 rounded-full border-4 border-white object-cover -mr-3" src={WELCOME_ASSETS.avatar2} alt="" />
            <img className="w-12 h-12 rounded-full border-4 border-white object-cover -mr-3" src={WELCOME_ASSETS.avatar3} alt="" />
            <div className="w-12 h-12 rounded-full border-4 border-white bg-[#58cc02] flex items-center justify-center text-[10px] font-extrabold text-white -mr-3">{WELCOME_STRINGS.socialCount}</div>
          </div>
          <p className="text-[16px] text-[#4b4b4b] text-center m-0">
            Join <span className="text-[#58cc02] font-bold">20,00,000+ Indians</span> on Habuild
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {WELCOME_STRINGS.metrics.map((m, i) => (
            <div
              className={`bg-white border-2 border-b-4 rounded-2xl px-6 py-5 flex items-center gap-5 ${i === 1 ? 'border-[rgba(83,0,183,0.2)]' : 'border-[#e5e5e5]'}`}
              key={m.label}
            >
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: m.iconBg }}>
                <img className="w-[26px] h-[26px] object-contain" src={METRIC_ICONS[i]} alt="" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#4b4b4b]">{m.label}</div>
                <div className="text-[14px] text-[#9ca3af] mt-0.5">{m.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
