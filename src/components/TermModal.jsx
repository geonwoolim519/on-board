import { X } from 'lucide-react'
import { TERMS } from '../data/terms'
import Button from './Button'

export default function TermModal({ termKey, onClose }) {
  if (!termKey) return null
  const term = TERMS[termKey]
  if (!term) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-4 sm:items-center">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="닫기" />
      <div className="ob-reveal relative z-10 w-full max-w-md rounded-[12px] border border-line bg-white p-6 shadow-[0_12px_40px_rgba(11,31,51,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-navy">{term.title}</p>
            <p className="mt-1 text-sm text-muted">{term.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-[15px] leading-7 text-ink/80">{term.body}</p>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  )
}
