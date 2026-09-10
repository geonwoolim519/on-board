import { CURRENCIES, formatKRW, formatMoney, toKRW } from '../data/currencies'
import { canProceed, computeTrade } from '../engine/compute'

export { formatKRW, formatMoney, toKRW }
export { canProceed, computeTrade }

export function formatUSD(value) {
  return formatMoney(value, 'USD')
}

export const DEFAULT_FX = CURRENCIES.USD.krw
export const MARKET_FX = CURRENCIES.USD.marketKrw
