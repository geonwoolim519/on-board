import { getScenario } from '../data/scenarios'

export function createTradeFromScenario(scenarioId) {
  const scenario = getScenario(scenarioId)
  if (!scenario) return null
  return {
    id: String(Date.now()).slice(-6),
    scenarioId: scenario.id,
    originPortId: scenario.originPorts[0],
    destinationPortId: scenario.destinationPorts[0],
    incoterm: null,
    transport: null,
    containerType: null,
    payment: null,
    insurance: null,
    exchangeRate: scenario.exchangeRate,
    eventId: null,
    eventResponse: null,
    eventApplied: false,
    startedAt: new Date().toISOString(),
  }
}
