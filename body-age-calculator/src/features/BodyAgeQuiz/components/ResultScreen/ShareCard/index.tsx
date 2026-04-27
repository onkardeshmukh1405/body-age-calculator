import { useCallback } from 'react'
import globalStyles from '../../../BodyAgeQuiz.module.css'
import { SHARE_STRINGS } from './constants'

interface ShareCardProps {
  bodyAge: number
  realAge: number
}

export function ShareCard({ bodyAge, realAge }: ShareCardProps) {
  const handleShare = useCallback(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')!

    const grad = ctx.createLinearGradient(0, 0, 800, 800)
    grad.addColorStop(0, '#1e0a3c')
    grad.addColorStop(0.5, '#6d28d9')
    grad.addColorStop(1, '#a78bfa')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 800)

    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    for (let x = 0; x < 800; x += 24) {
      for (let y = 0; y < 800; y += 24) {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
      }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(SHARE_STRINGS.canvasTitle, 400, 120)

    ctx.font = '160px serif'
    ctx.fillText('🦚', 400, 320)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 160px sans-serif'
    ctx.fillText(String(bodyAge), 400, 530)

    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(SHARE_STRINGS.canvasSubtitle, 400, 600)
    ctx.fillText(`vs real age ${realAge}`, 400, 648)

    ctx.fillStyle = '#c4b5fd'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(SHARE_STRINGS.canvasHashtag, 400, 740)

    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'))
    if (!blob) return

    if (navigator.share) {
      try {
        const file = new File([blob], 'body-age.png', { type: 'image/png' })
        await navigator.share({
          title: SHARE_STRINGS.shareTitle,
          text: SHARE_STRINGS.shareText(bodyAge, realAge),
          files: [file],
        })
        return
      } catch { /* fallback */ }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'body-age-result.png'
    a.click()
    URL.revokeObjectURL(url)
  }, [bodyAge, realAge])

  return (
    <button className={globalStyles.btn3d} onClick={handleShare}>
      {SHARE_STRINGS.btnLabel}
    </button>
  )
}
