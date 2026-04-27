import { SUCCESS_STRINGS } from './constants'

interface SuccessScreenProps {
  name: string
  onReset: () => void
}

export function SuccessScreen({ name, onReset }: SuccessScreenProps) {
  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(SUCCESS_STRINGS.shareMsg)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8 font-nunito gap-5">
      <div className="relative w-40 h-40 mb-2">
        <div className="w-40 h-40 bg-[#f5f5f5] rounded-full flex items-center justify-center">
          <span className="text-[96px] leading-none">🎉</span>
        </div>
        <span className="absolute top-1 right-1 text-[32px] leading-none">✅</span>
      </div>
      <h1 className="text-[32px] font-extrabold text-[#5300b7] text-center m-0">
        {SUCCESS_STRINGS.headingPrefix}{name}{SUCCESS_STRINGS.headingSuffix}
      </h1>
      <p className="text-[18px] text-[#6b7280] text-center max-w-[320px] leading-[1.5] m-0">{SUCCESS_STRINGS.subtext}</p>
      <div className="w-full max-w-[400px] flex flex-col gap-3">
        <button
          className="w-full py-4 px-6 rounded-full text-white font-nunito text-[16px] font-bold tracking-[0.5px] cursor-pointer transition-transform active:translate-y-0.5"
          style={{ background: '#58cc02', border: 'none', borderBottom: '4px solid #46a302' }}
          onClick={handleShare}
        >
          📤 {SUCCESS_STRINGS.shareBtn}
        </button>
        <button
          className="w-full py-4 px-6 rounded-full text-white font-nunito text-[16px] font-bold tracking-[0.5px] cursor-pointer transition-transform active:translate-y-0.5"
          style={{ background: '#5300b7', border: 'none', borderBottom: '4px solid #3d0090' }}
          onClick={onReset}
        >
          ⊞ {SUCCESS_STRINGS.dashboardBtn}
        </button>
      </div>
      <div className="text-[32px] tracking-[8px] text-center mt-2">🏆 ⭐ 🥇</div>
    </div>
  )
}
