export default function ScoreGauge({ score, max = 100 }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, score / max))
  const offset = circumference * (1 - progress)

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 140 140" className="h-full w-40 -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#2563EB"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-semibold tabular text-navy">{score}</p>
        <p className="text-xs tracking-[0.16em] text-muted">/ {max}</p>
      </div>
    </div>
  )
}
