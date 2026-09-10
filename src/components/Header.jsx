import Logo from './Logo'
import { useTrade } from '../context/TradeContext'

export default function Header() {
  const { view, trade, goHome, goHistory, goChoose, step } = useTrade()
  const inSim = view === 'simulator' || view === 'briefing'
  const status = view === 'briefing' ? 'BRIEFING' : step === 7 ? 'CLOSED' : 'IN PROGRESS'

  return (
    <header className="sticky top-0 z-30 h-[64px] border-b border-line bg-white/90 backdrop-blur-md md:h-[72px]">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 md:px-6">
        <button type="button" onClick={goHome} className="flex cursor-pointer items-center" aria-label="ON BOARD">
          <Logo compact />
        </button>

        {inSim && trade ? (
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted">CURRENT TRADE</p>
              <p className="text-sm font-semibold text-navy">TRADE #{trade.id}</p>
            </div>
            <span className="hidden h-8 w-px bg-line sm:block" />
            <span className="hidden rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-navy-2 sm:inline">
              {status}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button type="button" onClick={goHistory} className="text-[11px] font-semibold tracking-[0.14em] text-navy-2">
              MY TRADES
            </button>
            <button type="button" onClick={goChoose} className="text-[11px] font-semibold tracking-[0.14em] text-accent">
              NEW TRADE
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
