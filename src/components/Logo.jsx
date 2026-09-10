export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 520 88"
        className={compact ? 'h-9 w-auto md:h-10' : 'h-10 w-auto md:h-11'}
        aria-hidden
      >
        <circle cx="30" cy="30" r="18" fill="none" stroke="#0B1F33" strokeWidth="9" />
        <path
          d="M8 44c10-6 22-18 40-28"
          stroke="#2563EB"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M44 6l16 4-9 13z" fill="#2563EB" />
        <g fill="#0B1F33" fontFamily="Inter, Arial, sans-serif" fontSize="34" fontWeight="800">
          <text x="62" y="42">N</text>
          <text x="108" y="42">B</text>
          <text x="152" y="42">O</text>
          <text x="244" y="42">R</text>
          <text x="286" y="42">D</text>
        </g>
        <path d="M208 12l18 30h-36z" fill="#2563EB" />
        <text
          x="62"
          y="74"
          fill="#6B7280"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="11"
          fontWeight="600"
          letterSpacing="4.5"
        >
          TRADE SIMULATOR
        </text>
      </svg>
    </div>
  )
}
