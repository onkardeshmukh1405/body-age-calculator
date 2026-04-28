import { SUCCESS_STRINGS } from './constants'
import { WELCOME_ASSETS } from '../WelcomeScreen/constants'

interface SuccessScreenProps {
  name: string
  phone: string
  dialCode: string
}

export function SuccessScreen({ name, phone, dialCode }: SuccessScreenProps) {
  const dashboardUrl = `https://habit.yoga/?ref=website&ph=${phone}&country=${dialCode}&name=${encodeURIComponent(name)}`

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center font-nunito px-6 text-center"
      style={{ background: 'linear-gradient(160deg, #e8f6f8 0%, #d0eef5 50%, #e4f3ef 100%)' }}
    >
      <img src={WELCOME_ASSETS.logo} alt="Habuild" className="h-10 w-auto object-contain mb-10" />

      {/* Check circle */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #1a3558, #3aadaa)' }}
      >
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-[32px] font-extrabold text-[#1a3558] m-0 mb-2 leading-tight">
        {SUCCESS_STRINGS.heading}
      </h1>
      <p className="text-[17px] font-bold text-[#3aadaa] m-0 mb-4">{name}</p>

      <p className="text-[15px] text-[#4b6080] leading-[1.6] m-0 mb-10 max-w-[300px]">
        {SUCCESS_STRINGS.subtext}
      </p>

      <a
        href={dashboardUrl}
        className="flex items-center justify-center w-full max-w-[340px] py-[18px] rounded-full text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] uppercase no-underline active:translate-y-0.5 transition-transform"
        style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', borderBottom: '4px solid #0f2035' }}
      >
        {SUCCESS_STRINGS.cta}
      </a>
    </div>
  )
}
