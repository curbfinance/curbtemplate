'use client'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { addLiquidity } from '@/lib/raydium'

export default function LiquidityCard() {
  const { publicKey } = useWallet()
  const [curbAmount, setCurbAmount] = useState('')
  const [solAmount, setSolAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddLiquidity = async () => {
    if (!publicKey) return
    
    setLoading(true)
    try {
      const tx = await addLiquidity(
        publicKey,
        new PublicKey('YOUR_CURB_TOKEN_MINT'),
        new PublicKey('So11111111111111111111111111111111111111112'), // SOL
        Number(curbAmount),
        Number(solAmount),
        9 // decimals
      )
      console.log('Liquidity TX:', tx)
    } catch (error) {
      console.error('Add liquidity failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="curve-card p-6">
      <h3 className="text-lg font-semibold mb-4">Add Liquidity</h3>
      <input
        type="number"
        value={curbAmount}
        onChange={(e) => setCurbAmount(e.target.value)}
        placeholder="CURB amount"
        className="w-full p-3 mb-2 rounded-lg border border-gray-200"
      />
      <input
        type="number"
        value={solAmount}
        onChange={(e) => setSolAmount(e.target.value)}
        placeholder="SOL amount"
        className="w-full p-3 mb-4 rounded-lg border border-gray-200"
      />
      <button
        onClick={handleAddLiquidity}
        disabled={!curbAmount || !solAmount || loading}
        className="curve-button w-full"
      >
        {loading ? 'Adding...' : 'Add Liquidity'}
      </button>
    </div>
  )
}
