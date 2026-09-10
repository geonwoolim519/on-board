import { getCurrency, toKRW } from '../data/currencies'
import { getEvent } from '../data/events'
import { getIncoterm, isModeCompatible } from '../data/incoterms'
import { getPort } from '../data/ports'
import { getProduct } from '../data/products'
import { getScenario } from '../data/scenarios'
import { CONTAINERS, freightLabel } from '../data/transports'
import { INSURANCE_MARKUP } from '../data/tradeData'

export function resolveTrade(trade) {
  const scenario = getScenario(trade.scenarioId)
  const origin = getPort(trade.originPortId)
  const destination = getPort(trade.destinationPortId)
  const product = getProduct(scenario?.productId)
  const incoterm = getIncoterm(trade.incoterm)
  return { scenario, origin, destination, product, incoterm }
}

export function calculateInsurance(contractAmount, currency, rateToKRW, insuranceRate, insured, markup = INSURANCE_MARKUP) {
  if (!insured) {
    return { amount: 0, amountKRW: 0, premium: 0, premiumKRW: 0 }
  }
  const amount = contractAmount * markup
  const premium = amount * insuranceRate
  return {
    amount,
    amountKRW: toKRW(amount, currency, rateToKRW),
    premium,
    premiumKRW: toKRW(premium, currency, rateToKRW),
  }
}

export function calculateFreightUSD(scenario, origin, destination, mode, containerType) {
  if (!scenario || !mode) return 0
  const base = scenario.freightUSD?.[mode] || 0
  const originMul = origin?.baseFreightMultiplier ?? 1
  const destMul = destination?.baseFreightMultiplier ?? 1
  const box = CONTAINERS.find((item) => item.id === containerType)
  const boxMul = mode === 'SEA' ? box?.freightFactor ?? 1 : 1
  return base * originMul * destMul * boxMul
}

export function transitDays(origin, destination, mode) {
  const base = (destination?.transitDays || 0) + (origin?.transitDays || 0)
  if (mode === 'AIR') return Math.max(1, Math.round(base * 0.15))
  if (mode === 'MULTIMODAL') return Math.max(4, Math.round(base * 0.85))
  return base
}

export function calculateIncotermsFit(trade) {
  const { scenario, incoterm } = resolveTrade(trade)
  const mode = trade.transport
  if (!incoterm || !mode) {
    return { rank: 'REVIEW REQUIRED', label: 'REVIEW REQUIRED', why: '거래조건과 운송방식을 모두 선택하면 적합성을 평가합니다.' }
  }

  if (!isModeCompatible(incoterm.id, mode)) {
    return {
      rank: 'NOT SUITABLE',
      label: 'MISMATCH',
      why: `${incoterm.name}는 ${incoterm.group === 'SEA' ? '해상 및 내수로' : '지정'} 운송에 사용하는 조건입니다. 현재 운송은 ${mode}입니다.`,
      recommend: 'FCA',
    }
  }

  const containerIssue = ['FOB', 'FAS', 'CFR', 'CIF'].includes(incoterm.id) && mode === 'SEA' && trade.containerType
  if (containerIssue) {
    return {
      rank: 'RISKY',
      label: 'REVIEW REQUIRED',
      why: `${incoterm.name}는 본선 인도를 전제로 합니다. 컨테이너 화물은 선적 전 운송인 인도인 FCA가 더 적합한 경우가 많습니다.`,
      recommend: 'FCA',
    }
  }

  if (incoterm.id === 'EXW' && scenario?.type === 'EXPORT') {
    return {
      rank: 'RISKY',
      label: 'REVIEW REQUIRED',
      why: 'EXW는 해외 바이어가 수출국 통관까지 처리해야 합니다. 국제거래에서는 FCA를 검토하세요.',
      recommend: 'FCA',
    }
  }

  const recommended = scenario?.recommendedIncoterms || []
  if (recommended.includes(incoterm.id) && mode === scenario.recommendedTransport) {
    return { rank: 'BEST FIT', label: 'EXCELLENT', why: '이 시나리오의 운송·거래 구조와 잘 맞습니다.' }
  }
  if (recommended.includes(incoterm.id) || isModeCompatible(incoterm.id, mode)) {
    return { rank: 'ACCEPTABLE', label: 'GOOD', why: '사용 가능한 조합입니다. 비용과 위험 분담만 한 번 더 확인하세요.' }
  }
  return { rank: 'ACCEPTABLE', label: 'GOOD', why: '운송방식과 적용 범위는 맞습니다.' }
}

