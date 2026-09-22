// Draws the completion certificate on a canvas, in the app's palette, so it can
// be shown on screen and saved as a PNG without any external service.
const W = 1400
const H = 990

export function drawCertificate(canvas, { name, moduleTitle, dateText }) {
  const ctx = canvas.getContext('2d')
  canvas.width = W
  canvas.height = H

  ctx.fillStyle = '#FFFBF5'
  ctx.fillRect(0, 0, W, H)

  // Teal outer frame with a gold inner rule.
  ctx.strokeStyle = '#2EC4B6'
  ctx.lineWidth = 16
  ctx.strokeRect(34, 34, W - 68, H - 68)
  ctx.strokeStyle = '#FFBF69'
  ctx.lineWidth = 4
  ctx.strokeRect(66, 66, W - 132, H - 132)

  // Rising sun mark, the same motif as the progress graphic.
  ctx.save()
  ctx.translate(W / 2, 250)
  ctx.fillStyle = '#FFBF69'
  ctx.beginPath()
  ctx.arc(0, 0, 54, Math.PI, 0)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#FF6B35'
  ctx.lineWidth = 7
  for (let i = 0; i <= 6; i++) {
    const angle = Math.PI + (i * Math.PI) / 6
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * 68, Math.sin(angle) * 68)
    ctx.lineTo(Math.cos(angle) * 96, Math.sin(angle) * 96)
    ctx.stroke()
  }
  ctx.strokeStyle = '#2EC4B6'
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.moveTo(-190, 12)
  ctx.lineTo(190, 12)
  ctx.stroke()
  ctx.restore()

  const center = (text, y, font, color) => {
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, W / 2, y)
  }

  const sans = '"Nunito", "Segoe UI", system-ui, sans-serif'

  center('SECOND TAKE', 360, `bold 34px ${sans}`, '#2EC4B6')
  center('Certificate of Completion', 440, `bold 62px ${sans}`, '#264653')
  center('This certifies that', 540, `28px ${sans}`, '#5A7A85')
  center(name || 'Participant', 632, `bold 76px ${sans}`, '#FF6B35')
  center('has completed every lesson in', 712, `28px ${sans}`, '#5A7A85')
  center(moduleTitle, 784, `bold 46px ${sans}`, '#264653')
  center(dateText, 862, `26px ${sans}`, '#5A7A85')
  center('Real work, finished. This is yours.', 916, `italic 28px ${sans}`, '#2EC4B6')

  return canvas
}

export function certificateFilename(name, moduleTitle) {
  const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `second-take-${slug(name || 'participant')}-${slug(moduleTitle)}.png`
}
