import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrency } from '../data/currencies'
import { createTradeFromScenario } from '../data/createTrade'
import { getIncoterm } from '../data/incoterms'
import { getScenario } from '../data/scenarios'
import { STEPS } from '../data/tradeData'
import { canProceed, computeTrade, pickEvent } from '../engine/compute'
import { computeScore } from '../engine/score'
import { getWarnings } from '../engine/warnings'
import { progressStats, saveCompletedTrade } from '../engine/storage'

const TradeContext = createContext(null)

export function TradeProvider({ children }) {
  const [view, setView] = useState('home')
  const [step, setStep] = useState(0)
  const [trade, setTrade] = useState(null)
  const [dismissed, setDismissed] = useState([])
  const [termKey, setTermModal] = useState(null)
  const [compareOpen, setCompareOpen] = useState(false)
  const [stats, setStats] = useState(() => progressStats())
  const [saved, setSaved] = useState(false)
  const [justUnlocked, setJustUnlocked] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, step])

  const scenario = trade ? getScenario(trade.scenarioId) : null
  const computed = useMemo(() => (trade ? computeTrade(trade) : null), [trade])
  const score = useMemo(() => (trade && computed ? computeScore(trade, computed) : null), [trade, computed])
  const warnings = useMemo(() => (trade ? getWarnings(trade) : []), [trade])

  const updateTrade = useCallback((patch) => {
    setTrade((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (patch.transport && patch.transport !== 'SEA') next.containerType = null
      if (patch.incoterm) {
        const term = getIncoterm(patch.incoterm)
        if (term?.insuranceRequired) next.insurance = true
      }
      return next
    })
  }, [])

  const goChoose = useCallback(() => {
    setView('choose')
    setStep(0)
  }, [])

  const selectScenario = useCallback((scenarioId) => {
    setTrade(createTradeFromScenario(scenarioId))
    setStep(0)
    setDismissed([])
    setSaved(false)
    setJustUnlocked([])
    setView('briefing')
  }, [])

  const startTrade = useCallback(() => {
    setView('simulator')
    setStep(0)
  }, [])

  const goHome = useCallback(() => {
    setView('home')
  }, [])

  const goHistory = useCallback(() => {
    setStats(progressStats())
    setView('history')
  }, [])

  const nextStep = useCallback(() => {
    setStep((current) => {
      if (current === 5) {
        setTrade((prev) => {
          if (!prev || prev.eventId) return prev
          return { ...prev, eventId: pickEvent(prev) }
        })
      }
      return Math.min(STEPS.length - 1, current + 1)
    })
  }, [])

  const prevStep = useCallback(() => {
    setStep((current) => {
      if (current === 7) setSaved(false)
      if (current <= 0) {
        setView('briefing')
        return 0
      }
      return current - 1
    })
  }, [])

  const applyEvent = useCallback((responseId) => {
    setTrade((prev) => {
      if (!prev) return prev
      const next = { ...prev, eventResponse: responseId, eventApplied: true }
      if (responseId === 'apply' && computed?.scenario) {
        next.exchangeRate = getCurrency(computed.scenario.contract.currency).marketKrw
      }
      return next
    })
  }, [computed])

  const completeTrade = useCallback(() => {
    if (!trade || !computed || !score || saved) return
    const result = saveCompletedTrade({ trade, computed, score })
    setSaved(true)
    setStats(progressStats())
    setJustUnlocked(result.justUnlocked || [])
  }, [trade, computed, score, saved])

  useEffect(() => {
    if (view === 'simulator' && step === 7) completeTrade()
  }, [view, step, completeTrade])

  const dismissWarning = useCallback((id) => {
    setDismissed((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const value = {
    view,
    step,
    trade,
    scenario,
    computed,
    score,
    warnings,
    dismissed,
    termKey,
    setTermModal,
    compareOpen,
    setCompareOpen,
    stats,
    justUnlocked,
    updateTrade,
    goChoose,
    selectScenario,
    startTrade,
    goHome,
    goHistory,
    nextStep,
    prevStep,
    setStep,
    applyEvent,
    completeTrade,
    dismissWarning,
    history: stats.history || [],
    canGoNext: trade ? canProceed(step, trade) : false,
  }

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
}

export function useTrade() {
  const ctx = useContext(TradeContext)
  if (!ctx) throw new Error('useTrade must be used within TradeProvider')
  return ctx
}
