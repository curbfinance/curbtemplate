'use client'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { swapTokens } from '@/lib/raydium'

export default function SwapCard() {
  const { publicKey, signTransaction } = useWallet()
  const [inputAmount, setInputAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSwap = async () => {
    if (!publicKey) return
    
    setLoading(true)
    try {
      const tx = await swapTokens(
        publicKey,
        new PublicKey('So11111111111111111111111111111111111111112'), // SOL
        new PublicKey('YOUR_CURB_TOKEN_MINT'),
        Number(inputAmount),
        9 // decimals
      )
      console.log('Swap TX:', tx)
    } catch (error) {
      console.error('Swap failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="curve-card p-6">
      <h3 className="text-lg font-semibold mb-4">Swap</h3>
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder="0.0"
        className="w-full p-3 mb-4 rounded-lg border border-gray-200"
      />
      <button
        onClick={handleSwap}
        disabled={!inputAmount || loading}
        className="curve-button w-full"
      >
        {loading ? 'Swapping...' : 'Swap SOL to CURB'}
      </button>
    </div>
  )
}
