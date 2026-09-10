export default function Button({
  variant = 'primary',
  children,
  disabled,
  onClick,
  type = 'button',
  className = '',
}) {
  const styles = {
    primary:
      'bg-accent text-white hover:bg-[#1d4ed8] shadow-[0_1px_0_rgba(15,23,42,0.06)]',
    navy: 'bg-navy text-white hover:bg-navy-2',
    secondary: 'border border-line bg-white text-ink hover:bg-bg',
    ghost: 'text-navy-2 hover:bg-white',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
