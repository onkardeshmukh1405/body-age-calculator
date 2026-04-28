import { useRef, useCallback, useEffect } from 'react'

const SOUND_FILES = {
  pop: '/sounds/pop.mp3',
  whoosh: '/sounds/whoosh.mp3',
  celebrate: '/sounds/celebrate.mp3',
} as const

type SoundKey = keyof typeof SOUND_FILES

export function useSound() {
  const audioRefs = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({})

  useEffect(() => {
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      const audio = new Audio(src)
      audio.volume = 0.6
      audioRefs.current[key as SoundKey] = audio
    })
    return () => {
      Object.values(audioRefs.current).forEach(a => a?.pause())
    }
  }, [])

  const play = useCallback((key: SoundKey) => {
    const audio = audioRefs.current[key]
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [])

  return { play }
}
