import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import OptionCard from '../components/OptionCard'
import SimulationBadge from '../components/SimulationBadge'
import { getCountry } from '../data/countries'
import { formatMoney } from '../data/currencies'
import { listPorts } from '../data/ports'
import { useTrade } from '../context/TradeContext'

export default function Briefing() {
  const { trade, scenario, computed, updateTrade, startTrade, goChoose } = useTrade()
  if (!scenario || !trade) return null

  const originCountry = getCountry(scenario.sellerCountry)
  const destCountry = getCountry(scenario.buyerCountry)
  const origins = listPorts(scenario.originPorts)
  const dests = listPorts(scenario.destinationPorts)
  const isExport = scenario.playerRole === 'SELLER'

  return (
    <div className="ob-fade mx-auto max-w-[960px] px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent">ASSIGNMENT</p>
        <SimulationBadge />
      </div>
      <h1 className="mt-3 text-[32px] font-semibold leading-tight text-navy md:text-[40px]">
        당신은 지금부터
        <br />
        {isExport ? '수출기업의 무역 담당자입니다.' : '수입기업의 무역 담당자입니다.'}
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted">{scenario.brief}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <DocCard label="SELLER" name={scenario.sellerName} meta={`${originCountry.flag} ${originCountry.name}`} />
        <DocCard label="BUYER" name={scenario.buyerName} meta={`${destCountry.flag} ${destCountry.name}`} />
      </div>

      <div className="mt-4 rounded-[12px] border border-line bg-white p-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">PRODUCT</p>
        <p className="mt-2 text-lg font-semibold text-navy">{computed?.product?.name}</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-muted">QUANTITY</p>
            <p className="mt-1 text-sm font-medium text-ink">
              {scenario.quantity.toLocaleString('en-US')} {computed?.product?.unit}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted">CONTRACT VALUE</p>
            <p className="mt-1 text-sm font-semibold tabular text-navy">
              {formatMoney(scenario.contract.amount, scenario.contract.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">SELECT ORIGIN PORT</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {origins.map((port) => (
            <OptionCard
              key={port.id}
              selected={trade.originPortId === port.id}
              onClick={() => updateTrade({ originPortId: port.id })}
              code={port.code}
              title={port.name}
            >
              {port.city}
            </OptionCard>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">SELECT DESTINATION PORT</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {dests.map((port) => (
            <OptionCard
              key={port.id}
              selected={trade.destinationPortId === port.id}
              onClick={() => updateTrade({ destinationPortId: port.id })}
              code={port.code}
              title={port.name}
            >
              {port.city}
            </OptionCard>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={goChoose}>
          BACK TO TRADES
        </Button>
        <Button onClick={startTrade} disabled={!trade.originPortId || !trade.destinationPortId}>
          START TRADE
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function DocCard({ label, name, meta }) {
  return (
    <div className="rounded-[12px] border border-line bg-white p-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-navy">{name}</p>
      <p className="mt-1 text-sm text-muted">{meta}</p>
    </div>
  )
}
