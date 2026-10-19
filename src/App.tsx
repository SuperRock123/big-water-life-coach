import { useCallback, useEffect, useState } from 'react'
import { Bottle } from './components/Bottle.tsx'
import { TeaModal } from './components/TeaModal.tsx'
import { THEORIES, type TheoryId } from './data.ts'
import {
  applyCheckIn,
  daysUntilFrame,
  defaultState,
  effectiveStreak,
  embrace,
  emptyDraft,
  foundSect,
  repent,
  titleOf,
  todayKey,
  type AppState,
  type Draft,
  type Founded,
} from './logic.ts'
import { ArchivePage } from './pages/ArchivePage.tsx'
import { FoundPage } from './pages/FoundPage.tsx'
import { TodayPage } from './pages/TodayPage.tsx'
import { WikiPage } from './pages/WikiPage.tsx'
import { clearState, loadState, saveState } from './storage.ts'

type Tab = 'today' | 'archive' | 'found' | 'wiki'

interface Toast {
  id: string
  text: string
}

function probeStorage(): boolean {
  try {
    const key = 'big-water-theory-probe'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: '功课', icon: '💧' },
  { id: 'archive', label: '档案', icon: '📜' },
  { id: 'found', label: '开宗', icon: '🚩' },
  { id: 'wiki', label: '百科', icon: '📖' },
]

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<Tab>('today')
  const [today, setToday] = useState(() => todayKey())
  const [draft, setDraft] = useState<Draft>(() => emptyDraft())
  const [toasts, setToasts] = useState<Toast[]>([])
  const [teaOpen, setTeaOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [storageOk] = useState(probeStorage)
  const [flash, setFlash] = useState(0)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const sync = () => setToday(todayKey())
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  const push = useCallback((texts: string[]) => {
    const items = texts.filter(Boolean).map((text) => ({ id: crypto.randomUUID(), text }))
    if (items.length === 0) return
    setToasts((prev) => [...prev, ...items].slice(-4))
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => !items.some((next) => next.id === item.id)))
    }, 4200)
  }, [])

  const toast = useCallback((text: string) => push([text]), [push])

  function run(
    mutator: (prev: AppState) => { state: AppState; toasts: string[]; already?: boolean },
    celebrate = false,
  ) {
    let already = false
    let lines: string[] = []
    setState((prev) => {
      const result = mutator(prev)
      already = Boolean(result.already)
      lines = result.toasts
      return result.state
    })
    queueMicrotask(() => {
      push(lines)
      if (celebrate && !already) setFlash((value) => value + 1)
    })
  }

  function onCheck(id: TheoryId) {
    run((prev) => applyCheckIn(prev, id, today), true)
  }

  function onRepent() {
    run((prev) => repent(prev, today))
  }

  function onEmbrace() {
    run((prev) => embrace(prev))
  }

  function onFound(nextDraft: Draft) {
    setState((prev) => foundSect(prev, nextDraft, today))
  }

  function onReprint(item: Founded) {
    setDraft({ name: item.name, weak: item.weak, strong: item.strong, note: item.note })
    setTab('found')
  }

  const closeTea = useCallback(() => {
    setTeaOpen(false)
  }, [])

  const title = titleOf(state.points)
  const streak = effectiveStreak(state, today)
  const done = (state.checkins[today] ?? []).length
  const frameDays = daysUntilFrame(state, today)

  return (
    <div className="world">
      <div className="bubbles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <aside className="billboard">
        <p className="kicker">宗门公告 · 贴在水房门口</p>
        <h2>
          弱者喝饮料
          <br />
          强者喝大水
        </h2>
        <Bottle level={done / THEORIES.length} label="今日大水瓶" />
        <ul className="stickers">
          <li>全网进入大水时代</li>
          <li>只有睡觉是越睡越幸福</li>
          <li>焦虑都是短剧看少了</li>
        </ul>
        <p className="billboard-copy">
          现在是「{title.name}」，贡献 {state.points}，连续吨吨 {streak} 天。
          {frameDays === null ? '金边海报框已经在你包里。' : `再连吨 ${frameDays} 天有开宗礼包。`}
        </p>
        <p className="billboard-copy dim">
          左边这些不是医嘱。渴了喝水，困了去睡，嘴馋了就点奶茶按钮接受审判。
        </p>
      </aside>

      <main className="app">
        <header className="top">
          <div className="top-row">
            <div>
              <p className="kicker">伪学术营业中 · 不是医嘱</p>
              <h1>大水理论生活教练</h1>
            </div>
            <button type="button" className="boba-btn" onClick={() => setTeaOpen(true)}>
              <span aria-hidden="true">🧋</span>
              偷喝
            </button>
          </div>
          <div className="pills">
            <span className="pill title">{title.name}</span>
            <span className="pill">贡献 {state.points}</span>
            <span className="pill">连续 {streak} 天</span>
          </div>
          {!storageOk && <p className="storage-banner">这个浏览器不让记功，刷新会失忆。先玩着。</p>}
        </header>

        <div className="scroll">
          {tab === 'today' && (
            <TodayPage state={state} today={today} flash={flash} onCheck={onCheck} onTea={() => setTeaOpen(true)} onToast={toast} />
          )}
          {tab === 'archive' && (
            <ArchivePage state={state} today={today} onReprint={onReprint} onReset={() => setResetOpen(true)} />
          )}
          {tab === 'found' && (
            <FoundPage state={state} today={today} draft={draft} onDraft={setDraft} onFound={onFound} onToast={toast} />
          )}
          {tab === 'wiki' && <WikiPage state={state} />}
        </div>

        <nav className="tabbar" aria-label="宗门导航">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? 'active' : ''}
              aria-current={tab === item.id ? 'page' : undefined}
              onClick={() => setTab(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="toasts" aria-live="polite">
          {toasts.map((item) => (
            <p key={item.id}>{item.text}</p>
          ))}
        </div>
      </main>

      {teaOpen && (
        <TeaModal
          alreadyTraitor={state.hiddenTitles.includes('饮料宗叛徒')}
          onClose={closeTea}
          onRepent={onRepent}
          onEmbrace={onEmbrace}
          onFinishRepent={() => {
            setTeaOpen(false)
            setTab('today')
          }}
          onFinishTraitor={() => {
            setTeaOpen(false)
            setTab('archive')
          }}
        />
      )}

      {resetOpen && (
        <div className="reset-screen" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="reset-card">
            <h2 id="reset-title">把吨吨记录倒掉？</h2>
            <p>头衔、贡献、海报记录、叛徒印章，会一起从这台设备消失。倒掉就真的没了。</p>
            <div className="tea-actions">
              <button type="button" className="btn yolk" onClick={() => setResetOpen(false)}>
                再想想
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  clearState()
                  setState(defaultState())
                  setDraft(emptyDraft())
                  setResetOpen(false)
                  setTab('today')
                  toast('记忆倒干净了。杯子是空的，人还在。')
                }}
              >
                倒掉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
