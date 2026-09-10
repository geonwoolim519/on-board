import { INCOTERMS } from './incoterms'

const extra = {
  Incoterms: {
    title: 'Incoterms',
    subtitle: 'International Commercial Terms',
    body: '국제상업회의소(ICC)가 정한 무역거래조건입니다. 비용, 위험, 통관 책임이 판매자와 구매자 중 누구에게 있는지를 표준화합니다.',
  },
  'L/C': {
    title: 'L/C',
    subtitle: 'Letter of Credit',
    body: '은행이 서류 조건 충족 시 대금을 지급하기로 확약하는 결제 방식입니다. 신규 바이어와의 거래에서 수출자 위험을 낮춥니다.',
  },
  'T/T': {
    title: 'T/T',
    subtitle: 'Telegraphic Transfer',
    body: '은행을 통한 전신 송금입니다. 절차는 간단하지만, 선수금 비중에 따라 신용 위험이 달라집니다.',
  },
  'D/P': {
    title: 'D/P',
    subtitle: 'Documents against Payment',
    body: '추심 결제 방식입니다. 수입자가 대금을 지급해야 선하증권 등 서류를 받을 수 있습니다.',
  },
  'D/A': {
    title: 'D/A',
    subtitle: 'Documents against Acceptance',
    body: '수입자가 환어음을 인수하면 서류를 수령합니다. 실제 대금 회수 시점이 늦어 수출자 위험이 높습니다.',
  },
  Insurance: {
    title: 'Insurance',
    subtitle: 'Cargo Insurance',
    body: '운송 중 멸실·손상에 대비한 적하보험입니다. CIF는 최소 담보, CIP는 ICC (A) 수준을 판매자가 제공합니다. 보험금액은 보통 계약금액의 110%로 계산합니다.',
  },
  'Exchange Rate': {
    title: 'Exchange Rate',
    subtitle: 'Contract currency / KRW',
    body: '계약통화 금액을 원화로 환산하면 매출·비용·이익이 달라집니다. 이 앱의 환율은 교육용 시뮬레이션 데이터입니다.',
  },
  FCL: {
    title: 'FCL',
    subtitle: 'Full Container Load',
    body: '컨테이너 하나를 화주가 단독 사용하는 방식입니다.',
  },
  LCL: {
    title: 'LCL',
    subtitle: 'Less than Container Load',
    body: '여러 화주의 화물을 하나의 컨테이너에 혼재하는 방식입니다.',
  },
}

export const TERMS = {
  ...extra,
  ...Object.fromEntries(
    INCOTERMS.map((item) => [
      item.id,
      { title: item.name, subtitle: item.full, body: `${item.summary} ${item.why}` },
    ]),
  ),
}

export function termKeysForTrade(trade) {
  const keys = ['Incoterms']
  if (trade.incoterm) keys.push(trade.incoterm)
  if (trade.containerType) keys.push(trade.containerType)
  if (trade.payment === 'LC') keys.push('L/C')
  if (trade.payment === 'TT') keys.push('T/T')
  if (trade.payment === 'DP') keys.push('D/P')
  if (trade.payment === 'DA') keys.push('D/A')
  keys.push('Insurance', 'Exchange Rate')
  return [...new Set(keys)]
}
