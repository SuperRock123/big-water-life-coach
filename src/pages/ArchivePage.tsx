import { HIDDEN_CATALOG, TITLE_LADDER } from '../data.ts'
import {
  daysUntilFrame,
  effectiveStreak,
  formatChineseDate,
  hiddenProgress,
  nextTitle,
  titleOf,
  type AppState,
  type Founded,
} from '../logic.ts'

export function ArchivePage({
  state,
  today,
  onReprint,
  onReset,
}: {
  state: AppState
  today: string
  onReprint: (item: Founded) => void
  onReset: () => void
}) {
  const title = titleOf(state.points)
  const upcoming = nextTitle(state.points)
  const span = upcoming ? upcoming.min - title.min : 1
  const progress = upcoming ? Math.min(1, (state.points - title.min) / span) : 1
  const streak = effectiveStreak(state, today)
  const frameDays = daysUntilFrame(state, today)
  const broken = state.streak > 0 && streak === 0

  return (
    <section className="page">
      <div className="seal-card">
        <div className="seal" aria-hidden="true">
          <span>大水</span>
          <span>宗印</span>
        </div>
        <p className="kicker">当前头衔</p>
        <h2>{title.name}</h2>
        <p className="quote">{title.line}</p>
        <p className="points-lg">
          贡献 <strong>{state.points}</strong>
        </p>
        {upcoming ? (
          <div className="track">
            <div className="track-bar" style={{ width: `${progress * 100}%` }} />
            <p>
              距「{upcoming.name}」还差 {upcoming.min - state.points} 点
            </p>
          </div>
        ) : (
          <p className="quote">阶梯到头了。再吨，是为了好玩，不是为了升级。</p>
        )}
      </div>

      <div className="stat-row">
        <div>
          <strong>{streak}</strong>
          <span>连续吨吨</span>
        </div>
        <div>
          <strong>{state.founded.length}</strong>
          <span>已立宗门</span>
        </div>
        <div>
          <strong>{state.repentDates.length}</strong>
          <span>悔过次数</span>
        </div>
      </div>
      {broken && <p className="hint">昨天的吨断了。再打一次卡，连续记录从 1 重新计。</p>}
      {frameDays !== null && (
        <p className="hint">再连续吨吨 {frameDays} 天，解锁金边海报框和一门随机衍生理论。</p>
      )}
      {state.frameUnlocked && <p className="hint gold">开宗礼包已拆：海报会带金边。衍生理论在下面，也在百科里。</p>}

      <h3 className="section-title">头衔阶梯</h3>
      <ol className="ladder">
        {TITLE_LADDER.map((step) => {
          const reached = state.points >= step.min
          const current = step.name === title.name
          return (
            <li key={step.name} className={current ? 'is-current' : reached ? 'is-reached' : ''}>
              <span>{step.min}</span>
              <div>
                <strong>{step.name}</strong>
                <em>{step.line}</em>
              </div>
            </li>
          )
        })}
      </ol>

      <h3 className="section-title">隐藏称号</h3>
      <ul className="hidden-list">
        {HIDDEN_CATALOG.map((item) => {
          const owned = state.hiddenTitles.includes(item.name)
          const prog = hiddenProgress(state, item.id)
          return (
            <li key={item.id} className={owned ? 'is-owned' : ''}>
              <strong>{owned ? item.name : '？？？'}</strong>
              <span>{owned ? '已盖章' : `${item.hint}（${prog.current}/${prog.goal}）`}</span>
            </li>
          )
        })}
      </ul>

      <h3 className="section-title">已创立的理论</h3>
      {state.founded.length === 0 && state.derived.length === 0 ? (
        <p className="empty">还没开宗。去「开宗」填三个空，海报会把你写进朋友圈。</p>
      ) : (
        <ul className="founded">
          {state.derived.map((item) => (
            <li key={item.id}>
              <p className="kicker">七日礼包 · 衍生</p>
              <h3>{item.name}</h3>
              <p>{item.blurb}</p>
            </li>
          ))}
          {state.founded.map((item) => (
            <li key={item.id}>
              <p className="kicker">
                {item.date ? formatChineseDate(item.date) : '某日'}
                {item.frame === 'gold' ? ' · 金边' : ''}
              </p>
              <h3>{item.name}</h3>
              <p className="slogan">
                弱者{item.weak}，强者{item.strong}
              </p>
              {item.note && <p>{item.note}</p>}
              <button type="button" className="text-btn dark" onClick={() => onReprint(item)}>
                再盖一张
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="text-btn danger" onClick={onReset}>
        倒掉宗门记忆
      </button>
    </section>
  )
}
