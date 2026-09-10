import Header from './components/Header'
import { TradeProvider, useTrade } from './context/TradeContext'
import Home from './pages/Home'
import ChooseTrade from './pages/ChooseTrade'
import Briefing from './pages/Briefing'
import TradeSimulator from './pages/TradeSimulator'
import History from './pages/History'

export default function App() {
  return (
    <TradeProvider>
      <Shell />
    </TradeProvider>
  )
}

function Shell() {
  const { view } = useTrade()

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <main>
        {view === 'home' && <Home />}
        {view === 'choose' && <ChooseTrade />}
        {view === 'briefing' && <Briefing />}
        {view === 'simulator' && <TradeSimulator />}
        {view === 'history' && <History />}
      </main>
    </div>
  )
}
