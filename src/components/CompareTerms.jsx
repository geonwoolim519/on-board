import { X } from 'lucide-react'
import { INCOTERMS } from '../data/incoterms'
import Button from './Button'
import SimulationBadge from './SimulationBadge'

export default function CompareTerms({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-4 sm:items-center">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="닫기" />
      <div className="ob-reveal relative z-10 max-h-[86vh] w-full max-w-5xl overflow-hidden rounded-[12px] border border-line bg-white shadow-[0_12px_40px_rgba(11,31,51,0.12)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-lg font-semibold text-navy">COMPARE TERMS</p>
            <p className="mt-1 text-sm text-muted">Incoterms® 2020 · educational summary</p>
          </div>
          <div className="flex items-center gap-3">
            <SimulationBadge />
            <button type="button" onClick={onClose} className="text-muted hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-bg text-[11px] tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">TERM</th>
                <th className="px-3 py-3 font-semibold">MODE</th>
                <th className="px-3 py-3 font-semibold">EXPORT</th>
                <th className="px-3 py-3 font-semibold">FREIGHT</th>
                <th className="px-3 py-3 font-semibold">INSURANCE</th>
                <th className="px-3 py-3 font-semibold">IMPORT</th>
                <th className="px-3 py-3 font-semibold">SELLER COST</th>
                <th className="px-3 py-3 font-semibold">BUYER COST</th>
                <th className="px-3 py-3 font-semibold">RISK TRANSFER</th>
              </tr>
            </thead>
            <tbody>
              {INCOTERMS.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold text-navy">
                    {item.name}
                    <span className="mt-0.5 block text-xs font-normal text-muted">{item.full}</span>
                  </td>
                  <td className="px-3 py-3 text-muted">{item.group === 'SEA' ? 'Sea / waterway' : 'Any mode'}</td>
                  <td className="px-3 py-3">{item.exportClearance}</td>
                  <td className="px-3 py-3">{item.mainCarriage}</td>
                  <td className="px-3 py-3">{item.insurance}</td>
                  <td className="px-3 py-3">{item.importClearance}</td>
                  <td className="px-3 py-3 text-muted">{item.sellerCost}</td>
                  <td className="px-3 py-3 text-muted">{item.buyerCost}</td>
                  <td className="px-3 py-3 text-muted">{item.riskTransfer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end border-t border-line px-5 py-3">
          <Button variant="secondary" onClick={onClose}>
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  )
}
