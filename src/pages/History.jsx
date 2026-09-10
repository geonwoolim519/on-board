import { ACHIEVEMENTS } from '../data/achievements'
import { formatKRW } from '../data/currencies'
import { useTrade } from '../context/TradeContext'

export default function History() {
  const { stats, goHome, goChoose, justUnlocked } = useTrade()
  const history = stats.history || []
  const unlocked = new Set(stats.unlocked || [])

  return (
    <div className="ob-fade mx-auto max-w-[960px] px-4 py-10 md:px-6 md:py-12">
      <p className="text-xs font-semibold tracking-[0.18em] text-accent">MY TRADES</p>
      <h1 className="mt-3 text-[32px] font-semibold text-navy">세션 거래 기록</h1>
      <p className="mt-2 text-sm text-muted">로그인은 없지만 이 브라우저에 완료한 거래를 저장합니다.</p>

      {justUnlocked?.length ? (
        <div className="mt-6 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
          {justUnlocked.map((item) => (
            <p key={item.id} className="text-sm font-semibold text-navy">
              🏆 {item.title} — {item.description}
            </p>
          ))}
        </div>
      ) : null}

      <div className="mt-8 space-y-3">
        {history.length === 0 ? (
          <p className="text-sm text-muted">아직 완료한 거래가 없습니다.</p>
        ) : (
          history.map((item) => (
            <article key={item.id} className="rounded-[12px] border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">{item.route}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.product} · {item.incoterm} · {item.transport}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular text-navy">Score {item.score}</p>
              </div>
              <p className="mt-2 text-sm tabular text-muted">
                {formatKRW(item.profit)} · {new Date(item.date).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>

      <h2 className="mt-12 text-lg font-semibold text-navy">ACHIEVEMENTS</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((item) => (
          <div
            key={item.id}
            className={`rounded-[12px] border p-4 ${unlocked.has(item.id) ? 'border-navy bg-white' : 'border-line bg-bg/60 opacity-70'}`}
          >
            <p className="text-sm font-semibold text-navy">
              {unlocked.has(item.id) ? '🏆 ' : ''}
              {item.title}
            </p>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <button type="button" onClick={goHome} className="text-sm font-semibold text-navy-2">
          ← HOME
        </button>
        <button type="button" onClick={goChoose} className="text-sm font-semibold text-accent">
          START NEW TRADE →
        </button>
      </div>
    </div>
  )
}
