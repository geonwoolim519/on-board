import { TrendingUp } from 'lucide-react'
import Button from '../components/Button'
import SimulationBadge from '../components/SimulationBadge'
import StepLayout from '../components/StepLayout'
import { formatKRW, formatMoney, getCurrency } from '../data/currencies'
import { useTrade } from '../context/TradeContext'

export default function StepFx() {
  const { trade, scenario, computed, updateTrade, nextStep, prevStep, canGoNext } = useTrade()
  const currency = scenario.contract.currency
  const meta = getCurrency(currency)
  const rate = Number(trade.exchangeRate) || 0

  return (
    <StepLayout
      kicker="STEP 05"
      title="현재 환율을 확인하세요."
      description="계약통화를 원화로 환산합니다. 환율을 바꾸면 비용과 이익이 즉시 다시 계산됩니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → COST"
      nextDisabled={!canGoNext}
    >
      <div className="mb-3">
        <SimulationBadge />
      </div>
      <div className="rounded-[12px] border border-line bg-white p-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted">{currency} / KRW</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <p className="text-3xl font-semibold tabular text-navy">1 {currency}</p>
          <p className="pb-1 text-muted">=</p>
          <p className="text-3xl font-semibold tabular text-navy">₩{rate.toLocaleString('en-US')}</p>
        </div>
        <label className="mt-6 block">
          <span className="text-[11px] font-semibold tracking-[0.16em] text-muted">APPLY RATE</span>
          <input
            type="number"
            min="0"
            step="any"
            value={trade.exchangeRate}
            onChange={(e) => updateTrade({ exchangeRate: Number(e.target.value) })}
            className="mt-2 w-full rounded-[8px] border border-line bg-bg px-4 py-3 text-2xl font-semibold tabular text-navy outline-none ring-accent/20 focus:border-accent focus:ring-2"
          />
        </label>
      </div>

      <div className="mt-4 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-warn">
              <TrendingUp className="h-4 w-4" />
              MARKET UPDATE
            </p>
            <p className="mt-2 text-sm text-ink">시뮬레이션 시장 환율이 변동했습니다.</p>
            <p className="mt-1 text-lg font-semibold tabular text-navy">
              1 {currency} = ₩{meta.marketKrw.toLocaleString('en-US')}
            </p>
          </div>
          <Button variant="secondary" onClick={() => updateTrade({ exchangeRate: meta.marketKrw })}>
            APPLY MARKET RATE
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] border border-line bg-white p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">CONTRACT VALUE</p>
          <p className="mt-2 text-xl font-semibold tabular text-navy">
            {formatMoney(scenario.contract.amount, currency)}
          </p>
        </div>
        <div className="rounded-[12px] border border-navy bg-navy p-5 text-white">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60">KRW VALUE</p>
          <p className="mt-2 text-xl font-semibold tabular">{formatKRW(computed.contractKRW)}</p>
        </div>
      </div>
    </StepLayout>
  )
}
