import { ArrowRight } from 'lucide-react'
import Button from './Button'

export default function StepLayout({
  kicker,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = 'NEXT STEP',
  nextDisabled,
  hint,
  wide = false,
}) {
  return (
    <div className="ob-fade py-8 md:py-10">
      <div className={wide ? 'max-w-3xl' : 'grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12'}>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent">{kicker}</p>
          <h1 className="mt-3 text-[28px] font-semibold leading-tight text-navy md:text-[34px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted">{description}</p>
          ) : null}
        </div>
        {wide ? null : <div>{children}</div>}
      </div>
      {wide ? <div className="mt-8">{children}</div> : null}

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          BACK
        </Button>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {hint && nextDisabled ? (
            <p className="text-xs text-muted">{hint}</p>
          ) : null}
          <Button onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
