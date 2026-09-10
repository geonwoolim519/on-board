import { useState } from 'react'
import { CircleAlert, X } from 'lucide-react'
import { TERMS } from '../data/terms'
import Button from './Button'

export default function WarningCard({ warning, dismissed, onDismiss, onExplain }) {
  const [whyOpen, setWhyOpen] = useState(false)
  if (!warning || dismissed) return null

  const term = warning.term ? TERMS[warning.term] : null
  const isInfo = warning.tone === 'info'

  return (
    <div
      className={`rounded-[12px] border p-4 ${
        isInfo ? 'border-[#bfdbfe] bg-[#eff6ff]' : 'border-[#fde68a] bg-[#fffbeb]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <CircleAlert className={`mt-0.5 h-5 w-5 ${isInfo ? 'text-accent' : 'text-warn'}`} />
          <div>
            <p className={`text-[11px] font-semibold tracking-[0.16em] ${isInfo ? 'text-accent' : 'text-warn'}`}>
              {warning.title}
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">{warning.headline}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{warning.body}</p>
            {whyOpen && warning.why ? (
              <p className="mt-3 rounded-[8px] bg-white/80 px-3 py-2 text-sm leading-6 text-ink/80">{warning.why}</p>
            ) : null}
          </div>
        </div>
        <button type="button" onClick={onDismiss} className="text-muted hover:text-ink" aria-label="닫기">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {term ? (
          <Button variant="secondary" className="!py-2 text-xs" onClick={() => onExplain(warning.term)}>
            VIEW EXPLANATION
          </Button>
        ) : null}
        {warning.why ? (
          <Button variant="ghost" className="!py-2 text-xs" onClick={() => setWhyOpen((open) => !open)}>
            WHY?
          </Button>
        ) : null}
        <Button variant="ghost" className="!py-2 text-xs" onClick={onDismiss}>
          UNDERSTAND
        </Button>
      </div>
    </div>
  )
}
