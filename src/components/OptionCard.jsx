import { CircleCheck } from 'lucide-react'

export default function OptionCard({
  selected,
  onClick,
  code,
  title,
  children,
  badge,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full cursor-pointer rounded-[12px] border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-accent bg-[#2563EB]/[0.04] shadow-[0_0_0_1px_rgba(37,99,235,0.15)]'
          : 'border-line bg-white hover:border-[#cbd5e1] hover:bg-[#fbfdff]'
      }`}
    >
      {selected ? (
        <CircleCheck className="absolute right-4 top-4 h-5 w-5 text-accent" />
      ) : null}
      <div className="flex items-start justify-between gap-3 pr-7">
        <div>
          <p className="text-lg font-semibold tracking-tight text-navy">{code}</p>
          {title ? <p className="mt-0.5 text-sm text-muted">{title}</p> : null}
        </div>
        {badge ? (
          <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white">
            {badge}
          </span>
        ) : null}
      </div>
      {children ? <div className="mt-3 text-sm leading-6 text-muted">{children}</div> : null}
    </button>
  )
}
