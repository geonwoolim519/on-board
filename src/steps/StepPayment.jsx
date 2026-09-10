import OptionCard from '../components/OptionCard'
import StepLayout from '../components/StepLayout'
import WarningCard from '../components/WarningCard'
import { PAYMENTS } from '../data/payments'
import { useTrade } from '../context/TradeContext'
import { warningsForStep } from '../engine/warnings'

const RISK_TONE = {
  LOW: 'text-ok',
  'LOW–MEDIUM': 'text-warn',
  MEDIUM: 'text-warn',
  HIGH: 'text-danger',
}

export default function StepPayment() {
  const { trade, scenario, updateTrade, nextStep, prevStep, canGoNext, dismissed, dismissWarning, setTermModal } =
    useTrade()
  const options = PAYMENTS.filter((item) => scenario?.paymentOptions.includes(item.id))
  const selected = options.find((item) => item.id === trade.payment)
  const stepWarnings = warningsForStep(trade, 2)

  return (
    <StepLayout
      kicker="STEP 03"
      title="어떤 결제방식을 선택하시겠습니까?"
      description="시나리오마다 추천 결제조건이 다릅니다. 선택은 정답/오답이 아니라 리스크 평가입니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → INSURANCE"
      nextDisabled={!canGoNext}
      hint="결제방식을 선택하세요"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((item) => (
          <OptionCard
            key={item.id}
            selected={trade.payment === item.id}
            onClick={() => updateTrade({ payment: item.id })}
            code={item.name}
            title={item.full}
            badge={item.id === scenario.recommendedPayment ? 'RECOMMENDED' : null}
          >
            {item.desc}
          </OptionCard>
        ))}
      </div>

      {selected ? (
        <div className="mt-4 rounded-[12px] border border-line bg-white px-5 py-4">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">PAYMENT RISK</p>
          <p className={`mt-1 text-xl font-semibold ${RISK_TONE[selected.risk]}`}>{selected.risk}</p>
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
