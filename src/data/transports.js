export const TRANSPORTS = [
  {
    id: 'SEA',
    name: 'SEA',
    full: 'Ocean Freight',
    summary: '해상운송. 대량 화물의 기본 선택입니다.',
  },
  {
    id: 'AIR',
    name: 'AIR',
    full: 'Air Freight',
    summary: '항공운송. 리드타임은 짧지만 운임이 높습니다.',
  },
  {
    id: 'ROAD',
    name: 'ROAD',
    full: 'Road Transport',
    summary: '육상 트럭 운송. 근거리 또는 복합운송의 내륙 구간에 사용합니다.',
  },
  {
    id: 'RAIL',
    name: 'RAIL',
    full: 'Rail Transport',
    summary: '철도운송. 대륙 구간에서 해상 대비 리드타임을 줄일 수 있습니다.',
  },
  {
    id: 'MULTIMODAL',
    name: 'MULTIMODAL',
    full: 'Multimodal Transport',
    summary: '둘 이상의 운송수단을 하나의 계약으로 연결합니다.',
  },
]

export const CONTAINERS = [
  {
    id: 'FCL',
    name: 'FCL',
    full: 'Full Container Load',
    summary: '컨테이너를 단독 사용합니다. 일정 규모 이상에서 운임·화물관리에 유리합니다.',
    freightFactor: 1,
    risk: 'LOW',
  },
  {
    id: 'LCL',
    name: 'LCL',
    full: 'Less than Container Load',
    summary: '혼재 운송입니다. 소량 화물에 적합하지만 단가와 핸들링 리스크가 높아질 수 있습니다.',
    freightFactor: 1.2,
    risk: 'MEDIUM',
  },
]

export function getTransport(id) {
  return TRANSPORTS.find((item) => item.id === id)
}

export function freightLabel(mode) {
  if (mode === 'AIR') return 'Air Freight'
  if (mode === 'ROAD') return 'Road Transport'
  if (mode === 'RAIL') return 'Rail Transport'
  if (mode === 'MULTIMODAL') return 'Multimodal Freight'
  return 'Ocean Freight'
}
