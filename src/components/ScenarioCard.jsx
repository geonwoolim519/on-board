import { getCountry } from '../data/countries'
import { getPort } from '../data/ports'
import { getProduct } from '../data/products'
import { formatMoney } from '../data/currencies'

const STARS = { EASY: 2, NORMAL: 3, HARD: 4, EXPERT: 5 }

export default function ScenarioCard({ scenario, onSelect, compact = false }) {
  const origin = getCountry(scenario.sellerCountry)
  const dest = getCountry(scenario.buyerCountry)
  const product = getProduct(scenario.productId)
  const from = getPort(scenario.originPorts[0])
  const to = getPort(scenario.destinationPorts[0])
  const stars = STARS[scenario.difficulty] || 2

  return (
    <article className="flex h-full flex-col rounded-[12px] border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-semibold text-navy">
          {origin.flag} {origin.short} → {dest.flag} {dest.short}
        </p>
        <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-navy-2">
          {scenario.type}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{product.name}</p>
      <p className="mt-1 text-sm text-muted">
        {from.name} → {to.name}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] font-semibold tracking-[0.12em] text-muted">
        <p>{scenario.recommendedTransport}</p>
        <p className="text-right">{formatMoney(scenario.contract.amount, scenario.contract.currency)}</p>
      </div>
      <p className="mt-3 text-sm text-navy" aria-label={`${scenario.difficulty}, ${stars} of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < stars ? 'text-navy' : 'text-line'} aria-hidden="true">
            {index < stars ? '★' : '☆'}
          </span>
        ))}
        <span className="ml-2 text-[11px] tracking-[0.12em] text-muted">{scenario.difficulty}</span>
      </p>
      {!compact ? (
        <button
          type="button"
          onClick={() => onSelect(scenario.id)}
          className="mt-4 cursor-pointer rounded-[10px] bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
        >
          START TRADE
        </button>
      ) : null}
    </article>
  )
}
