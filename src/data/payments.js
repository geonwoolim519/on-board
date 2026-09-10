export const PAYMENTS = [
  {
    id: 'TT',
    name: 'T/T',
    full: 'Telegraphic Transfer',
    desc: '은행 송금 방식. 선수금과 잔금 구조로 주로 사용됩니다.',
    risk: 'LOW–MEDIUM',
    exporterRisk: 'MEDIUM',
  },
  {
    id: 'LC',
    name: 'L/C',
    full: 'Letter of Credit',
    desc: '은행의 지급확약을 기반으로 하는 결제방식',
    risk: 'LOW',
    exporterRisk: 'LOW',
  },
  {
    id: 'DP',
    name: 'D/P',
    full: 'Documents against Payment',
    desc: '수입자가 대금을 지급해야 선적서류를 수령합니다.',
    risk: 'MEDIUM',
    exporterRisk: 'MEDIUM',
  },
  {
    id: 'DA',
    name: 'D/A',
    full: 'Documents against Acceptance',
    desc: '수입자의 인수만으로 서류를 인도하는 방식입니다.',
    risk: 'HIGH',
    exporterRisk: 'HIGH',
  },
]

export function getPayment(id) {
  return PAYMENTS.find((item) => item.id === id)
}
