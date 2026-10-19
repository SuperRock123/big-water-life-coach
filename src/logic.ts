import { DAILY_QUOTES, DERIVED, THEORIES, TITLE_LADDER, type TheoryId } from './data.ts'

export interface Founded {
  id: string
  name: string
  weak: string
  strong: string
  note: string
  date: string
  frame: 'classic' | 'gold'
}

export interface OwnedDerived {
  id: string
  name: string
  blurb: string
  date: string
}

export interface Counts {
  water: number
  sleep: number
  stroll: number
  veggie: number
  drama: number
}

export interface AppState {
  points: number
  checkins: Record<string, TheoryId[]>
  counts: Counts
  hiddenTitles: string[]
  founded: Founded[]
  derived: OwnedDerived[]
  streak: number
  lastActiveDate: string | null
  frameUnlocked: boolean
  repentDates: string[]
}

export interface Draft {
  name: string
  weak: string
  strong: string
  note: string
}

export interface ActionResult {
  state: AppState
  toasts: string[]
  already?: boolean
}

export function defaultState(): AppState {
  return {
    points: 0,
    checkins: {},
    counts: { water: 0, sleep: 0, stroll: 0, veggie: 0, drama: 0 },
    hiddenTitles: [],
    founded: [],
    derived: [],
    streak: 0,
    lastActiveDate: null,
    frameUnlocked: false,
    repentDates: [],
  }
}

export function todayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function shiftDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1)
  dt.setDate(dt.getDate() + delta)
  return todayKey(dt)
}

export function formatChineseDate(key: string): string {
  const [y, m, d] = key.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

export function weekdayLabel(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const names = ['日', '一', '二', '三', '四', '五', '六']
  return names[new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1).getDay()] ?? ''
}

export function quoteFor(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1)
  const start = new Date(y ?? 2026, 0, 0)
  const n = Math.floor((dt.getTime() - start.getTime()) / 86400000)
  const index = ((n % DAILY_QUOTES.length) + DAILY_QUOTES.length) % DAILY_QUOTES.length
  return DAILY_QUOTES[index] ?? DAILY_QUOTES[0]!
}

export function titleOf(points: number) {
  let current = TITLE_LADDER[0]!
  for (const step of TITLE_LADDER) {
    if (points >= step.min) current = step
  }
  return current
}

export function nextTitle(points: number) {
  return TITLE_LADDER.find((step) => step.min > points) ?? null
}

export function effectiveStreak(state: AppState, today: string): number {
  if (!state.lastActiveDate) return 0
  if (state.lastActiveDate === today || state.lastActiveDate === shiftDays(today, -1)) {
    return state.streak
  }
  return 0
}

export function daysUntilFrame(state: AppState, today: string): number | null {
  if (state.frameUnlocked) return null
  const streak = effectiveStreak(state, today)
  const mod = streak % 7
  return mod === 0 ? 7 : 7 - mod
}

export function emptyDraft(): Draft {
  return { name: '', weak: '', strong: '', note: '' }
}

export function draftError(draft: Draft): string | null {
  if (!draft.name.trim()) return '宗门名还空着。'
  if (!draft.weak.trim() || !draft.strong.trim()) return '口号两个空都要填，不然对仗会瘸。'
  return null
}

function theoryById(id: TheoryId) {
  const found = THEORIES.find((item) => item.id === id)
  if (!found) throw new Error(`unknown theory ${id}`)
  return found
}

function withHidden(state: AppState): { state: AppState; toasts: string[] } {
  const have = new Set(state.hiddenTitles)
  const toasts: string[] = []
  const grant = (name: string, line: string) => {
    if (have.has(name)) return
    have.add(name)
    toasts.push(line)
  }
  if (state.counts.sleep >= 3) grant('大睡真神', '隐藏称号解锁：大睡真神。被子认你当掌门。')
  if (state.counts.stroll >= 3) grant('武康路无声舞王', '隐藏称号解锁：武康路无声舞王。请继续无声。')
  if (state.counts.drama >= 3) grant('短剧治愈师', '隐藏称号解锁：短剧治愈师。文艺b已临床康复。')
  return { state: { ...state, hiddenTitles: [...have] }, toasts }
}

