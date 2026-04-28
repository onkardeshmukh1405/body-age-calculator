import { useState, useEffect, useRef } from 'react'
import { REG_STRINGS } from './constants'
import { WELCOME_ASSETS } from '../WelcomeScreen/constants'

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
  onSubmit: (name: string, phone: string, dialCode: string) => Promise<void>
}

export function RegistrationScreen({ onSubmit }: RegistrationScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; api?: string }>({})
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [selected, setSelected] = useState<Country>(INDIA_DEFAULT)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
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

  const handleSubmit = async () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = REG_STRINGS.errorName
    if (!/^\d{6,15}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = REG_STRINGS.errorPhone
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setLoading(true)
    setErrors({})
    try {
      await onSubmit(name.trim(), phone.replace(/\s/g, ''), selected.dialCode)
    } catch (e: any) {
      setErrors({ api: e?.message || 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col font-nunito"
      style={{ background: 'linear-gradient(160deg, #e8f6f8 0%, #d0eef5 50%, #e4f3ef 100%)' }}
    >
      {/* Country bottom sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />
          <div className="relative bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: '75vh' }}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#e5e5e5] rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e5e5e5]">
              <span className="text-[17px] font-extrabold text-[#1a3558]">Select Country</span>
              <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f0f0] text-[18px] font-bold cursor-pointer border-none" onClick={() => setSheetOpen(false)}>&#x2715;</button>
            </div>
            <div className="px-4 py-3 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 text-[#afafaf] flex-shrink-0" fill="none" viewBox="0 0 20 20">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchRef}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#4b4b4b] placeholder:text-[#afafaf] font-nunito"
                  placeholder="Search country or code..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search.length > 0 && (
                  <button type="button" className="text-[#afafaf] text-[16px] border-none bg-transparent cursor-pointer p-0" onClick={() => setSearch('')}>&#x2715;</button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 && <p className="text-center text-[14px] text-[#afafaf] py-8">No countries found</p>}
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  className={`w-full flex items-center gap-3 px-5 py-3.5 border-none cursor-pointer text-left transition-colors ${selected.code === c.code ? 'bg-[#e8f6f8]' : 'bg-white hover:bg-[#f9f9f9]'}`}
                  onClick={() => { setSelected(c); setSheetOpen(false) }}
                >
                  <img src={c.flag} alt={c.code} className="w-8 h-5 object-cover rounded flex-shrink-0" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
                  <span className="flex-1 text-[15px] font-semibold text-[#1a3558] truncate">{c.name}</span>
                  <span className="text-[14px] font-bold text-[#3aadaa]">{c.dialCode}</span>
                  {selected.code === c.code && (
                    <svg className="w-4 h-4 text-[#3aadaa] flex-shrink-0" fill="none" viewBox="0 0 16 16">
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

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <span className="text-[13px] font-extrabold text-[#3aadaa]">#HarGharYoga</span>
        <img src={WELCOME_ASSETS.logo} alt="Habuild" className="h-8 w-auto object-contain" />
      </div>

      {/* Hero section */}
      <div className="flex flex-col items-center px-5 pt-1">
        <p className="text-[16px] font-semibold text-[#3aadaa] m-0 mb-1 tracking-wide">{REG_STRINGS.programDays}</p>
        <div className="w-12 h-0.5 bg-[#3aadaa] rounded-full mb-2" />
        <h1 className="text-[38px] font-black text-[#1a3558] m-0 mb-2 tracking-tight leading-none">{REG_STRINGS.programName}</h1>

        {/* Starts badge */}
        <div
          className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-[14px] font-bold mb-2"
          style={{ background: 'linear-gradient(90deg, #1a3558, #3aadaa)' }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{REG_STRINGS.badge}</span>
        </div>

        {/* Instructor image */}
        <div className="w-full flex justify-center">
          <img
            src="https://habuildassets.s3.ap-south-1.amazonaws.com/freeyoga/SB-VERIFY.png"
            alt="Saurabh Bothra"
            className="w-[220px] object-contain"
            style={{ maxHeight: '200px' }}
          />
        </div>

        {/* Instructor info */}
        <h2 className="text-[22px] font-black text-[#1a3558] m-0 mb-0.5 text-center">{REG_STRINGS.instructorName}</h2>
        <p className="text-[13px] font-bold text-[#3aadaa] m-0 mb-3 text-center">{REG_STRINGS.instructorTitle}</p>
      </div>

      {/* Form */}
      <div className="px-5 pb-5 flex flex-col gap-2.5">
        {/* Name */}
        <div>
          <input
            className="w-full px-4 py-4 rounded-2xl text-[16px] text-[#1a3558] font-nunito placeholder:text-[#9ca3af] outline-none"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(58,173,170,0.25)' }}
            type="text"
            placeholder={REG_STRINGS.namePlaceholder}
            value={name}
            onChange={e => { setName(e.target.value.replace(/[^a-zA-Z\s]/g, '')); setErrors(p => ({ ...p, name: undefined })) }}
          />
          {errors.name && <span className="text-[12px] text-[#ff4b4b] mt-1 block">{errors.name}</span>}
        </div>

        {/* Phone row */}
        <div className="flex gap-3">
          {/* Country picker */}
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-4 rounded-2xl flex-shrink-0 cursor-pointer border-none"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(58,173,170,0.25)' }}
            onClick={() => setSheetOpen(true)}
          >
            <img src={selected.flag} alt={selected.code} className="w-7 h-5 object-cover rounded" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
            <span className="text-[15px] font-bold text-[#1a3558]">{selected.dialCode}</span>
            <svg className="w-3 h-3 text-[#9ca3af]" fill="none" viewBox="0 0 10 6">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Phone input */}
          <div className="flex-1">
            <input
              className="w-full px-4 py-4 rounded-2xl text-[16px] text-[#1a3558] font-nunito placeholder:text-[#9ca3af] outline-none"
              style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(58,173,170,0.25)' }}
              type="tel"
              placeholder={REG_STRINGS.phonePlaceholder}
              value={phone}
              maxLength={15}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, phone: undefined })) }}
            />
          </div>
        </div>
        {errors.phone && <span className="text-[12px] text-[#ff4b4b] -mt-1 block">{errors.phone}</span>}

        {/* CTA */}
        <button
          ref={btnRef}
          className="w-full py-4 rounded-2xl text-white font-nunito text-[17px] font-extrabold transition-transform active:translate-y-0.5 mt-1 flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', border: 'none', boxShadow: '0 4px 16px rgba(26,53,88,0.25)', cursor: loading ? 'not-allowed' : 'pointer' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? 'Joining...' : REG_STRINGS.cta}
        </button>

        {errors.api && (
          <p className="text-center text-[13px] text-[#ff4b4b] m-0">{errors.api}</p>
        )}

        {/* Social proof */}
        <p className="text-center text-[14px] font-extrabold text-[#1a3558] m-0 mt-1">{REG_STRINGS.socialProof}</p>
      </div>
    </div>
  )
}