function line(key, label, krw, party, included) {
  return { key, label, krw, party, included }
}

export function computeTrade(trade) {
  const { scenario, origin, destination, product, incoterm } = resolveTrade(trade)
  if (!scenario) {
    return emptyCompute()
  }

  const currency = scenario.contract.currency
  const fx = Number(trade.exchangeRate) || getCurrency(currency).krw
  const contractKRW = toKRW(scenario.contract.amount, currency, fx)
  const pay = incoterm?.sellerPays
  const requiredInsurance = Boolean(incoterm?.insuranceRequired)
  const insured = trade.insurance === true || (requiredInsurance && trade.insurance !== false)
  const insurance = calculateInsurance(
    scenario.contract.amount,
    currency,
    fx,
    scenario.insuranceRate,
    insured,
    scenario.insuranceMarkup,
  )

  let freightUSD = calculateFreightUSD(scenario, origin, destination, trade.transport, trade.containerType)
  const event = getEvent(trade.eventId)
  if (trade.eventApplied && event?.freightMultiplier) {
    freightUSD *= event.freightMultiplier
  }
  const usdFx = currency === 'USD' ? fx : getCurrency('USD').krw
  const freightKRW = Math.round(freightUSD * usdFx)

  const extra = scenario.extraKRW
  const originMul = origin?.baseFreightMultiplier ?? 1
  const destMul = destination?.baseFreightMultiplier ?? 1
  const productKRW = Math.round(contractKRW * (product?.costRatio || 0.7))
  const dutyKRW = Math.round(contractKRW * (scenario.dutyRate || 0))

  let extraEventKRW = 0
  let damageKRW = 0
  if (trade.eventApplied && event) {
    extraEventKRW = event.extraKRW || 0
    if (event.id === 'CARGO_DAMAGE') {
      const covered = insured && trade.eventResponse === 'claim'
      if (!covered) damageKRW = Math.round(contractKRW * (event.lossRate || 0))
    }
  }

  const seller = (key) => Boolean(pay?.[key])
  const party = (key) => (seller(key) ? 'SELLER' : 'BUYER')

  const items = [
    line('production', 'Product Cost', productKRW, 'SELLER', true),
    line('domestic', 'Domestic Transport', extra.domestic, party('domestic'), seller('domestic')),
    line('export', 'Export Clearance', extra.export, party('export'), seller('export')),
    line('terminal', 'Terminal / Handling', Math.round(extra.terminal * originMul), party('terminal'), seller('terminal')),
    line('freight', freightLabel(trade.transport), freightKRW, party('freight'), seller('freight') && freightKRW > 0),
    line(
      'insurance',
      requiredInsurance
        ? `Insurance (${incoterm?.insuranceLevel || 'included'})`
        : insured
          ? 'Insurance (voluntary)'
          : 'Insurance',
      Math.round(insurance.premiumKRW),
      insured || requiredInsurance ? 'SELLER' : 'BUYER',
      insured,
    ),
    line('import', 'Import Clearance', extra.import, party('import'), seller('import')),
    line('duty', 'Duty (simulation)', dutyKRW, party('duty'), seller('duty')),
    line('destination', 'Destination Delivery', Math.round(extra.destination * destMul), party('destination'), seller('destination')),
    line('unload', 'Unloading', Math.round(extra.destination * 0.25), party('unload'), seller('unload')),
    line('other', 'Other Cost', extra.other + extraEventKRW, 'SELLER', true),
  ]

  if (damageKRW > 0) {
    const riskOnSeller = ['DAP', 'DPU', 'DDP'].includes(trade.incoterm) || scenario.playerRole === 'BUYER'
    items.push(line('damage', 'Cargo Damage', damageKRW, riskOnSeller ? (scenario.playerRole === 'BUYER' ? 'BUYER' : 'SELLER') : 'BUYER', riskOnSeller || scenario.playerRole === 'BUYER'))
  }

  const sellerCost = items.filter((item) => item.party === 'SELLER' && item.included).reduce((sum, item) => sum + item.krw, 0)
  const buyerCost = items.filter((item) => item.party === 'BUYER').reduce((sum, item) => sum + item.krw, 0)
  const totalTradeCost = items.reduce((sum, item) => sum + (item.krw || 0), 0)

  let profit = 0
  if (scenario.playerRole === 'SELLER') {
    profit = contractKRW - sellerCost
  } else {
    const resale = contractKRW * (scenario.resaleMarkup || 1.2)
    profit = resale - contractKRW - items.filter((item) => item.party === 'BUYER' && item.included).reduce((sum, item) => sum + item.krw, 0)
  }

  const logisticsRisk = logisticsRiskLevel(trade, scenario)
  const paymentRisk = paymentRiskLevel(trade)
  const fit = calculateIncotermsFit(trade)

  return {
    scenario,
    origin,
    destination,
    product,
    incoterm,
    fx,
    currency,
    contractKRW,
    freightUSD,
    freightKRW,
    insurance,
    items,
    sellerCost,
    buyerCost,
    totalTradeCost,
    totalCost: scenario.playerRole === 'SELLER' ? sellerCost : contractKRW + items.filter((i) => i.party === 'BUYER' && i.included).reduce((s, i) => s + i.krw, 0),
    profit,
    transitDays: transitDays(origin, destination, trade.transport),
    fit,
    logisticsRisk,
    paymentRisk,
    requiredInsurance,
    event,
  }
}