function withStreakGift(state: AppState, previousStreak: number, today: string): { state: AppState; toasts: string[] } {
  if (state.streak === previousStreak || state.streak % 7 !== 0 || state.streak === 0) {
    return { state, toasts: [] }
  }
  const owned = new Set(state.derived.map((item) => item.id))
  const pool = DERIVED.filter((item) => !owned.has(item.id))
  const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : undefined
  const derived = pick ? [...state.derived, { ...pick, date: today }] : state.derived
  const toast = pick
    ? `连续吨吨 ${state.streak} 天。开宗礼包：金边海报框 +「${pick.name}」。`
    : `连续吨吨 ${state.streak} 天。金边还在，衍生理论你已经集齐了。`
  return {
    state: { ...state, derived, frameUnlocked: true },
    toasts: [toast],
  }
}

export function applyCheckIn(state: AppState, id: TheoryId, today: string): ActionResult {
  const done = state.checkins[today] ?? []
  if (done.includes(id)) {
    return { state, toasts: ['这门功课今天交过了，不用吨第二遍。'], already: true }
  }
  const theory = theoryById(id)
  const counts = { ...state.counts, [id]: state.counts[id] + 1 }
  let streak = state.streak
  let lastActiveDate = state.lastActiveDate
  if (lastActiveDate !== today) {
    streak = lastActiveDate === shiftDays(today, -1) ? state.streak + 1 : 1
    lastActiveDate = today
  }
  const checkins = pruneCheckins({ ...state.checkins, [today]: [...done, id] }, today)
  let next: AppState = {
    ...state,
    points: state.points + theory.points,
    counts,
    streak,
    lastActiveDate,
    checkins,
  }
  const toasts = [theory.success]
  const before = titleOf(state.points).name
  const after = titleOf(next.points).name
  if (before !== after) toasts.push(`头衔飘上来了：${after}`)
  const hidden = withHidden(next)
  next = hidden.state
  toasts.push(...hidden.toasts)
  const gift = withStreakGift(next, state.streak, today)
  next = gift.state
  toasts.push(...gift.toasts)
  return { state: next, toasts }
}

function pruneCheckins(checkins: Record<string, TheoryId[]>, today: string) {
  const cutoff = shiftDays(today, -120)
  const next: Record<string, TheoryId[]> = {}
  for (const [key, value] of Object.entries(checkins)) {
    if (key >= cutoff) next[key] = value
  }
  return next
}

export function repent(state: AppState, today: string): ActionResult {
  if (state.repentDates.includes(today)) {
    return { state, toasts: ['今天已经悔过了。水还在，人别反复戏剧化。'] }
  }
  return {
    state: { ...state, repentDates: [...state.repentDates, today].slice(-60) },
    toasts: ['准你回宗。杯子倒掉，灌上大水。刚才那口，就当误入旁门。'],
  }
}

export function embrace(state: AppState): ActionResult {
  if (state.hiddenTitles.includes('饮料宗叛徒')) {
    return { state, toasts: ['叛徒身份还在，不用再叛一次。甜的那派已经认得你了。'] }
  }
  return {
    state: { ...state, hiddenTitles: [...state.hiddenTitles, '饮料宗叛徒'] },
    toasts: ['隐藏称号已盖章：饮料宗叛徒。档案里可以显摆。'],
  }
}

export function foundSect(state: AppState, draft: Draft, today: string): AppState {
  const item: Founded = {
    id: crypto.randomUUID(),
    name: draft.name.trim(),
    weak: draft.weak.trim(),
    strong: draft.strong.trim(),
    note: draft.note.trim(),
    date: today,
    frame: state.frameUnlocked ? 'gold' : 'classic',
  }
  return { ...state, founded: [item, ...state.founded].slice(0, 20) }
}

export function hiddenProgress(state: AppState, id: 'traitor' | 'sleep' | 'stroll' | 'drama'): { current: number; goal: number } {
  if (id === 'traitor') return { current: state.hiddenTitles.includes('饮料宗叛徒') ? 1 : 0, goal: 1 }
  if (id === 'sleep') return { current: Math.min(3, state.counts.sleep), goal: 3 }
  if (id === 'stroll') return { current: Math.min(3, state.counts.stroll), goal: 3 }
  return { current: Math.min(3, state.counts.drama), goal: 3 }
}
