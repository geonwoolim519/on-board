import { Check } from 'lucide-react'
import { STEPS } from '../data/tradeData'
import { useTrade } from '../context/TradeContext'

export default function ProgressBar() {
  const { step } = useTrade()

  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 md:px-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-navy-2">
          STEP {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </p>
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted md:hidden">
          {STEPS[step]?.label}
        </p>
      </div>
      <div className="overflow-x-auto">
        <ol className="mx-auto flex max-w-[1280px] min-w-[720px] items-center gap-0 px-4 pb-4 md:min-w-0 md:px-6">
          {STEPS.map((item, index) => {
            const done = index < step
            const current = index === step
            return (
              <li key={item.key} className="flex flex-1 items-center">
                <div className="flex min-w-0 flex-col items-center gap-1.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                      current
                        ? 'border-accent bg-accent text-white'
                        : done
                          ? 'border-navy bg-navy text-white'
                          : 'border-line bg-white text-muted'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[10px] font-semibold tracking-[0.12em] ${
                      current ? 'text-accent' : done ? 'text-navy' : 'text-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <span
                    className={`mx-1 mb-4 h-px flex-1 ${done ? 'bg-navy' : 'bg-line'}`}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
