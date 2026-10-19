import { useEffect, useState } from 'react'
import { TEA_LINES } from '../data.ts'

type Phase = 'accuse' | 'repent' | 'traitor'

export function TeaModal({
  alreadyTraitor,
  onClose,
  onRepent,
  onEmbrace,
  onFinishRepent,
  onFinishTraitor,
}: {
  alreadyTraitor: boolean
  onClose: () => void
  onRepent: () => void
  onEmbrace: () => void
  onFinishRepent: () => void
  onFinishTraitor: () => void
}) {
  const [phase, setPhase] = useState<Phase>('accuse')
  const [line] = useState(() => TEA_LINES[Math.floor(Math.random() * TEA_LINES.length)] ?? TEA_LINES[0]!)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="tea-screen" role="dialog" aria-modal="true" aria-labelledby="tea-title">
      <div className="tea-card">
        <p className="tea-kicker">当场被抓获 · 旁门雷达</p>
        <div className="boba-hero" aria-hidden="true">
          🧋<span>弱</span>
        </div>
        {phase === 'accuse' && (
          <>
            <h2 id="tea-title" className="catchphrase">
              弱者喝饮料
              <br />
              强者喝大水
            </h2>
            <p className="tea-line">{line}</p>
            {alreadyTraitor && <p className="tea-line dim">叛徒档案还在。再喝一口，也不会更叛。</p>}
            <div className="tea-actions">
              <button
                type="button"
                className="btn yolk"
                onClick={() => {
                  onRepent()
                  setPhase('repent')
                }}
              >
                悔过，改喝大水
              </button>
              <button
                type="button"
                className="btn ghost light"
                onClick={() => {
                  onEmbrace()
                  setPhase('traitor')
                }}
              >
                我就弱，怎么了
              </button>
              <button type="button" className="text-btn" onClick={onClose}>
                我只是路过，先关掉
              </button>
            </div>
          </>
        )}
        {phase === 'repent' && (
          <>
            <h2 id="tea-title" className="catchphrase">
              准你回宗
            </h2>
            <p className="tea-line">杯子倒掉，灌上大水。刚才那口，宗门就当没看见。看是看见了，但可以不记仇。</p>
            <div className="tea-actions">
              <button type="button" className="btn yolk" onClick={onFinishRepent}>
                去喝大水
              </button>
            </div>
          </>
        )}
        {phase === 'traitor' && (
          <>
            <h2 id="tea-title" className="catchphrase">
              饮料宗叛徒
            </h2>
            <p className="tea-line">隐藏称号已盖章。叛徒也是一种宗门，只是比较甜，比较没骨气。档案里可以看。</p>
            <div className="tea-actions">
              <button type="button" className="btn yolk" onClick={onFinishTraitor}>
                去档案显摆
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
