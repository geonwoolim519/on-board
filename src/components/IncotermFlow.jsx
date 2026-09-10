import { getIncoterm } from '../data/incoterms'
import { useTrade } from '../context/TradeContext'

export default function IncotermFlow({ incoterm }) {
  const { computed } = useTrade()
  const term = getIncoterm(incoterm)
  if (!term) return null
  const origin = computed?.origin?.name || 'Origin'
  const dest = computed?.destination?.name || 'Destination'

  return (
    <div className="rounded-[12px] border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-navy">
          {term.name} {origin.toUpperCase()}
        </p>
        <span className="rounded-full bg-bg px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-navy-2">
          {term.group === 'SEA' ? 'SEA / WATERWAY' : 'ANY MODE'}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{term.note}</p>
      <p className="mt-1 text-xs text-muted">Named place context: {origin} → {dest}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <FlowColumn title="SELLER" items={term.sellerSteps} />
        <div className="flex flex-col items-center justify-center py-2">
          <div className="rounded-full border border-accent px-3 py-2 text-center">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-accent">RISK TRANSFER</p>
            <p className="mt-1 text-xs text-navy">{term.riskTransfer}</p>
          </div>
        </div>
        <FlowColumn title="BUYER" items={term.buyerSteps} />
      </div>
    </div>
  )
}

function FlowColumn({ title, items }) {
  return (
    <div className="rounded-[10px] border border-line bg-bg/70 p-4">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-navy">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
