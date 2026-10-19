import { useId } from 'react'

export function Bottle({ level, label }: { level: number; label?: string }) {
  const raw = useId().replace(/:/g, '')
  const clamped = Math.min(1, Math.max(0, level))
  const top = 158 - clamped * 100

  return (
    <svg className="bottle" viewBox="0 0 120 200" role="img" aria-label={label ?? '大水瓶'}>
      <defs>
        <linearGradient id={`${raw}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#d7f1ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b7e4fb" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${raw}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ae6ff" />
          <stop offset="1" stopColor="#1477d6" />
        </linearGradient>
        <clipPath id={`${raw}-clip`}>
          <rect x="22" y="48" width="76" height="132" rx="26" />
        </clipPath>
      </defs>
      <rect x="44" y="6" width="32" height="14" rx="4" fill="#08243c" />
      <rect x="40" y="18" width="40" height="10" rx="3" fill="#14558f" />
      <path d="M48 28h24v18H48z" fill={`url(#${raw}-glass)`} stroke="#08243c" strokeWidth="3" />
      <rect x="22" y="48" width="76" height="132" rx="26" fill={`url(#${raw}-glass)`} stroke="#08243c" strokeWidth="3" />
      <g clipPath={`url(#${raw}-clip)`}>
        <rect x="22" y={top} width="76" height={190 - top} fill={`url(#${raw}-water)`} />
        <ellipse cx="60" cy={top + 2} rx="34" ry="6" fill="#e9f9ff" opacity="0.9" />
        <circle cx="44" cy={Math.min(168, top + 28)} r="3.2" fill="#fff" opacity="0.75" />
        <circle cx="72" cy={Math.min(172, top + 48)} r="2.2" fill="#fff" opacity="0.65" />
      </g>
      <path d="M34 72c8 8 10 20 5 34" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
    </svg>
  )
}
