import { useMemo, useState } from 'react'
import ScenarioCard from '../components/ScenarioCard'
import SimulationBadge from '../components/SimulationBadge'
import { getCountry } from '../data/countries'
import { getPort } from '../data/ports'
import { getProduct } from '../data/products'
import { SCENARIOS } from '../data/scenarios'
import { useTrade } from '../context/TradeContext'

const REGIONS = ['Asia', 'North America', 'Europe', 'Middle East']
const MODES = ['SEA', 'AIR', 'ROAD', 'RAIL', 'MULTIMODAL']
const DIFFS = ['EASY', 'NORMAL', 'HARD', 'EXPERT']
const TYPES = ['EXPORT', 'IMPORT']
const PRODUCTS = ['Automotive', 'Electronics', 'Food', 'Machinery', 'Textile', 'Cosmetics']

export default function ChooseTrade() {
  const { selectScenario, goHome } = useTrade()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [mode, setMode] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [type, setType] = useState('')
  const [product, setProduct] = useState('')
  const [expanded, setExpanded] = useState(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SCENARIOS.filter((item) => {
      const prod = getProduct(item.productId)
      if (region && !matchRegion(item, region)) return false
      if (mode && !item.availableTransportModes.includes(mode)) return false
      if (difficulty && item.difficulty !== difficulty) return false
      if (type && item.type !== type) return false
      if (product && prod.category !== product) return false
      if (!q) return true
      const seller = getCountry(item.sellerCountry)
      const buyer = getCountry(item.buyerCountry)
      const ports = [...item.originPorts, ...item.destinationPorts]
        .map((id) => getPort(id)?.name || '')
        .join(' ')
      const hay = `${item.title} ${prod.name} ${prod.category} ${seller?.name} ${seller?.short} ${buyer?.name} ${buyer?.short} ${ports} ${item.brief}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, region, mode, difficulty, type, product])

  return (
    <div className="ob-fade mx-auto max-w-[1280px] px-4 py-10 md:px-6 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent">CHOOSE YOUR TRADE</p>
          <h1 className="mt-3 text-[32px] font-semibold text-navy">다양한 무역거래 중 하나를 선택하세요.</h1>
        </div>
        <SimulationBadge />
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search trade..."
        className="mt-6 w-full rounded-[8px] border border-line bg-white px-4 py-3 text-sm outline-none ring-accent/20 focus:border-accent focus:ring-2"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Filter label="REGION" value={region} onChange={setRegion} options={REGIONS} />
        <Filter label="MODE" value={mode} onChange={setMode} options={MODES} />
        <Filter label="DIFFICULTY" value={difficulty} onChange={setDifficulty} options={DIFFS} />
        <Filter label="TYPE" value={type} onChange={setType} options={TYPES} />
        <Filter label="PRODUCT" value={product} onChange={setProduct} options={PRODUCTS} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((item) => (
          <div key={item.id}>
            <button type="button" className="w-full text-left" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <ScenarioCard scenario={item} onSelect={selectScenario} compact />
            </button>
            {expanded === item.id ? (
              <div className="mt-2 rounded-[12px] border border-line bg-white p-4">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">TRADE BRIEF</p>
                <p className="mt-2 text-sm leading-6 text-ink/80">{item.brief}</p>
                <p className="mt-2 text-sm text-muted">Maximize profit while managing trade risk.</p>
                <button
                  type="button"
                  onClick={() => selectScenario(item.id)}
                  className="mt-4 cursor-pointer rounded-[10px] bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  START TRADE →
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <button type="button" onClick={goHome} className="mt-8 text-sm font-semibold text-navy-2">
        ← BACK TO HOME
      </button>
    </div>
  )
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="text-[11px] font-semibold tracking-[0.12em] text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-2 rounded-[8px] border border-line bg-white px-2 py-1.5 text-xs font-medium text-navy"
      >
        <option value="">All</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}

function matchRegion(scenario, region) {
  const seller = getCountry(scenario.sellerCountry)?.region
  const buyer = getCountry(scenario.buyerCountry)?.region
  return seller === region || buyer === region
}
