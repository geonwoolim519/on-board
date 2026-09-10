import OptionCard from '../components/OptionCard'
import StepLayout from '../components/StepLayout'
import WarningCard from '../components/WarningCard'
import { formatMoney } from '../data/currencies'
import { CONTAINERS, TRANSPORTS } from '../data/transports'
import { useTrade } from '../context/TradeContext'
import { calculateFreightUSD } from '../engine/compute'
import { warningsForStep } from '../engine/warnings'

export default function StepShipping() {
  const { trade, scenario, computed, updateTrade, nextStep, prevStep, canGoNext, dismissed, dismissWarning, setTermModal } =
    useTrade()
  const modes = TRANSPORTS.filter(
    (item) => scenario?.availableTransportModes.includes(item.id) && (scenario.freightUSD?.[item.id] || 0) > 0,
  )
  const stepWarnings = warningsForStep(trade, 1)

  return (
    <StepLayout
      kicker="STEP 02"
      title="어떻게 운송하시겠습니까?"
      description="시나리오에서 허용된 운송수단만 표시됩니다. 항구를 바꾸면 운임과 운송일이 달라집니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → PAYMENT"
      nextDisabled={!canGoNext}
      hint={trade.transport === 'SEA' ? '컨테이너 유형을 선택하세요' : '운송 방식을 선택하세요'}
    >
      <div className="grid gap-3">
        {modes.map((item) => {
          const usd = calculateFreightUSD(scenario, computed.origin, computed.destination, item.id, trade.containerType || 'FCL')
          return (
            <OptionCard
              key={item.id}
              selected={trade.transport === item.id}
              onClick={() => updateTrade({ transport: item.id })}
              code={item.name}
              title={item.full}
              badge={item.id === scenario.recommendedTransport ? 'RECOMMENDED' : null}
            >
              <p>{item.summary}</p>
              <p className="mt-2 font-medium tabular text-navy">{formatMoney(usd, 'USD')}</p>
              {trade.transport === item.id && computed.transitDays ? (
                <p className="mt-1 text-xs text-muted">Est. transit {computed.transitDays} days</p>
              ) : null}
            </OptionCard>
          )
        })}
      </div>

      {trade.transport === 'SEA' ? (
        <div className="mt-5">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-muted">CONTAINER TYPE</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTAINERS.map((item) => (
              <OptionCard
                key={item.id}
                selected={trade.containerType === item.id}
                onClick={() => updateTrade({ containerType: item.id })}
                code={item.name}
                title={item.full}
              >
                {item.summary}
              </OptionCard>
            ))}
          </div>
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
