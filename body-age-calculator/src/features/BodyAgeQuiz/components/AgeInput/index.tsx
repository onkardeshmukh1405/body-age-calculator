import { useState, useCallback, useRef, useEffect } from 'react'
import { AGE_INPUT_STRINGS, AGE_MIN, AGE_MAX, AGE_DEFAULT } from './constants'

const ITEM_W = 72
const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => i + AGE_MIN)

interface AgeInputProps {
  onSubmit: (age: number) => void
  onClose: () => void
}

export function AgeInput({ onSubmit, onClose }: AgeInputProps) {
  const [age, setAge] = useState(AGE_DEFAULT)
  const scrollRef = useRef<HTMLDivElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const playTick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 900
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.04)
    } catch (_) {}
  }, [])

  const scrollToAge = useCallback((target: number, smooth = true) => {
    scrollRef.current?.scrollTo({
      left: (target - AGE_MIN) * ITEM_W,
      behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
    })
  }, [])

  useEffect(() => { scrollToAge(AGE_DEFAULT, false) }, [scrollToAge])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const next = AGE_MIN + Math.round(scrollRef.current.scrollLeft / ITEM_W)
    const clamped = Math.min(AGE_MAX, Math.max(AGE_MIN, next))
    setAge(prev => {
      if (prev !== clamped) playTick()
      return clamped
    })
  }, [playTick])

  const decrement = useCallback(() => {
    const next = Math.max(AGE_MIN, age - 1)
    setAge(next)
    scrollToAge(next)
    playTick()
  }, [age, scrollToAge, playTick])

  const increment = useCallback(() => {
    const next = Math.min(AGE_MAX, age + 1)
    setAge(next)
    scrollToAge(next)
    playTick()
  }, [age, scrollToAge, playTick])

  return (
    <div className="min-h-[100dvh] bg-[#fcf9f4] flex flex-col font-nunito">
      <style>{`.age-scroll::-webkit-scrollbar{display:none}`}</style>

      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <button className="bg-transparent border-none cursor-pointer text-[20px] text-[#afafaf] p-0 leading-none flex-shrink-0" onClick={onClose} aria-label="Close">&#x2715;</button>
        <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
          <div className="h-full bg-[#3aadaa] rounded-full w-[5%]" />
        </div>
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col">
        <h1 className="text-[24px] font-extrabold text-[#4b4b4b] m-0 mb-2">{AGE_INPUT_STRINGS.heading}</h1>
        <p className="text-[14px] text-[#6b7280] leading-[1.5] m-0 mb-10">{AGE_INPUT_STRINGS.subtext}</p>

        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-[12px] font-bold text-[#afafaf] uppercase tracking-[1.4px] m-0">{AGE_INPUT_STRINGS.yearsLabel}</p>

          <div className="flex items-center gap-3 w-full">
            {/* Minus */}
            <button
              className="w-12 h-12 rounded-xl bg-[#edf8f8] flex items-center justify-center text-[26px] font-bold text-[#3aadaa] cursor-pointer select-none active:translate-y-0.5 flex-shrink-0"
              style={{ border: '2px solid #b2e4e3', borderBottom: '4px solid #8dd4d3' }}
              onClick={decrement}
            >−</button>

            {/* Scroll picker */}
            <div className="relative flex-1 overflow-hidden">
              {/* Highlight frame for selected item — sits behind the numbers */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl pointer-events-none bg-white"
                style={{ width: ITEM_W, height: 76, border: '2px solid #3aadaa', borderBottom: '4px solid #2a8d8a', zIndex: 1 }}
              />
              <div
                ref={scrollRef}
                className="age-scroll flex"
                style={{
                  overflowX: 'scroll',
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  paddingLeft: `calc(50% - ${ITEM_W / 2}px)`,
                  paddingRight: `calc(50% - ${ITEM_W / 2}px)`,
                  position: 'relative',
                  zIndex: 2,
                }}
                onScroll={handleScroll}
              >
                {ages.map(a => {
                  const dist = Math.abs(a - age)
                  return (
                    <div
                      key={a}
                      style={{
                        width: ITEM_W,
                        flexShrink: 0,
                        scrollSnapAlign: 'center',
                        height: 76,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: dist === 0 ? 42 : dist === 1 ? 28 : 22,
                        fontWeight: 800,
                        color: dist === 0 ? '#3aadaa' : '#4b4b4b',
                        opacity: dist === 0 ? 1 : dist === 1 ? 0.4 : dist === 2 ? 0.18 : 0.08,
                        filter: dist === 0 ? 'none' : `blur(${Math.min(dist * 1.5, 4)}px)`,
                        transition: 'font-size 0.15s, opacity 0.15s, filter 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      {a}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Plus */}
            <button
              className="w-12 h-12 rounded-xl bg-[#edf8f8] flex items-center justify-center text-[26px] font-bold text-[#3aadaa] cursor-pointer select-none active:translate-y-0.5 flex-shrink-0"
              style={{ border: '2px solid #b2e4e3', borderBottom: '4px solid #8dd4d3' }}
              onClick={increment}
            >+</button>
          </div>

          <p className="text-[13px] text-[#afafaf] m-0">← swipe to change →</p>
        </div>

        <div className="pt-8">
          <button
            className="flex items-center justify-center w-full py-[18px] rounded-full text-white font-nunito text-[16px] font-extrabold tracking-[0.5px] uppercase cursor-pointer transition-transform active:translate-y-0.5"
            style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', border: 'none', borderBottom: '4px solid #0f2035' }}
            onClick={() => onSubmit(age)}
          >
            {AGE_INPUT_STRINGS.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
