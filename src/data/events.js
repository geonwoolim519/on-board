export const EVENTS = {
  PORT_DELAY: {
    id: 'PORT_DELAY',
    title: 'PORT DELAY',
    headline: '항구에서 예상치 못한 지연이 발생했습니다.',
    body: '선석 혼잡으로 일정이 밀렸습니다. 시뮬레이션상 추가 체선료가 발생합니다.',
    extraDays: 3,
    extraKRW: 500000,
    responses: [
      { id: 'accept', label: 'ACCEPT COST', result: '추가 비용이 Seller cost에 반영됩니다.' },
    ],
  },
  FX_CHANGE: {
    id: 'FX_CHANGE',
    title: 'FX CHANGE',
    headline: '환율이 변경되었습니다.',
    body: '계약통화 대비 원화가 변동했습니다. 적용 환율을 업데이트할 수 있습니다.',
    responses: [
      { id: 'apply', label: 'APPLY MARKET RATE', result: '시장 환율이 비용과 이익에 반영됩니다.' },
      { id: 'keep', label: 'KEEP CURRENT RATE', result: '기존 시뮬레이션 환율을 유지합니다.' },
    ],
  },
  DOCUMENT_ERROR: {
    id: 'DOCUMENT_ERROR',
    title: 'DOCUMENT ERROR',
    headline: '선적서류에서 오류가 발견되었습니다.',
    body: 'B/L 기재 불일치로 정정 비용이 발생합니다.',
    extraKRW: 300000,
    responses: [
      { id: 'correct', label: 'PAY CORRECTION', result: '서류 정정 비용이 반영됩니다.' },
    ],
  },
  CARGO_DAMAGE: {
    id: 'CARGO_DAMAGE',
    title: 'CARGO DAMAGE',
    headline: '화물 일부가 손상되었습니다.',
    body: '운송 중 일부 화물에 손상이 보고되었습니다. 보험 가입 여부에 따라 결과가 달라집니다.',
    lossRate: 0.08,
    responses: [
      { id: 'claim', label: 'FILE INSURANCE CLAIM', result: '보험이 있으면 손실이 보전됩니다.' },
      { id: 'absorb', label: 'ABSORB LOSS', result: '손실이 거래 손익에 반영됩니다.' },
    ],
  },
  FREIGHT_SURCHARGE: {
    id: 'FREIGHT_SURCHARGE',
    title: 'FREIGHT SURCHARGE',
    headline: '운임이 상승했습니다.',
    body: '유가·성수기 할증으로 주운송비가 인상됩니다.',
    freightMultiplier: 1.12,
    responses: [
      { id: 'accept', label: 'ACCEPT SURCHARGE', result: '인상된 운임이 비용에 반영됩니다.' },
    ],
  },
  AIR_FREIGHT_DELAY: {
    id: 'AIR_FREIGHT_DELAY',
    title: 'AIR FREIGHT DELAY',
    headline: '항공 스페이스 부족으로 지연이 발생했습니다.',
    body: '장비·반도체 등 항공화물은 스페이스 제약이 큽니다.',
    extraDays: 2,
    extraKRW: 800000,
    responses: [
      { id: 'accept', label: 'ACCEPT DELAY', result: '지연 비용이 반영됩니다.' },
    ],
  },
}

export function getEvent(id) {
  return EVENTS[id]
}
