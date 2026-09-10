import { useEffect, useState } from 'react'

export default function CountUp({ value, duration = 900, formatter }) {
  const target = Number(value) || 0
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    const to = Number(value) || 0
    let start = null
    let raf = 0
    setDisplay(0)

    const tick = (now) => {
      if (start == null) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplay(to * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    const fallback = window.setTimeout(() => setDisplay(to), duration)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fallback)
    }
  }, [value, duration])

  return <>{formatter ? formatter(display) : Math.round(display).toLocaleString('en-US')}</>
}
