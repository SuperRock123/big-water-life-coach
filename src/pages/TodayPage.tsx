import { ROASTS, THEORIES, type TheoryId } from '../data.ts'
import { effectiveStreak, formatChineseDate, quoteFor, weekdayLabel, type AppState } from '../logic.ts'
import { Bottle } from '../components/Bottle.tsx'

export function TodayPage({
  state,
  today,
  flash,
  onCheck,
  onTea,
  onToast,
}: {
  state: AppState
  today: string
  flash: number
  onCheck: (id: TheoryId) => void
  onTea: () => void
  onToast: (text: string) => void
}) {
  const done = state.checkins[today] ?? []
  const level = done.length / THEORIES.length
  const streak = effectiveStreak(state, today)
  const fresh = state.points === 0 && state.founded.length === 0

  return (
    <section className="page">
      <div className={flash > 0 ? 'hero flash' : 'hero'} key={flash}>
        <Bottle level={level} label={`今日功课完成 ${done.length} / ${THEORIES.length}`} />
        <div>
          <p className="kicker">
            {formatChineseDate(today)} 周{weekdayLabel(today)}
          </p>
          <h2>今日功课</h2>
          <p className="quote">{quoteFor(today)}</p>
          <p className="meter">
            瓶里 {done.length}/{THEORIES.length}
            <span>连续吨吨 {streak} 天</span>
          </p>
        </div>
      </div>

      {fresh && (
        <p className="hint">三件事就能玩：打卡、被奶茶弹窗骂、开宗出海报。进度记在这台手机里。</p>
      )}

      {done.length === THEORIES.length && (
        <div className="perfect">
          <strong>五门功课圆满</strong>
          <p>你今天已经不太像个凡人。可以去开宗，也可以再偷喝一口找骂。</p>
        </div>
      )}

      <ul className="missions">
        {THEORIES.map((theory) => {
          const checked = done.includes(theory.id)
          return (
            <li key={theory.id} className={checked ? 'mission is-done' : 'mission'}>
              <span className="mark" style={{ background: checked ? 'rgba(255,255,255,.18)' : theory.tint }}>
                {theory.emoji}
              </span>
              <div>
                <div className="mission-top">
                  <h3>{theory.name}</h3>
                  <span className="pts">+{theory.points}</span>
                </div>
                <p>{theory.task}</p>
                <button type="button" className="do" disabled={checked} onClick={() => onCheck(theory.id)}>
                  {checked ? theory.doneLabel : theory.action}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {done.length < THEORIES.length && (
        <button
          type="button"
          className="text-btn dark"
          onClick={() => onToast(ROASTS[Math.floor(Math.random() * ROASTS.length)] ?? ROASTS[0]!)}
        >
          我今天摆了，阴阳我一句
        </button>
      )}

      <button type="button" className="tempt" onClick={onTea}>
        <span className="tempt-emoji" aria-hidden="true">
          🧋
        </span>
        <span>
          <strong>嘴馋预警</strong>
          <em>我还是喝了奶茶 / 饮料</em>
        </span>
      </button>
    </section>
  )
}
