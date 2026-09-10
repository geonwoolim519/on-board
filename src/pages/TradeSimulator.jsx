import CompareTerms from '../components/CompareTerms'
import ProgressBar from '../components/ProgressBar'
import TermModal from '../components/TermModal'
import TradeSidebar from '../components/TradeSidebar'
import { useTrade } from '../context/TradeContext'
import StepContract from '../steps/StepContract'
import StepShipping from '../steps/StepShipping'
import StepPayment from '../steps/StepPayment'
import StepInsurance from '../steps/StepInsurance'
import StepFx from '../steps/StepFx'
import StepCost from '../steps/StepCost'
import StepEvent from '../steps/StepEvent'
import StepResult from '../steps/StepResult'

const STEPS = [
  StepContract,
  StepShipping,
  StepPayment,
  StepInsurance,
  StepFx,
  StepCost,
  StepEvent,
  StepResult,
]

export default function TradeSimulator() {
  const { step, termKey, setTermModal, compareOpen, setCompareOpen, trade, scenario, computed } = useTrade()
  const Step = STEPS[step] ?? StepContract

  return (
    <div>
      <ProgressBar />
      <div className="px-4 pt-4 lg:hidden md:px-6">
        <TradeSidebar trade={trade} scenario={scenario} computed={computed} />
      </div>
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <Step key={step} />
        </div>
        <div className="hidden py-8 lg:block">
          <div className="sticky top-24">
            <TradeSidebar trade={trade} scenario={scenario} computed={computed} />
          </div>
        </div>
      </div>
      <TermModal termKey={termKey} onClose={() => setTermModal(null)} />
      <CompareTerms open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  )
}
