export default function SimulationBadge({ className = '' }) {
  return (
    <span className={`inline-flex rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-muted ${className}`}>
      SIMULATION DATA
    </span>
  )
}
