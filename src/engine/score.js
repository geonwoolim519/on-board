import { getCurrency } from '../data/currencies'
import { getIncoterm, isModeCompatible } from '../data/incoterms'
import { getPayment } from '../data/payments'
import { getScenario } from '../data/scenarios'
import { calculateIncotermsFit } from './compute'

export function computeScore(trade, computed) {
  const scenario = getScenario(trade.scenarioId)
  const incoterms = scoreIncoterms(trade, scenario, computed)
  const shipping = scoreShipping(trade, scenario)
  const payment = scorePayment(trade, scenario)
  const insurance = scoreInsurance(trade, computed)
  const fx = scoreFx(trade, scenario)
  const cost = scoreCost(trade, scenario)

  const breakdown = { incoterms, shipping, payment, insurance, fx, cost }
  const total = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0)
  const { goods, reviews } = buildReview(trade, computed, scenario)

  return {
    total,
    max: 100,
    breakdown,
    goods,
    reviews,
    fit: computed.fit,
    paymentRisk: computed.paymentRisk,
    logisticsRisk: computed.logisticsRisk,
  }
}

function scoreIncoterms(trade, scenario, computed) {
  const max = 20
  const fit = computed.fit || calculateIncotermsFit(trade)
  if (!trade.incoterm) return { score: 0, max, note: '' }
  if (fit.rank === 'NOT SUITABLE') return { score: 6, max, note: fit.why }
  if (fit.rank === 'RISKY') return { score: 12, max, note: fit.why }
  if (fit.rank === 'BEST FIT') return { score: 20, max, note: '거래구조와 Incoterms가 잘 맞습니다.' }
  return { score: 16, max, note: '사용 가능한 조건입니다.' }
}

function scoreShipping(trade, scenario) {
  const max = 20
  if (!trade.transport) return { score: 0, max, note: '' }
  const allowed = scenario?.availableTransportModes || []
  if (!allowed.includes(trade.transport)) {
    return { score: 6, max, note: '이 시나리오에서 권장되지 않는 운송방식입니다.' }
  }
  if (trade.transport === scenario.recommendedTransport && trade.transport === 'SEA' && trade.containerType === 'FCL') {
    return { score: 20, max, note: '추천 운송과 FCL 조합입니다.' }
  }
  if (trade.transport === scenario.recommendedTransport) {
    return { score: 18, max, note: '이 구간의 추천 운송방식입니다.' }
  }
  if (trade.containerType === 'LCL') return { score: 14, max, note: 'LCL은 가능하지만 핸들링 리스크가 커집니다.' }
  return { score: 12, max, note: '가능하지만 추천 운송은 아닙니다.' }
}

function scorePayment(trade, scenario) {
  const max = 20
  const payment = getPayment(trade.payment)
  if (!payment) return { score: 0, max, note: '' }
  if (trade.payment === scenario?.recommendedPayment) {
    return { score: 20, max, note: '이 거래의 추천 결제조건입니다.' }
  }
  if (trade.payment === 'LC') return { score: 18, max, note: 'L/C로 지급 위험을 낮췄습니다.' }
  if (trade.payment === 'TT') return { score: 15, max, note: 'T/T는 가능하지만 선수금 구조에 따라 위험이 달라집니다.' }
  if (trade.payment === 'DP') return { score: 12, max, note: '은행 확약 없는 추심 결제입니다.' }
  return { score: 8, max, note: 'D/A는 수출자 위험이 높습니다.' }
}

function scoreInsurance(trade, computed) {
  const max = 15
  const required = computed.requiredInsurance
  if (required && trade.insurance === false) return { score: 4, max, note: '보험이 포함된 조건인데 부보하지 않았습니다.' }
  if (required && trade.insurance !== false) return { score: 15, max, note: '조건에 맞는 적하보험을 반영했습니다.' }
  if (trade.insurance === true) return { score: 15, max, note: '적하보험으로 운송 위험을 헤지했습니다.' }
  if (trade.insurance === false) return { score: 8, max, note: '보험 미가입으로 운송 중 손해 위험이 남아 있습니다.' }
  return { score: 0, max, note: '' }
}

function scoreFx(trade, scenario) {
  const max = 10
  const rate = Number(trade.exchangeRate)
  const base = scenario?.exchangeRate
  const market = getCurrency(scenario?.contract.currency)?.marketKrw
  if (!rate) return { score: 0, max, note: '' }
  if (market && Math.abs(rate - market) < 0.0001) {
    return { score: 10, max, note: '시장 환율 업데이트를 반영했습니다.' }
  }
  if (rate === base) return { score: 8, max, note: '시나리오 기본 환율을 적용했습니다.' }
  return { score: 10, max, note: '환율을 거래 계산에 적용했습니다.' }
}

function scoreCost(trade, scenario) {
  const max = 15
  let score = 15
  if (trade.transport && trade.transport !== scenario?.recommendedTransport) score -= 4
  if (trade.containerType === 'LCL') score -= 2
  if (trade.incoterm === 'EXW') score -= 3
  if (trade.incoterm === 'DDP' && scenario?.type === 'EXPORT') score -= 3
  return { score: Math.max(0, score), max, note: '운송·조건이 원가 구조에 미치는 영향을 반영했습니다.' }
}

function buildReview(trade, computed, scenario) {
  const goods = []
  const reviews = []
  const term = getIncoterm(trade.incoterm)

  if (computed.fit?.rank === 'BEST FIT') goods.push('Incoterms와 운송방식이 거래 구조와 잘 맞습니다.')
  if (trade.payment === scenario?.recommendedPayment) goods.push('결제조건의 위험을 적절하게 관리했습니다.')
  if (trade.insurance === true || computed.requiredInsurance) goods.push('보험금액을 계약금액의 110% 기준으로 계산했습니다.')
  if (trade.transport === scenario?.recommendedTransport) goods.push('이 구간에 적합한 운송방식을 선택했습니다.')

  if (computed.fit?.rank === 'NOT SUITABLE') {
    reviews.push(`${trade.incoterm} + ${trade.transport} 조합은 적용 범위가 맞지 않습니다. ${computed.fit.recommend || 'FCA'}를 검토하세요.`)
  }
  if (computed.fit?.rank === 'RISKY') reviews.push(computed.fit.why)
  if (term?.insuranceRequired && trade.insurance === false) {
    reviews.push(`${trade.incoterm}는 판매자의 부보 의무가 있습니다.`)
  }
  if (!isModeCompatible(trade.incoterm, trade.transport)) {
    reviews.push('선택한 Incoterms의 운송 적용 범위를 다시 확인하세요.')
  }
  if (trade.payment === 'DA') reviews.push('D/A는 대금 회수 시점이 늦어 수출자 위험이 큽니다.')
  if (computed.profit < 0) reviews.push('현재 조건에서는 예상 손익이 적자입니다.')
  if (!goods.length) goods.push('거래를 끝까지 완료하고 비용 구조를 확인했습니다.')
  return { goods, reviews }
}
