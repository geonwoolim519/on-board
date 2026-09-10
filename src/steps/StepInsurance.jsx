import OptionCard from '../components/OptionCard'
import StepLayout from '../components/StepLayout'
import WarningCard from '../components/WarningCard'
import { formatKRW, formatMoney } from '../data/currencies'
import { useTrade } from '../context/TradeContext'
import { warningsForStep } from '../engine/warnings'

export default function StepInsurance() {
  const { trade, scenario, computed, updateTrade, nextStep, prevStep, canGoNext, dismissed, dismissWarning, setTermModal } =
    useTrade()
  const required = computed?.requiredInsurance
  const quote = computed?.insurance
  const stepWarnings = warningsForStep(trade, 3)

  return (
    <StepLayout
      kicker="STEP 04"
      title="화물보험에 가입하시겠습니까?"
      description="CIF / CIP는 판매자가 보험을 제공합니다. 그 외 조건에서는 선택입니다. 보험금액은 계약금액의 110%입니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → FX"
      nextDisabled={!canGoNext}
      hint="보험 가입 여부를 선택하세요"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <OptionCard
          selected={trade.insurance === true || (required && trade.insurance !== false)}
          onClick={() => updateTrade({ insurance: true })}
          code="YES"
          title="적하보험 가입"
        >
          {required
            ? `${trade.incoterm} 조건의 부보 의무에 해당합니다.${computed?.incoterm?.insuranceLevel ? ` 담보 ${computed.incoterm.insuranceLevel}.` : ''}`
            : '운송 중 손해에 대비합니다.'}
        </OptionCard>
        <OptionCard
          selected={trade.insurance === false}
          onClick={() => updateTrade({ insurance: false })}
          code="NO"
          title="보험 미가입"
        >
          {required ? '조건과 충돌할 수 있습니다.' : '보험료는 발생하지 않지만 운송 리스크가 남습니다.'}
        </OptionCard>
      </div>

      <div className="mt-5 rounded-[12px] border border-line bg-white p-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">INSURANCE QUOTE</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Quote label="AMOUNT" value={formatMoney(scenario.contract.amount * 1.1, scenario.contract.currency)} />
          <Quote label="RATE" value={`${(scenario.insuranceRate * 100).toFixed(2)}%`} />
          <Quote label="PREMIUM (KRW)" value={formatKRW(quote?.premiumKRW || 0)} />
        </div>
      </div>

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

function Quote({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular text-navy">{value}</p>
    </div>
  )
}
