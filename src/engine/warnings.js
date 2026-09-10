import { getIncoterm, isModeCompatible } from '../data/incoterms'
import { getScenario } from '../data/scenarios'

export function getWarnings(trade) {
  const scenario = getScenario(trade.scenarioId)
  const term = getIncoterm(trade.incoterm)
  const warnings = []

  if (term && trade.transport && !isModeCompatible(term.id, trade.transport)) {
    warnings.push({
      id: 'incoterm-mode',
      step: 1,
      title: 'INCOTERMS MISMATCH',
      headline: '거래조건과 운송방식이 맞지 않습니다',
      body: `${term.name}는 ${term.group === 'SEA' ? '해상운송 및 내수로 운송' : '지정 운송'}에 사용되는 조건입니다. 현재 선택한 운송수단은 ${trade.transport}입니다. FCA처럼 모든 운송방식에 쓸 수 있는 조건을 검토해보세요.`,
      term: 'FCA',
      why: term.why,
    })
  }

  if (['FOB', 'FAS', 'CFR', 'CIF'].includes(trade.incoterm) && trade.transport === 'SEA' && trade.containerType) {
    warnings.push({
      id: 'fob-container',
      step: 1,
      title: 'REVIEW REQUIRED',
      headline: '컨테이너 화물과 본선 인도 조건',
      body: `${trade.incoterm}는 본선 적재(또는 선측)를 기준으로 합니다. 컨테이너 화물은 실제 선적 전에 운송인에게 인도되는 경우가 많아 FCA가 더 적절할 수 있습니다.`,
      term: 'FCA',
      why: term?.why,
    })
  }

  if (trade.incoterm === 'EXW') {
    warnings.push({
      id: 'exw-control',
      step: 0,
      title: 'REVIEW REQUIRED',
      headline: '수출통관 책임 확인',
      body: 'EXW는 구매자가 수출국 내 운송과 수출통관까지 처리해야 합니다. 국제거래에서는 FCA가 더 일반적입니다.',
      term: 'EXW',
      why: term?.why,
    })
  }

  if (trade.incoterm === 'DDP' && scenario?.type === 'EXPORT') {
    warnings.push({
      id: 'ddp-import',
      step: 0,
      title: 'REVIEW REQUIRED',
      headline: '수입통관·관세 책임',
      body: 'DDP는 판매자가 도착국 수입통관과 관세까지 부담합니다. 도착국 규제 리스크가 커질 수 있습니다.',
      term: 'DDP',
    })
  }

  if (term?.insuranceRequired && trade.insurance === false) {
    warnings.push({
      id: 'insurance-required',
      step: 3,
      title: 'REVIEW REQUIRED',
      headline: `${term.name} 보험 요건`,
      body: `${term.name}에서 판매자는 보험을 제공해야 합니다. 보험 미가입은 조건과 충돌할 수 있습니다.`,
      term: 'Insurance',
    })
  }

  if (term?.insuranceRequired && trade.insurance == null) {
    warnings.push({
      id: 'insurance-recommend',
      step: 3,
      title: 'RECOMMENDED',
      headline: `${term.name} 보험 자동 계산`,
      body: `${term.name}는 판매자의 부보 의무가 있습니다. 보험료가 판매자 비용에 반영됩니다.`,
      term: 'Insurance',
      tone: 'info',
    })
  }

  if (trade.payment === 'DA') {
    warnings.push({
      id: 'da-risk',
      step: 2,
      title: 'REVIEW REQUIRED',
      headline: '수출자 위험 높음',
      body: 'D/A는 수입자 인수만으로 서류가 인도됩니다. 고액·신규 거래에서는 L/C가 위험을 더 낮춥니다.',
      term: 'D/A',
    })
  }

  if (trade.transport && scenario && !scenario.availableTransportModes.includes(trade.transport)) {
    warnings.push({
      id: 'mode-off',
      step: 1,
      title: 'REVIEW REQUIRED',
      headline: '시나리오와 운송방식',
      body: `이 거래의 기본 운송은 ${scenario.recommendedTransport}입니다. ${trade.transport}는 비용·리드타임 측면에서 재검토가 필요합니다.`,
    })
  }

  return warnings
}

export function warningsForStep(trade, step) {
  return getWarnings(trade).filter((warning) => warning.step === step)
}
