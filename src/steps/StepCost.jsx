import CostTable from '../components/CostTable'
import StepLayout from '../components/StepLayout'
import { useTrade } from '../context/TradeContext'

export default function StepCost() {
  const { trade, computed, nextStep, prevStep } = useTrade()

  return (
    <StepLayout
      kicker="STEP 06"
      title="이번 거래의 총비용을 계산합니다."
      description="Incoterms에 따라 Seller Cost와 Buyer Cost가 나뉩니다. 관세·운임은 시뮬레이션 데이터입니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → EVENT"
      wide
    >
      <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.12em] text-muted">
        <span className="rounded-full border border-line bg-white px-2.5 py-1">{trade.incoterm}</span>
        <span className="rounded-full border border-line bg-white px-2.5 py-1">
          {trade.transport}
          {trade.containerType ? ` · ${trade.containerType}` : ''}
        </span>
        <span className="rounded-full border border-line bg-white px-2.5 py-1">
          {trade.insurance ? 'INSURED' : 'UNINSURED'}
        </span>
        <span className="rounded-full border border-line bg-white px-2.5 py-1">
          {computed.origin?.name} → {computed.destination?.name}
        </span>
      </div>
      <CostTable
        items={computed.items}
        sellerCost={computed.sellerCost}
        buyerCost={computed.buyerCost}
        totalTradeCost={computed.totalTradeCost}
        contractKRW={computed.contractKRW}
        profit={computed.profit}
        animate
      />
    </StepLayout>
  )
}
