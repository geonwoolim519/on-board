import { groupedIncoterms } from '../data/incoterms'
import Button from '../components/Button'
import IncotermFlow from '../components/IncotermFlow'
import OptionCard from '../components/OptionCard'
import SimulationBadge from '../components/SimulationBadge'
import StepLayout from '../components/StepLayout'
import WarningCard from '../components/WarningCard'
import { useTrade } from '../context/TradeContext'
import { warningsForStep } from '../engine/warnings'

export default function StepContract() {
  const {
    trade,
    scenario,
    updateTrade,
    nextStep,
    prevStep,
    canGoNext,
    dismissed,
    dismissWarning,
    setTermModal,
    setCompareOpen,
  } = useTrade()
  const allowed = new Set(scenario?.availableIncoterms || [])
  const groups = groupedIncoterms()
  const anyTerms = groups.ANY.filter((item) => allowed.has(item.id))
  const seaTerms = groups.SEA.filter((item) => allowed.has(item.id))
  const stepWarnings = warningsForStep(trade, 0)

  return (
    <StepLayout
      kicker="STEP 01"
      title="어떤 거래조건으로 계약하시겠습니까?"
      description="Incoterms® 2020의 11개 조건 중 이 거래에 맞는 조건을 고르세요. 운송 적용 범위가 다른 조건은 다음 단계에서 검증됩니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → SHIPPING"
      nextDisabled={!canGoNext}
      hint="거래조건을 선택하세요"
      wide
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SimulationBadge />
        <Button variant="secondary" onClick={() => setCompareOpen(true)}>
          COMPARE TERMS
        </Button>
      </div>

      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">ANY MODE OF TRANSPORT</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {anyTerms.map((item) => (
          <TermCard key={item.id} item={item} selected={trade.incoterm === item.id} onSelect={updateTrade} />
        ))}
      </div>

      <p className="mt-8 text-[11px] font-semibold tracking-[0.16em] text-muted">SEA / INLAND WATERWAY</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {seaTerms.map((item) => (
          <TermCard key={item.id} item={item} selected={trade.incoterm === item.id} onSelect={updateTrade} />
        ))}
      </div>

      {trade.incoterm ? (
        <div className="mt-8">
          <IncotermFlow incoterm={trade.incoterm} />
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {stepWarnings.map((warning) => (
          <WarningCard
            key={warning.id}
            warning={warning}
            dismissed={dismissed.includes(warning.id)}
            onDismiss={() => dismissWarning(warning.id)}
            onExplain={setTermModal}
          />
        ))}
      </div>
    </StepLayout>
  )
}

function TermCard({ item, selected, onSelect }) {
  return (
    <OptionCard
      selected={selected}
      onClick={() => onSelect({ incoterm: item.id })}
      code={item.name}
      title={item.full}
    >
      <p>Mode · {item.group === 'SEA' ? 'Sea / waterway' : 'Any mode'}</p>
      <p className="mt-1">Cost · Seller {item.sellerCost} / Buyer {item.buyerCost}</p>
      <p className="mt-1">Risk · {item.riskTransfer}</p>
      <p className="mt-1">
        Insurance · {item.insuranceRequired ? `Seller required${item.insuranceLevel ? ` (${item.insuranceLevel})` : ''}` : 'Not required'}
      </p>
      <p className="mt-2 text-[13px] leading-5 text-ink/70">{item.summary}</p>
    </OptionCard>
  )
}
