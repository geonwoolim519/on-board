import { Ship } from 'lucide-react'

export default function RouteVisual() {
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-line bg-navy p-6 text-white">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60">GLOBAL TRADE ROUTE</p>
      <div className="mt-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-white/50">ORIGIN</p>
          <p className="mt-1 text-lg font-semibold">BUSAN</p>
          <p className="text-xs text-white/50">KOREA</p>
        </div>
        <div className="relative mx-3 hidden flex-1 sm:block">
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-[#60a5fa] to-white/20" />
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-2">
            <Ship className="h-4 w-4 text-[#60a5fa]" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50">DESTINATION</p>
          <p className="mt-1 text-lg font-semibold">LOS ANGELES</p>
          <p className="text-xs text-white/50">USA</p>
        </div>
      </div>
      <svg className="mt-8 h-16 w-full" viewBox="0 0 400 64" fill="none" aria-hidden>
        <path
          d="M8 44 C 90 8, 310 8, 392 44"
          stroke="#60a5fa"
          strokeWidth="1.4"
          strokeDasharray="4 6"
          opacity="0.85"
        />
        <circle cx="8" cy="44" r="3.5" fill="#60a5fa" />
        <circle cx="392" cy="44" r="3.5" fill="#ffffff" />
      </svg>
    </div>
  )
}
