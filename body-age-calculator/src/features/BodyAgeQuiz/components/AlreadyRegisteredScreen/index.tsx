import { ALREADY_REG_STRINGS } from './constants'
import { WELCOME_ASSETS } from '../WelcomeScreen/constants'

interface AlreadyRegisteredScreenProps {
  name: string
  phone: string
  dialCode: string
  onRetryQuiz: () => void
}

export function AlreadyRegisteredScreen({ name, phone, dialCode, onRetryQuiz }: AlreadyRegisteredScreenProps) {
  const dashboardUrl = `https://habit.yoga/?ref=website&ph=${phone}&country=${dialCode}&name=${encodeURIComponent(name)}`

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center font-nunito px-6 text-center"
      style={{ background: 'linear-gradient(160deg, #e8f6f8 0%, #d0eef5 50%, #e4f3ef 100%)' }}
    >
      <img src={WELCOME_ASSETS.logo} alt="Habuild" className="h-10 w-auto object-contain mb-8" />

      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'linear-gradient(135deg, #1a3558, #3aadaa)' }}
      >
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-[28px] font-extrabold text-[#1a3558] m-0 mb-1 leading-tight">{ALREADY_REG_STRINGS.heading}</h1>
      <p className="text-[16px] font-bold text-[#3aadaa] m-0 mb-3">{name}</p>
      <p className="text-[14px] text-[#4b6080] leading-[1.6] m-0 mb-8 max-w-[300px]">{ALREADY_REG_STRINGS.subtext}</p>

      <div className="flex flex-col gap-3 w-full max-w-[340px]">
        <button
          onClick={onRetryQuiz}
          className="flex items-center justify-center w-full py-4 rounded-full text-white font-nunito text-[15px] font-extrabold tracking-[0.5px] uppercase active:translate-y-0.5 transition-transform"
          style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', border: 'none', borderBottom: '4px solid #0f2035' }}
        >
          {ALREADY_REG_STRINGS.retryQuiz}
        </button>
        <a
          href={dashboardUrl}
          className="flex items-center justify-center w-full py-3 rounded-full font-nunito text-[14px] font-extrabold no-underline active:translate-y-0.5 transition-transform"
          style={{ background: 'transparent', border: '1.5px solid #1a3558', color: '#1a3558' }}
        >
          {ALREADY_REG_STRINGS.cta}
        </a>
      </div>
    </div>
  )
}
