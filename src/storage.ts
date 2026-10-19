import { THEORIES, type TheoryId } from './data.ts'
import { defaultState, type AppState, type Founded, type OwnedDerived } from './logic.ts'

const KEY = 'big-water-theory-v1'

const IDS = new Set<string>(THEORIES.map((item) => item.id))

function isTheoryId(value: unknown): value is TheoryId {
  return typeof value === 'string' && IDS.has(value)
}

function asCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0
}

function asFounded(value: unknown): Founded | null {
  if (!value || typeof value !== 'object') return null
  const item = value as Partial<Founded>
  if (typeof item.name !== 'string' || typeof item.weak !== 'string' || typeof item.strong !== 'string') return null
  return {
    id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
    name: item.name,
    weak: item.weak,
    strong: item.strong,
    note: typeof item.note === 'string' ? item.note : '',
    date: typeof item.date === 'string' ? item.date : '',
    frame: item.frame === 'gold' ? 'gold' : 'classic',
  }
}

function asDerived(value: unknown): OwnedDerived | null {
  if (!value || typeof value !== 'object') return null
  const item = value as Partial<OwnedDerived>
  if (typeof item.name !== 'string' || typeof item.blurb !== 'string') return null
  return {
    id: typeof item.id === 'string' ? item.id : item.name,
    name: item.name,
    blurb: item.blurb,
    date: typeof item.date === 'string' ? item.date : '',
  }
}

export function normalize(raw: unknown): AppState {
  const base = defaultState()
  if (!raw || typeof raw !== 'object') return base
  const data = raw as Partial<AppState>
  const counts = data.counts ?? base.counts
  const checkins: Record<string, TheoryId[]> = {}
  if (data.checkins && typeof data.checkins === 'object') {
    for (const [key, value] of Object.entries(data.checkins)) {
      if (!Array.isArray(value)) continue
      const ids = value.filter(isTheoryId)
      if (ids.length) checkins[key] = ids
    }
  }
  return {
    points: asCount(data.points),
    checkins,
    counts: {
      water: asCount(counts.water),
      sleep: asCount(counts.sleep),
      stroll: asCount(counts.stroll),
      veggie: asCount(counts.veggie),
      drama: asCount(counts.drama),
    },
    hiddenTitles: Array.isArray(data.hiddenTitles) ? data.hiddenTitles.filter((item) => typeof item === 'string') : [],
    founded: Array.isArray(data.founded) ? data.founded.map(asFounded).filter((item): item is Founded => item !== null) : [],
    derived: Array.isArray(data.derived) ? data.derived.map(asDerived).filter((item): item is OwnedDerived => item !== null) : [],
    streak: asCount(data.streak),
    lastActiveDate: typeof data.lastActiveDate === 'string' ? data.lastActiveDate : null,
    frameUnlocked: Boolean(data.frameUnlocked),
    repentDates: Array.isArray(data.repentDates) ? data.repentDates.filter((item) => typeof item === 'string') : [],
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    return normalize(JSON.parse(raw) as unknown)
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY)
}
