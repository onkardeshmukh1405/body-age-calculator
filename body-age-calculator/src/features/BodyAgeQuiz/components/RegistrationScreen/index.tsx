import { useState } from 'react'
import { REG_STRINGS } from './constants'

interface RegistrationScreenProps {
  bodyAge: number
  onSubmit: (name: string, phone: string) => void
}

export function RegistrationScreen({ bodyAge, onSubmit }: RegistrationScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const handleSubmit = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = REG_STRINGS.errorName
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = REG_STRINGS.errorPhone
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onSubmit(name.trim(), phone.replace(/\s/g, ''))
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col px-6 py-8 font-nunito">
      <div
        className="bg-white rounded-[20px] p-6 flex items-center gap-4 mb-8"
        style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}
      >
        <div className="w-14 h-14 bg-[rgba(83,0,183,0.1)] rounded-2xl flex items-center justify-center text-[28px] flex-shrink-0">&#x26A1;</div>
        <div>
          <p className="text-[12px] font-bold text-[#afafaf] uppercase tracking-[1px] m-0 mb-1">{REG_STRINGS.bodyAgeLabel}</p>
          <p className="text-[28px] font-extrabold text-[#5300b7] m-0 leading-none">
            {bodyAge} <span className="text-[16px] font-semibold text-[#5300b7]">{REG_STRINGS.yearsUnit}</span>
          </p>
        </div>
      </div>
      <h2 className="text-[28px] font-extrabold text-[#4b4b4b] m-0 mb-2 leading-[1.2]">{REG_STRINGS.heading}</h2>
      <p className="text-[16px] text-[#6b7280] leading-[1.5] m-0 mb-8">{REG_STRINGS.subtext}</p>
      <div className="flex flex-col gap-5 flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#4b4b4b] uppercase tracking-[0.8px]">{REG_STRINGS.nameLabel}</label>
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}
          >
            <input
              className="w-full px-5 py-4 border-none outline-none font-nunito text-[16px] text-[#4b4b4b] bg-transparent placeholder:text-[#afafaf]"
              type="text"
              placeholder={REG_STRINGS.namePlaceholder}
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            />
          </div>
          {errors.name && <span className="text-[13px] text-[#ff4b4b] mt-1">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#4b4b4b] uppercase tracking-[0.8px]">{REG_STRINGS.phoneLabel}</label>
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}
          >
            <div className="flex items-stretch">
              <span className="flex items-center gap-1.5 px-3 border-r-2 border-[#e5e5e5] text-[16px] font-semibold text-[#4b4b4b] flex-shrink-0">&#x1F1EE;&#x1F1F3; {REG_STRINGS.phonePrefix}</span>
              <input
                className="flex-1 px-4 py-4 border-none outline-none font-nunito text-[16px] text-[#4b4b4b] bg-transparent placeholder:text-[#afafaf]"
                type="tel"
                placeholder={REG_STRINGS.phonePlaceholder}
                value={phone}
                maxLength={10}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, phone: undefined })) }}
              />
            </div>
          </div>
          {errors.phone && <span className="text-[13px] text-[#ff4b4b] mt-1">{errors.phone}</span>}
        </div>
        <button
          className="w-full py-[18px] rounded-full text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] uppercase cursor-pointer transition-transform active:translate-y-0.5 mt-2"
          style={{ background: '#ff4b4b', border: 'none', borderBottom: '4px solid #d03030' }}
          onClick={handleSubmit}
        >{REG_STRINGS.cta}</button>
        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#afafaf] text-center mt-3 uppercase tracking-[0.5px]">&#x1F512; {REG_STRINGS.privacy}</div>
      </div>
    </div>
  )
}
