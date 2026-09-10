import { getCountry } from '../data/countries'
import { getPayment } from '../data/payments'
import { formatMoney } from '../data/currencies'
import SimulationBadge from './SimulationBadge'

export default function TradeSidebar({ trade, scenario, computed }) {
  if (!scenario || !trade) return null
  const origin = getCountry(scenario.sellerCountry)
  const dest = getCountry(scenario.buyerCountry)
  const payment = getPayment(trade.payment)

  return (
    <aside className="rounded-[12px] border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">CURRENT TRADE</p>
        <SimulationBadge />
      </div>
      <p className="mt-3 text-sm font-semibold text-navy">
        {origin.flag} {origin.short}
      </p>
      <p className="text-xs text-muted">↓</p>
      <p className="text-sm font-semibold text-navy">
        {dest.flag} {dest.short}
      </p>
      <p className="mt-3 text-sm text-ink">{computed?.product?.name}</p>
      <p className="mt-1 text-sm font-semibold tabular text-navy">
        {formatMoney(scenario.contract.amount, scenario.contract.currency)}
      </p>
      <dl className="mt-4 space-y-2 text-xs">
        <Row label="INCOTERMS" value={trade.incoterm || '—'} />
        <Row label="TRANSPORT" value={trade.transport || '—'} />
        <Row label="PAYMENT" value={payment?.name || '—'} />
        <Row label="PORT" value={computed?.origin && computed?.destination ? `${computed.origin.name} → ${computed.destination.name}` : '—'} />
      </dl>
    </aside>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="tracking-[0.12em] text-muted">{label}</dt>
      <dd className="text-right font-semibold text-navy">{value}</dd>
    </div>
  )
}
