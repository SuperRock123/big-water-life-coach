export interface PosterSpec {
  sectName: string
  weak: string
  strong: string
  note: string
  dateLabel: string
  title: string
  points: number
  frame: 'classic' | 'gold'
  traitor: boolean
  marks: string[]
}

const BUBBLES = [
  [80, 180, 28],
  [980, 240, 46],
  [140, 860, 18],
  [1000, 720, 22],
  [60, 1120, 34],
  [990, 1180, 16],
  [220, 80, 12],
  [860, 60, 14],
] as const

async function ensureFonts(): Promise<void> {
  await Promise.all([
    document.fonts.load('64px "ZCOOL KuaiLe"'),
    document.fonts.load('32px "Noto Sans SC"'),
    document.fonts.load('700 32px "Noto Sans SC"'),
  ])
  await document.fonts.ready
}

function fontDisplay(size: number): string {
  return `${size}px "ZCOOL KuaiLe", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif`
}

function fontBody(size: number, weight: 400 | 700): string {
  return `${weight} ${size}px "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif`
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const ch of text) {
    const next = line + ch
    if (ctx.measureText(next).width > max && line) {
      lines.push(line)
      line = ch
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawBubbles(ctx: CanvasRenderingContext2D) {
  for (const [x, y, r] of BUBBLES) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.28)'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.22, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fill()
  }
}

function drawWaves(ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.moveTo(0, 1260)
  for (let x = 0; x <= 1080; x += 16) {
    ctx.lineTo(x, 1260 + Math.sin(x / 70) * 16)
  }
  ctx.lineTo(1080, 1440)
  ctx.lineTo(0, 1440)
  ctx.closePath()
  ctx.fillStyle = 'rgba(8, 70, 140, 0.28)'
  ctx.fill()
}

function drawSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  rotate: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotate)
  ctx.font = fontDisplay(34)
  const width = Math.max(360, ctx.measureText(text).width + 64)
  roundRect(ctx, -width / 2, -34, width, 68, 16)
  ctx.fillStyle = '#ffe56a'
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = '#08243c'
  ctx.stroke()
  ctx.fillStyle = '#08243c'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 2)
  ctx.restore()
}

function drawSeal(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-0.14)
  roundRect(ctx, -68, -68, 136, 136, 10)
  ctx.fillStyle = '#d7263d'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#ffd6dc'
  roundRect(ctx, -54, -54, 108, 108, 6)
  ctx.stroke()
  ctx.fillStyle = '#fff7f8'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = fontDisplay(36)
  ctx.fillText('大水', 0, -16)
  ctx.fillText('宗印', 0, 24)
  ctx.restore()
}

