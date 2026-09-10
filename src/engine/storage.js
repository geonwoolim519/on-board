import { ACHIEVEMENTS } from '../data/achievements'
import { getCountry } from '../data/countries'
import { INCOTERM_IDS } from '../data/incoterms'
import { getScenario } from '../data/scenarios'

const HISTORY_KEY = 'onboard.history'
const META_KEY = 'onboard.meta'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota */
  }
}

export function loadHistory() {
  return read(HISTORY_KEY, [])
}

export function loadMeta() {
  return read(META_KEY, {
    incotermsUsed: [],
    countries: [],
    eventsHandled: 0,
    bestScore: 0,
    unlocked: [],
  })
}

export function saveCompletedTrade({ trade, computed, score }) {
  const scenario = getScenario(trade.scenarioId)
  const origin = getCountry(scenario?.sellerCountry)
  const dest = getCountry(scenario?.buyerCountry)
  const record = {
    id: trade.id,
    scenarioId: trade.scenarioId,
    title: scenario?.title,
    route: `${origin?.name || scenario?.sellerCountry} → ${dest?.name || scenario?.buyerCountry}`,
    product: computed.product?.name,
    incoterm: trade.incoterm,
    transport: trade.transport,
    score: score.total,
    profit: computed.profit,
    date: new Date().toISOString(),
    payment: trade.payment,
    fit: computed.fit?.label,
  }

  const prior = loadHistory()
  const existed = prior.some((item) => item.id === record.id)
  const history = [record, ...prior.filter((item) => item.id !== record.id)].slice(0, 40)
  write(HISTORY_KEY, history)

  const meta = loadMeta()
  const incotermsUsed = Array.from(new Set([...(meta.incotermsUsed || []), trade.incoterm].filter(Boolean)))
  const countries = Array.from(
    new Set([...(meta.countries || []), scenario?.sellerCountry, scenario?.buyerCountry].filter(Boolean)),
  )
  const eventsHandled = (meta.eventsHandled || 0) + (!existed && trade.eventResponse ? 1 : 0)
  const bestScore = Math.max(meta.bestScore || 0, score.total)
  const unlocked = new Set(meta.unlocked || [])

  if (history.length >= 1) unlocked.add('FIRST_DEAL')
  if (countries.length >= 5) unlocked.add('GLOBAL_TRADER')
  if (INCOTERM_IDS.every((code) => incotermsUsed.includes(code))) unlocked.add('INCOTERMS_MASTER')
  if (eventsHandled >= 3) unlocked.add('RISK_MANAGER')
  if (computed.profit >= 40_000_000) unlocked.add('PROFIT_MAKER')

  const nextMeta = {
    incotermsUsed,
    countries,
    eventsHandled,
    bestScore,
    unlocked: Array.from(unlocked),
    tradesCompleted: history.length,
  }
  write(META_KEY, nextMeta)
  return { history, meta: nextMeta, justUnlocked: ACHIEVEMENTS.filter((item) => unlocked.has(item.id) && !meta.unlocked.includes(item.id)) }
}

export function progressStats() {
  const history = loadHistory()
  const meta = loadMeta()
  return {
    tradesCompleted: history.length,
    countries: meta.countries?.length || 0,
    incotermsUsed: meta.incotermsUsed?.length || 0,
    incotermsTotal: INCOTERM_IDS.length,
    bestScore: meta.bestScore || 0,
    unlocked: meta.unlocked || [],
    history,
    meta,
  }
}
