import { ArrowRight, Check, CircleAlert } from 'lucide-react'
import Button from '../components/Button'
import ScoreGauge from '../components/ScoreGauge'
import SimulationBadge from '../components/SimulationBadge'
import { formatKRW } from '../data/currencies'
import { termKeysForTrade } from '../data/terms'
import { useTrade } from '../context/TradeContext'

const SCORE_LABELS = {
  incoterms: 'Incoterms',
  shipping: 'Shipping',
  payment: 'Payment',
  insurance: 'Insurance',
  fx: 'FX',
  cost: 'Cost Management',
}

export default function StepResult() {
  const { trade, computed, score, goChoose, prevStep, setTermModal, justUnlocked, scenario } = useTrade()
  const terms = termKeysForTrade(trade)

  return (
    <div className="ob-fade mx-auto max-w-[1280px] px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-ok">TRADE COMPLETE</p>
          <h1 className="mt-2 text-[40px] font-semibold tracking-tight text-navy md:text-[56px]">DEAL CLOSED</h1>
          <p className="mt-2 text-sm text-muted">
            {scenario?.title} · {trade.incoterm} · {computed.origin?.name} → {computed.destination?.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SimulationBadge />
          <div className="rounded-[10px] border-2 border-ok px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] text-ok">
            CLOSED
          </div>
        </div>
      </div>

      {justUnlocked?.length ? (
        <div className="mt-6 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
          {justUnlocked.map((item) => (
            <p key={item.id} className="text-sm font-semibold text-navy">
              🏆 {item.title} — {item.description}
            </p>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-[12px] border border-line bg-white p-6">
          <p className="text-center text-[11px] font-semibold tracking-[0.18em] text-muted">YOUR TRADE SCORE</p>
          <ScoreGauge score={score.total} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(score.breakdown).map(([key, item]) => (
            <div key={key} className="flex items-center justify-between rounded-[12px] border border-line bg-white px-4 py-3">
              <p className="text-sm text-ink">{SCORE_LABELS[key]}</p>
              <p className="text-sm font-semibold tabular text-navy">
                {item.score} <span className="font-medium text-muted">/ {item.max}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Metric label="SELLER COST" value={formatKRW(computed.sellerCost)} />
        <Metric label="BUYER COST" value={formatKRW(computed.buyerCost)} />
        <div className="rounded-[12px] border border-navy bg-navy p-5 text-white">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60">PROFIT</p>
          <p className="mt-2 text-3xl font-semibold tabular">{formatKRW(computed.profit)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="PAYMENT RISK" value={score.paymentRisk} />
        <Metric label="LOGISTICS RISK" value={score.logisticsRisk} />
        <Metric label="INCOTERMS FIT" value={score.fit?.label || '—'} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">TRADE REVIEW</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[12px] border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-ok">
              <Check className="h-4 w-4" />
              GOOD DECISIONS
            </p>
            <ul className="mt-3 space-y-2">
              {score.goods.map((item) => (
                <li key={item} className="text-sm leading-6 text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[12px] border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-warn">
              <CircleAlert className="h-4 w-4" />
              REVIEW
            </p>
            {score.reviews.length ? (
              <ul className="mt-3 space-y-2">
                {score.reviews.map((item) => (
                  <li key={item} className="text-sm leading-6 text-ink/80">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">이번 거래에서 크게 검토할 항목은 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[12px] border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-navy">KEEP LEARNING</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {terms.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTermModal(key)}
              className="rounded-full border border-line px-3 py-1.5 text-sm text-navy hover:border-accent hover:text-accent"
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={prevStep}>
          BACK TO EVENT
        </Button>
        <Button onClick={goChoose}>
          CHOOSE NEXT TRADE
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-[12px] border border-line bg-white p-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular text-navy">{value}</p>
    </div>
  )
}
