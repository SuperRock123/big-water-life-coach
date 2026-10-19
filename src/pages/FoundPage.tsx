import { useEffect, useMemo, useRef, useState } from 'react'
import { THEORIES } from '../data.ts'
import { draftError, formatChineseDate, titleOf, type AppState, type Draft } from '../logic.ts'
import { drawPoster, posterBlob, sharePoster, type PosterSpec } from '../poster.ts'

export function FoundPage({
  state,
  today,
  draft,
  onDraft,
  onFound,
  onToast,
}: {
  state: AppState
  today: string
  draft: Draft
  onDraft: (draft: Draft) => void
  onFound: (draft: Draft) => void
  onToast: (text: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [busy, setBusy] = useState(false)
  const title = titleOf(state.points).name
  const doneKey = (state.checkins[today] ?? []).join(',')

  const spec: PosterSpec = useMemo(
    () => ({
      sectName: draft.name,
      weak: draft.weak,
      strong: draft.strong,
      note: draft.note,
      dateLabel: formatChineseDate(today),
      title,
      points: state.points,
      frame: state.frameUnlocked ? 'gold' : 'classic',
      traitor: state.hiddenTitles.includes('饮料宗叛徒'),
      marks: doneKey
        .split(',')
        .filter(Boolean)
        .map((id) => THEORIES.find((item) => item.id === id)?.short ?? id),
    }),
    [draft, today, title, state.points, state.frameUnlocked, state.hiddenTitles, doneKey],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancel = false
    void drawPoster(canvas, spec, () => !cancel).catch(() => {
      if (!cancel) onToast('海报没画出来。再试一次，或者换个不那么狂的宗门名。')
    })
    return () => {
      cancel = true
    }
  }, [spec, onToast])

  const error = draftError(draft)

  async function save() {
    if (error || busy) return
    const canvas = canvasRef.current
    if (!canvas) return
    setBusy(true)
    try {
      await drawPoster(canvas, spec)
      const blob = await posterBlob(canvas)
      if (!blob) {
        onToast('图片没生成。再盖一次章。')
        return
      }
      const safeName = draft.name.trim().replace(/[\\/:*?"<>|]/g, '') || '宗门'
      const result = await sharePoster(blob, `大水宗-${safeName}.png`)
      if (result === 'aborted') return
      onFound(draft)
      onToast(result === 'shared' ? '海报已送出去。宗门档案也记下了。' : '海报已保存。宗门档案里也能找到。')
    } catch {
      onToast('保存被拦住了。可以长按预览图，或者再点一次。')
    } finally {
      setBusy(false)
    }
  }

  async function copySlogan() {
    if (error) {
      onToast(error)
      return
    }
    const text = `弱者${draft.weak.trim()}，强者${draft.strong.trim()}`
    try {
      await navigator.clipboard.writeText(text)
      onToast('口号已复制。去评论区接龙吧。')
    } catch {
      onToast(text)
    }
  }

  return (
    <section className="page">
      <p className="kicker">一键开宗立派</p>
      <h2>三个空，一张海报</h2>
      <p className="lead">填完就能发朋友圈。视觉统一：大瓶水、伪学术印章、全网进入大水时代。</p>

      <form
        className="found-form"
        onSubmit={(event) => {
          event.preventDefault()
          void save()
        }}
      >
        <label className="field">
          <span>
            宗门名 <em>{draft.name.length}/14</em>
          </span>
          <input
            value={draft.name}
            maxLength={14}
            placeholder="比如 武康路大溜宗"
            onChange={(event) => onDraft({ ...draft, name: event.target.value })}
          />
        </label>
        <div className="slogan-row">
          <label className="field">
            <span>
              弱者 <em>{draft.weak.length}/10</em>
            </span>
            <span className="prefix">
              <span>弱者</span>
              <input
                value={draft.weak}
                maxLength={10}
                placeholder="刷焦虑"
                aria-label="弱者后面的空"
                onChange={(event) => onDraft({ ...draft, weak: event.target.value })}
              />
            </span>
          </label>
          <label className="field">
            <span>
              强者 <em>{draft.strong.length}/10</em>
            </span>
            <span className="prefix">
              <span>强者</span>
              <input
                value={draft.strong}
                maxLength={10}
                placeholder="喝大水"
                aria-label="强者后面的空"
                onChange={(event) => onDraft({ ...draft, strong: event.target.value })}
              />
            </span>
          </label>
        </div>
        <label className="field">
          <span>
            今日碎碎念，可不填 <em>{draft.note.length}/42</em>
          </span>
          <textarea
            value={draft.note}
            maxLength={42}
            rows={2}
            placeholder="今日灌了一瓶，灵魂回潮"
            onChange={(event) => onDraft({ ...draft, note: event.target.value })}
          />
        </label>
        <button type="submit" className="btn" disabled={Boolean(error) || busy}>
          {busy ? '正在盖章…' : '盖章并保存海报'}
        </button>
        <button type="button" className="btn yolk slim" onClick={() => void copySlogan()}>
          复制口号
        </button>
        {error && <p className="form-hint">{error}</p>}
        {state.frameUnlocked && <p className="form-hint gold">金边海报框已解锁，这张会带礼包边。</p>}
      </form>

      <h3 className="section-title">海报预览</h3>
      <canvas ref={canvasRef} width={1080} height={1440} className="poster-canvas" />
      <p className="form-hint">朋友圈竖图。手机上若弹出分享，可以直接丢到聊天里。</p>
    </section>
  )
}
