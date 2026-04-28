import { useEffect, useRef, useCallback } from 'react'
import type { QuizState } from '../../types'
import { SHARE_STRINGS, POSTER_ASSETS } from './constants'

interface SharePosterProps {
  state: QuizState
  onClose: () => void
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  // Try fetch-as-blob first — avoids canvas CORS taint while keeping canvas exportable
  try {
    const res = await fetch(src, { mode: 'cors' })
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => { URL.revokeObjectURL(objectUrl); resolve(img) }
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(new Image()) }
      img.src = objectUrl
    })
  } catch {
    // fallback: load directly (canvas may become tainted but at least renders)
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(new Image())
      img.src = src
    })
  }
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.translate(x, y)
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 4)
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.quadraticCurveTo(size * 0.15, -size * 0.15, size * 0.4, 0)
    ctx.quadraticCurveTo(size * 0.15, size * 0.15, 0, size)
    ctx.quadraticCurveTo(-size * 0.15, size * 0.15, -size * 0.4, 0)
    ctx.quadraticCurveTo(-size * 0.15, -size * 0.15, 0, -size)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, lineHeight: number) {
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight)
  })
}

async function drawPoster(canvas: HTMLCanvasElement, state: QuizState) {
  const ctx = canvas.getContext('2d')!
  const W = 900
  const H = 500
  canvas.width = W
  canvas.height = H

  const isGood = state.bodyAge <= state.age
  const diff = Math.abs(state.age - state.bodyAge)
  const accentColor = isGood ? '#2d7e7a' : '#e05252'
  const accentLight = isGood ? '#3aadaa' : '#ff6b6b'

  // ── BACKGROUND GRADIENT ──
  const bg = ctx.createLinearGradient(0, 0, W * 0.6, H)
  bg.addColorStop(0, '#c6ecec')
  bg.addColorStop(0.5, '#e8f7f7')
  bg.addColorStop(1, '#faf8f4')
  ctx.fillStyle = bg
  const r = 24
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(W - r, 0); ctx.quadraticCurveTo(W, 0, W, r)
  ctx.lineTo(W, H - r); ctx.quadraticCurveTo(W, H, W - r, H)
  ctx.lineTo(r, H); ctx.quadraticCurveTo(0, H, 0, H - r)
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()

  // ── LOGO (top-left) — try with crossOrigin, fallback to text ──
  const logo = await loadImage(POSTER_ASSETS.logo)
  if (logo.naturalWidth > 0) {
    const lh = 30
    const lw = logo.naturalWidth * (lh / logo.naturalHeight)
    ctx.drawImage(logo, 36, 28, lw, lh)
  } else {
    // text fallback
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#1a3558'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('habuild', 36, 52)
  }

  // ── LEFT PANEL: CIRCLE ──
  const cx = 210
  const cy = 248
  const outerR = 128
  const innerR = 106

  // Segmented dashed ring
  ctx.save()
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 13
  ctx.lineCap = 'round'
  ctx.setLineDash([52, 20])
  ctx.lineDashOffset = -8
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()

  // Inner circle radial gradient
  const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR)
  innerGrad.addColorStop(0, '#ffffff')
  innerGrad.addColorStop(1, '#d8f4f4')
  ctx.beginPath()
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
  ctx.fillStyle = innerGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(58,173,170,0.15)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Body age number
  ctx.font = 'bold 80px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#1a3558'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(state.bodyAge), cx, cy - 14)

  // "YEARS OLD" pill
  const pillW = 126, pillH = 28
  const pillX = cx - pillW / 2, pillY = cy + 46
  ctx.beginPath()
  ctx.roundRect(pillX, pillY, pillW, pillH, 6)
  ctx.fillStyle = accentLight
  ctx.fill()
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(SHARE_STRINGS.yearsOld, cx, pillY + pillH / 2)

  // "BODY AGE RESULT" below circle
  ctx.font = '600 12px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#7a9aaa'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.letterSpacing = '3px'
  ctx.fillText(SHARE_STRINGS.bodyAgeResult, cx, cy + outerR + 38)
  ctx.letterSpacing = '0px'

  // Sparkles
  const sparkleColor = isGood ? '#e07070' : '#e0a060'
  drawSparkle(ctx, cx + outerR - 10, cy - outerR + 12, 10, sparkleColor)
  drawSparkle(ctx, cx + outerR + 10, cy - outerR + 38, 7, sparkleColor)

  // ── RIGHT PANEL ──
  const rx = 440
  let ry = 108

  // Reset alignment for left-aligned right panel text
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Headline line 1 (navy)
  ctx.font = 'bold 46px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#1a3558'
  ctx.fillText(isGood ? SHARE_STRINGS.goodHeadline1(diff) : SHARE_STRINGS.badHeadline1(diff), rx, ry)
  ry += 56

  // Headline line 2 (teal / red)
  ctx.fillStyle = accentColor
  ctx.fillText(isGood ? SHARE_STRINGS.goodHeadline2 : SHARE_STRINGS.badHeadline2, rx, ry)
  ry += 38

  // Body text
  ctx.font = '400 15px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#5a7080'
  wrapText(ctx, isGood ? SHARE_STRINGS.goodBody : SHARE_STRINGS.badBody, rx, ry, 23)
  ry += 23 * 3 + 10

  // CTA bullet
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#1a3558'
  ctx.fillText(SHARE_STRINGS.cta, rx, ry)
}

export function SharePoster({ state, onClose }: SharePosterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      drawPoster(canvasRef.current, state)
    }
  }, [state])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'my-body-age-report.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const handleShare = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (!blob) return
      if (navigator.share) {
        try {
          const file = new File([blob], 'my-body-age-report.png', { type: 'image/png' })
          await navigator.share({ files: [file], url: 'https://habuild-wellness.web.app' })
        } catch {
          handleDownload()
        }
      } else {
        handleDownload()
      }
    }, 'image/png')
  }, [state, handleDownload])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 px-4 py-6 font-nunito">
      <div className="w-full max-w-[500px] flex flex-col gap-3">

        <div className="flex items-center justify-between">
          <p className="text-white font-extrabold text-[15px] m-0">{SHARE_STRINGS.heading}</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 border-none text-white text-[16px] cursor-pointer flex items-center justify-center leading-none"
          >
            ✕
          </button>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl shadow-xl">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-full text-white font-nunito text-[14px] font-extrabold cursor-pointer border-none active:translate-y-0.5 transition-transform"
            style={{ background: 'linear-gradient(90deg, #1a3558 0%, #3aadaa 100%)', borderBottom: '3px solid #0f2035' }}
          >
            {SHARE_STRINGS.share}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-3.5 rounded-full font-nunito text-[14px] font-extrabold cursor-pointer active:translate-y-0.5 transition-transform"
            style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.35)', color: 'white' }}
          >
            {SHARE_STRINGS.download}
          </button>
        </div>

      </div>
    </div>
  )
}
