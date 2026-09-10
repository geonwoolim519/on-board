import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import RouteVisual from '../components/RouteVisual'
import ScenarioCard from '../components/ScenarioCard'
import SimulationBadge from '../components/SimulationBadge'
import { featuredScenarios } from '../data/scenarios'
import { useTrade } from '../context/TradeContext'

export default function Home() {
  const { goChoose, goHistory, stats, selectScenario } = useTrade()
  const featured = featuredScenarios()

  return (
    <div className="ob-fade mx-auto max-w-[1280px] px-4 py-10 md:px-6 md:py-14">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">TRADE SIMULATION PLATFORM</p>
          <h1 className="mt-4 max-w-xl text-[36px] font-semibold leading-[1.15] text-navy md:text-[48px]">
            무역거래에 직접 올라타다.
          </h1>
          <p className="mt-5 max-w-lg text-[16px] leading-7 text-muted">
            Choose a trade. Make your decisions. Close the deal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="px-6 py-3" onClick={goChoose}>
              START NEW TRADE
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={goHistory}>
              MY TRADES
            </Button>
          </div>
        </div>
        <RouteVisual />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy">YOUR PROGRESS</h2>
          <SimulationBadge />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Trades Completed" value={stats.tradesCompleted || 0} />
          <Stat label="Countries" value={stats.countries || 0} />
          <Stat label="Incoterms Used" value={`${stats.incotermsUsed || 0} / ${stats.incotermsTotal || 11}`} />
          <Stat label="Best Score" value={stats.bestScore || 0} />
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy">EXPLORE TRADES</h2>
          <button type="button" onClick={goChoose} className="text-sm font-semibold text-accent">
            VIEW ALL →
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {featured.map((item) => (
            <ScenarioCard key={item.id} scenario={item} onSelect={selectScenario} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[12px] border border-line bg-white p-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular text-navy">{value}</p>
    </div>
  )
}
