import Button from '../components/Button'
import StepLayout from '../components/StepLayout'
import { getEvent } from '../data/events'
import { useTrade } from '../context/TradeContext'

export default function StepEvent() {
  const { trade, applyEvent, nextStep, prevStep, canGoNext } = useTrade()
  const event = getEvent(trade.eventId)

  return (
    <StepLayout
      kicker="STEP 07"
      title="예상하지 못한 무역 이벤트가 발생했습니다."
      description="이벤트는 시나리오마다 다릅니다. 대응 방식에 따라 비용과 손익이 달라집니다."
      onBack={prevStep}
      onNext={nextStep}
      nextLabel="NEXT → RESULT"
      nextDisabled={!canGoNext}
      hint="대응 방법을 선택하세요"
    >
      {event ? (
        <div className="rounded-[12px] border border-line bg-white p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-warn">{event.title}</p>
          <p className="mt-2 text-lg font-semibold text-navy">{event.headline}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{event.body}</p>
          {event.extraDays ? <p className="mt-3 text-sm text-ink">+{event.extraDays} days</p> : null}
          <div className="mt-5 flex flex-col gap-2">
            {event.responses.map((item) => (
              <Button
                key={item.id}
                variant={trade.eventResponse === item.id ? 'primary' : 'secondary'}
                onClick={() => applyEvent(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {trade.eventResponse ? (
            <p className="mt-4 text-sm text-muted">
              {event.responses.find((item) => item.id === trade.eventResponse)?.result}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">이벤트를 준비하는 중입니다.</p>
      )}
    </StepLayout>
  )
}
