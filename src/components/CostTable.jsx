import { formatKRW } from '../data/currencies'
import CountUp from './CountUp'
import SimulationBadge from './SimulationBadge'

export default function CostTable({ items, sellerCost, buyerCost, totalTradeCost, contractKRW, profit, animate = false }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div className="overflow-hidden rounded-[12px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">COST BREAKDOWN</p>
          <SimulationBadge />
        </div>
        <div className="divide-y divide-line">
          {items.map((item) => (
            <div
              key={item.key}
              className={`flex items-center justify-between gap-4 px-5 py-3.5 ${item.krw ? '' : 'opacity-50'}`}
            >
              <div>
                <p className="text-sm text-ink">{item.label}</p>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted">{item.party}</p>
              </div>
              <p className="tabular text-sm font-medium text-navy">
                {animate ? <CountUp value={item.krw} formatter={(n) => formatKRW(n)} /> : formatKRW(item.krw)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[12px] border border-line bg-white p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">SELLER COST</p>
          <p className="mt-2 text-2xl font-semibold tabular text-navy">
            {animate ? <CountUp value={sellerCost} formatter={(n) => formatKRW(n)} /> : formatKRW(sellerCost)}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-white p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">BUYER COST</p>
          <p className="mt-2 text-2xl font-semibold tabular text-navy">
            {animate ? <CountUp value={buyerCost} formatter={(n) => formatKRW(n)} /> : formatKRW(buyerCost)}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-white p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">TOTAL TRADE COST</p>
          <p className="mt-2 text-2xl font-semibold tabular text-navy">
            {animate ? <CountUp value={totalTradeCost} formatter={(n) => formatKRW(n)} /> : formatKRW(totalTradeCost)}
          </p>
        </div>
        <div className="rounded-[12px] border border-line bg-white p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">CONTRACT VALUE</p>
          <p className="mt-2 text-xl font-semibold tabular text-navy">{formatKRW(contractKRW)}</p>
        </div>
        <div className="rounded-[12px] border border-navy bg-navy p-5 text-white">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60">ESTIMATED PROFIT</p>
          <p className={`mt-2 text-3xl font-semibold tabular ${profit < 0 ? 'text-[#fca5a5]' : 'text-white'}`}>
            {animate ? <CountUp value={profit} formatter={(n) => formatKRW(n)} /> : formatKRW(profit)}
          </p>
        </div>
      </div>
    </div>
  )
}