function drawBottle(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#08243c'
  roundRect(ctx, 44, 0, 32, 16, 4)
  ctx.fill()
  ctx.fillStyle = '#14558f'
  roundRect(ctx, 40, 14, 40, 12, 3)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.strokeStyle = '#08243c'
  ctx.lineWidth = 4
  roundRect(ctx, 48, 24, 24, 20, 4)
  ctx.fill()
  ctx.stroke()
  roundRect(ctx, 18, 44, 84, 140, 28)
  ctx.fill()
  ctx.stroke()
  ctx.save()
  roundRect(ctx, 18, 44, 84, 140, 28)
  ctx.clip()
  const water = ctx.createLinearGradient(0, 90, 0, 184)
  water.addColorStop(0, '#9ae6ff')
  water.addColorStop(1, '#1477d6')
  ctx.fillStyle = water
  ctx.fillRect(18, 96, 84, 90)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.beginPath()
  ctx.ellipse(60, 98, 36, 7, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.restore()
}

export async function drawPoster(
  canvas: HTMLCanvasElement,
  spec: PosterSpec,
  isCurrent: () => boolean = () => true,
): Promise<void> {
  await ensureFonts()
  if (!isCurrent()) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = 1080
  const height = 1440
  ctx.clearRect(0, 0, width, height)

  const bg = ctx.createLinearGradient(0, 0, 0, height)
  bg.addColorStop(0, '#d7f6ff')
  bg.addColorStop(0.42, '#5eb6ee')
  bg.addColorStop(1, '#0c4e90')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)
  drawBubbles(ctx)
  drawWaves(ctx)

  if (spec.frame === 'gold') {
    ctx.strokeStyle = '#f6c445'
    ctx.lineWidth = 22
    ctx.strokeRect(16, 16, width - 32, height - 32)
    ctx.strokeStyle = '#fff6d0'
    ctx.lineWidth = 4
    ctx.strokeRect(32, 32, width - 64, height - 64)
  }

  drawSticker(ctx, width / 2, 92, '全网进入大水时代', -0.05)
  drawBottle(ctx, 48, 1120, 0.72)

  const card = { x: 86, y: 168, w: 908, h: 980 }
  roundRect(ctx, card.x, card.y, card.w, card.h, 46)
  ctx.fillStyle = '#f6fcff'
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = '#08243c'
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#1277c8'
  ctx.font = fontBody(26, 700)
  ctx.fillText('开宗立派证书', card.x + 40, card.y + 36)

  let y = card.y + 168
  ctx.textAlign = 'center'

  const named = spec.sectName.trim().length > 0
  ctx.fillStyle = named ? '#08243c' : '#8aa4b6'
  ctx.font = fontDisplay(72)
  const name = spec.sectName.trim() || '你的宗门名'
  const nameLines = wrap(ctx, name, card.w - 160).slice(0, 2)
  for (const line of nameLines) {
    ctx.fillText(line, width / 2, y)
    y += 84
  }
  y += 8

  const weakReady = spec.weak.trim().length > 0
  const strongReady = spec.strong.trim().length > 0
  const weak = weakReady ? spec.weak.trim() : '＿＿'
  const strong = strongReady ? spec.strong.trim() : '＿＿'
  const sloganReady = weakReady && strongReady
  ctx.font = fontDisplay(46)
  const panelW = card.w - 120
  const panelH = 176
  const panelX = card.x + 60
  roundRect(ctx, panelX, y, panelW, panelH, 28)
  ctx.fillStyle = sloganReady ? '#d7f1ff' : '#e7f2f8'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#08243c'
  ctx.stroke()
  ctx.fillStyle = sloganReady ? '#08243c' : '#7e97aa'
  ctx.font = fontDisplay(48)
  ctx.fillText(`弱者${weak}`, width / 2, y + 32)
  ctx.fillText(`强者${strong}`, width / 2, y + 96)
  y += panelH + 28

  const note = spec.note.trim() || '今日功法：吨吨，其余免谈。'
  ctx.font = fontBody(30, 400)
  ctx.fillStyle = spec.note.trim() ? '#16486e' : '#6e8ea3'
  for (const line of wrap(ctx, note, card.w - 160).slice(0, 3)) {
    ctx.fillText(line, width / 2, y)
    y += 42
  }

  if (spec.marks.length > 0) {
    y += 8
    ctx.font = fontBody(26, 700)
    ctx.fillStyle = '#0d4f93'
    const markText = `今日已交功课：${spec.marks.join(' · ')}`
    for (const line of wrap(ctx, markText, card.w - 160).slice(0, 2)) {
      ctx.fillText(line, width / 2, y)
      y += 36
    }
  }

  ctx.font = fontBody(28, 700)
  ctx.fillStyle = '#08243c'
  ctx.fillText(`${spec.title}   ·   贡献 ${spec.points}`, width / 2, card.y + card.h - 78)

  drawSeal(ctx, card.x + card.w - 108, card.y + 96)

  if (spec.traitor) {
    ctx.save()
    ctx.translate(card.x + 128, card.y + card.h - 150)
    ctx.rotate(0.18)
    roundRect(ctx, -62, -36, 124, 72, 8)
    ctx.fillStyle = 'rgba(215, 38, 61, 0.92)'
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = fontDisplay(24)
    ctx.fillText('饮料宗', 0, -12)
    ctx.fillText('叛徒', 0, 16)
    ctx.restore()
  }

  if (spec.frame === 'gold') {
    drawSticker(ctx, width / 2, card.y + card.h - 6, '七日吨吨 · 开宗礼包', 0.03)
  }

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#f5fbff'
  ctx.font = fontDisplay(32)
  ctx.fillText('大水理论生活教练', 250, 1288)
  ctx.font = fontBody(24, 400)
  ctx.fillText(`${spec.dateLabel} · 玩梗海报，不是医嘱`, 250, 1338)
  ctx.font = fontDisplay(28)
  ctx.fillText('弱者喝饮料，强者喝大水', 250, 1378)
}

export async function posterBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'))
}

export async function sharePoster(blob: Blob, filename: string): Promise<'shared' | 'saved' | 'aborted'> {
  const file = new File([blob], filename, { type: 'image/png' })
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: '开宗立派', text: '全网进入大水时代' })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'aborted'
    }
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
  return 'saved'
}
