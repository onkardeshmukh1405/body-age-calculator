import { useRef, useCallback, useEffect, useState } from 'react'

const SOUND_FILES = {
  bg: '/sounds/bg-music.mp3',
  pop: '/sounds/pop.mp3',
  whoosh: '/sounds/whoosh.mp3',
  countdown: '/sounds/countdown.mp3',
  celebrate: '/sounds/celebrate.mp3',
} as const

type SoundKey = keyof typeof SOUND_FILES

export function useSound() {
  const [musicOn, setMusicOn] = useState(true)
  const audioRefs = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({})

  useEffect(() => {
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      const audio = new Audio(src)
      if (key === 'bg') {
        audio.loop = true
        audio.volume = 0.3
      } else {
        audio.volume = 0.6
      }
      audioRefs.current[key as SoundKey] = audio
    })
    return () => {
      Object.values(audioRefs.current).forEach(a => a?.pause())
    }
  }, [])

  const play = useCallback((key: SoundKey) => {
    const audio = audioRefs.current[key]
    if (!audio) return
    if (key === 'bg' && !musicOn) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [musicOn])

  const startBgMusic = useCallback(() => {
    if (!musicOn) return
    play('bg')
  }, [musicOn, play])

  const stopBgMusic = useCallback(() => {
    audioRefs.current.bg?.pause()
  }, [])

  const toggleMusic = useCallback(() => {
    setMusicOn(prev => {
      const next = !prev
      if (!next) audioRefs.current.bg?.pause()
      else audioRefs.current.bg?.play().catch(() => {})
      return next
    })
  }, [])

  return { play, startBgMusic, stopBgMusic, toggleMusic, musicOn }
}
