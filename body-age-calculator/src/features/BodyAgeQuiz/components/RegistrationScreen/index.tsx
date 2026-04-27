import { useState, useEffect, useRef } from 'react'
import { REG_STRINGS } from './constants'

interface Country {
  name: string
  code: string
  dialCode: string
  flag: string
}

const INDIA_DEFAULT: Country = {
  name: 'India',
  code: 'IN',
  dialCode: '+91',
  flag: 'https://flagcdn.com/in.svg',
}

interface RegistrationScreenProps {
  bodyAge: number
  onSubmit: (name: string, phone: string) => void
}

export function RegistrationScreen({ bodyAge, onSubmit }: RegistrationScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [countries, setCountries] = useState<Country[]>([])
  const [selected, setSelected] = useState<Country>(INDIA_DEFAULT)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('https://cdn.habuild.in/bff/web/v1/spec.json')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.countries)) {
          setCountries(data.countries)
          const india = data.countries.find((c: Country) => c.code === 'IN')
          if (india) setSelected(india)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => searchRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setSearch('')
    }
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search)
  )

  const handleSubmit = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = REG_STRINGS.errorName
    if (!/^\d{6,15}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = REG_STRINGS.errorPhone
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onSubmit(name.trim(), `${selected.dialCode}${phone.replace(/\s/g, '')}`)
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col px-6 py-8 font-nunito">

      {/* Country picker bottom sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: '75vh' }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#e5e5e5] rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e5e5e5]">
              <span className="text-[17px] font-extrabold text-[#4b4b4b]">Select Country</span>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f0f0] text-[#4b4b4b] text-[18px] font-bold cursor-pointer border-none"
                onClick={() => setSheetOpen(false)}
              >
                &#x2715;
              </button>
            </div>

            {/* Search bar */}
            <div className="px-4 py-3 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 text-[#afafaf] flex-shrink-0" fill="none" viewBox="0 0 20 20">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchRef}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#4b4b4b] placeholder:text-[#afafaf] font-nunito"
                  placeholder="Search country name or dial code..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search.length > 0 && (
                  <button
                    type="button"
                    className="text-[#afafaf] text-[16px] border-none bg-transparent cursor-pointer p-0 leading-none"
                    onClick={() => setSearch('')}
                  >&#x2715;</button>
                )}
              </div>
            </div>

            {/* Country list */}
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 && (
                <p className="text-center text-[14px] text-[#afafaf] py-8">No countries found</p>
              )}
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  className={`w-full flex items-center gap-3 px-5 py-3.5 border-none cursor-pointer text-left transition-colors ${
                    selected.code === c.code
                      ? 'bg-[rgba(83,0,183,0.06)]'
                      : 'bg-white hover:bg-[#f9f9f9]'
                  }`}
                  onClick={() => { setSelected(c); setSheetOpen(false) }}
                >
                  <img
                    src={c.flag}
                    alt={c.code}
                    className="w-8 h-5 object-cover rounded flex-shrink-0"
                    style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
                  />
                  <span className="flex-1 text-[15px] font-semibold text-[#4b4b4b] truncate">{c.name}</span>
                  <span className="text-[14px] font-bold text-[#6b7280] flex-shrink-0">{c.dialCode}</span>
                  {selected.code === c.code && (
                    <svg className="w-4 h-4 text-[#5300b7] flex-shrink-0" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
              <div className="h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Body age summary card */}
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
        {/* Name field */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#4b4b4b] uppercase tracking-[0.8px]">{REG_STRINGS.nameLabel}</label>
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}>
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

        {/* Phone field */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#4b4b4b] uppercase tracking-[0.8px]">{REG_STRINGS.phoneLabel}</label>
          <div className="bg-white rounded-xl flex items-stretch" style={{ border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5' }}>
            {/* Country trigger — opens bottom sheet */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-4 flex-shrink-0 bg-transparent cursor-pointer border-none border-r-2"
              style={{ borderRight: '2px solid #e5e5e5' }}
              onClick={() => setSheetOpen(true)}
            >
              <img
                src={selected.flag}
                alt={selected.code}
                className="w-7 h-5 object-cover rounded"
                style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
              />
              <span className="text-[15px] font-bold text-[#4b4b4b]">{selected.dialCode}</span>
              <svg className="w-3 h-3 text-[#afafaf]" fill="none" viewBox="0 0 10 6">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              className="flex-1 px-4 py-4 border-none outline-none font-nunito text-[16px] text-[#4b4b4b] bg-transparent placeholder:text-[#afafaf]"
              type="tel"
              placeholder={REG_STRINGS.phonePlaceholder}
              value={phone}
              maxLength={15}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, phone: undefined })) }}
            />
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