function logisticsRiskLevel(trade, scenario) {
  if (trade.transport === 'AIR' && scenario?.productId === 'semiconductor') return 'MEDIUM'
  if (trade.containerType === 'LCL') return 'MEDIUM'
  if (trade.transport === 'AIR') return 'MEDIUM'
  if (['HARD', 'EXPERT'].includes(scenario?.difficulty)) return 'MEDIUM'
  if (!trade.insurance) return 'MEDIUM'
  return 'LOW'
}

function paymentRiskLevel(trade) {
  if (trade.payment === 'LC') return 'LOW'
  if (trade.payment === 'TT') return 'LOW–MEDIUM'
  if (trade.payment === 'DP') return 'MEDIUM'
  if (trade.payment === 'DA') return 'HIGH'
  return '—'
}

function emptyCompute() {
  return {
    contractKRW: 0,
    items: [],
    sellerCost: 0,
    buyerCost: 0,
    totalTradeCost: 0,
    totalCost: 0,
    profit: 0,
    fit: { rank: 'REVIEW REQUIRED', label: 'REVIEW REQUIRED', why: '' },
    logisticsRisk: '—',
    paymentRisk: '—',
  }
}

function incotermRequiredInsurance(trade) {
  return Boolean(getIncoterm(trade.incoterm)?.insuranceRequired)
}

export function canProceed(step, trade) {
  switch (step) {
    case 0:
      return Boolean(trade.incoterm)
    case 1:
      if (!trade.transport) return false
      if (trade.transport === 'SEA') return Boolean(trade.containerType)
      return true
    case 2:
      return Boolean(trade.payment)
    case 3:
      if (incotermRequiredInsurance(trade)) return trade.insurance !== false
      return trade.insurance === true || trade.insurance === false
    case 4:
      return Number(trade.exchangeRate) > 0
    case 5:
      return true
    case 6:
      return Boolean(trade.eventResponse)
    default:
      return false
  }
}

export function pickEvent(trade) {
  const scenario = getScenario(trade.scenarioId)
  const list = scenario?.availableEvents || []
  if (!list.length) return 'DOCUMENT_ERROR'
  if (trade.transport === 'AIR' && list.includes('AIR_FREIGHT_DELAY')) return 'AIR_FREIGHT_DELAY'
  const index = (trade.id || '1').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % list.length
  return list[index]
}
