import { THEORIES } from '../data.ts'
import type { AppState } from '../logic.ts'

export function WikiPage({ state }: { state: AppState }) {
  return (
    <section className="page">
      <p className="kicker">理论百科 · 只读玩梗</p>
      <h2>正经包装，荒诞内核</h2>
      <p className="lead">核心就三个字：爱自己。剩下的都是口号。这里没有医疗建议，没有卡路里，没有人来收你学费。</p>
      {THEORIES.map((theory) => (
        <article key={theory.id} className="wiki-card">
          <header>
            <span className="mark" style={{ background: theory.tint }}>
              {theory.emoji}
            </span>
            <h3>{theory.name}</h3>
          </header>
          <p>{theory.doctrine}</p>
          <p className="aside">{theory.aside}</p>
          <p className="task-line">今日功课：{theory.task}</p>
        </article>
      ))}
      {state.derived.length > 0 && <h3 className="section-title">你拆出来的衍生理论</h3>}
      {state.derived.map((item) => (
        <article key={item.id} className="wiki-card derived">
          <header>
            <span className="mark">🎁</span>
            <h3>{item.name}</h3>
          </header>
          <p>{item.blurb}</p>
          <p className="aside">连续吨吨七日的礼包，不算正统，但宗门认。</p>
        </article>
      ))}
      <p className="footnote">本百科不含任何医疗建议。喝水、睡觉、吃饭、溜达，是生活，不是处方。</p>
    </section>
  )
}
