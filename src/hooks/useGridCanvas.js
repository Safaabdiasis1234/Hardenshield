import { useEffect, useRef } from 'react'

/**
 * useGridCanvas — attaches an rAF canvas loop to a ref.
 * Renders: grid lines, scan line, radar rings + sweep, ping dots.
 * @returns {React.RefObject} canvasRef — attach to <canvas ref={canvasRef} />
 */
export function useGridCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, t = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const draw = () => {
      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)

      // Grid
      const CELL = 52
      ctx.strokeStyle = 'rgba(79,70,229,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < W; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, H) }
      for (let y = 0; y < H; y += CELL) { ctx.moveTo(0, y); ctx.lineTo(W, y) }
      ctx.stroke()

      // Scan line
      const scanY = (t * 0.4) % H
      const sg = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 8)
      sg.addColorStop(0, 'rgba(79,70,229,0)')
      sg.addColorStop(1, 'rgba(79,70,229,0.12)')
      ctx.fillStyle = sg
      ctx.fillRect(0, scanY - 60, W, 68)
      ctx.strokeStyle = 'rgba(99,102,241,0.25)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke()

      // Radar rings
      const cx = W * 0.72, cy = H * 0.48
      for (let i = 0; i < 5; i++) {
        const r = 60 + i * 55 + Math.sin(t * 0.018 - i * 0.8) * 6
        ctx.strokeStyle = `rgba(79,70,229,${0.04 + (5 - i) * 0.018})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
      }

      // Sweep sector
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((t * 0.008) % (Math.PI * 2))
      const sg2 = ctx.createLinearGradient(0, 0, 290, 0)
      sg2.addColorStop(0, 'rgba(79,70,229,0.18)')
      sg2.addColorStop(1, 'rgba(79,70,229,0)')
      ctx.fillStyle = sg2
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 290, -0.35, 0); ctx.closePath(); ctx.fill()
      ctx.restore()

      // Centre dot
      ctx.fillStyle = 'rgba(99,102,241,0.6)'
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill()

      // Ping dots
      ;[{gx:3,gy:2,p:0},{gx:7,gy:5,p:1.5},{gx:5,gy:8,p:3},{gx:10,gy:3,p:4.5},{gx:2,gy:6,p:2.2}]
        .forEach(({gx, gy, p}) => {
          const px = gx * CELL, py = gy * CELL
          const a = (Math.sin(t * 0.025 + p) + 1) / 2
          ctx.fillStyle = `rgba(99,102,241,${a * 0.6})`
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill()
          ctx.strokeStyle = `rgba(99,102,241,${(1 - a) * 0.25})`
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(px, py, a * 18, 0, Math.PI * 2); ctx.stroke()
        })

      t++
      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return canvasRef
}
