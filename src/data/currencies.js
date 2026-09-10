export const CURRENCIES = {
  KRW: { code: 'KRW', symbol: '₩', name: 'Korean Won', krw: 1, marketKrw: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', krw: 1380, marketKrw: 1420 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', krw: 1500, marketKrw: 1540 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', krw: 9.2, marketKrw: 9.5 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', krw: 190, marketKrw: 196 },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', krw: 0.054, marketKrw: 0.056 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', krw: 376, marketKrw: 386 },
}

export function getCurrency(code) {
  return CURRENCIES[code]
}

export function toKRW(amount, currency, rate) {
  const fx = Number(rate)
  if (Number.isFinite(fx) && fx > 0) return amount * fx
  return amount * (CURRENCIES[currency]?.krw || 1)
}

export function formatMoney(amount, currency = 'USD') {
  const n = Number.isFinite(amount) ? amount : 0
  const meta = CURRENCIES[currency]
  if (!meta) return n.toLocaleString('en-US')
  if (currency === 'KRW') return `₩${Math.round(n).toLocaleString('en-US')}`
  const digits = n >= 1000 ? 0 : 2
  return `${currency} ${n.toLocaleString('en-US', { maximumFractionDigits: digits })}`
}

export function formatKRW(value) {
  const n = Number.isFinite(value) ? value : 0
  return `₩${Math.round(n).toLocaleString('en-US')}`
}
