import dynamic from 'next/dynamic'
import SwapCard from '@/components/SwapCard'
import LiquidityCard from '@/components/LiquidityCard'

const App = dynamic(() => import('./app'), { ssr: false })
export default function Home() {
  return (
        <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SwapCard />
        <LiquidityCard />
      </div>
    </div>
    <>
      <App />
    </>
  )
}
