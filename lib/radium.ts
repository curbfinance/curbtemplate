import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Liquidity, Token, TokenAmount } from '@raydium-io/raydium-sdk'

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com'

export async function swapTokens(
  wallet: Keypair,
  inputToken: PublicKey,
  outputToken: PublicKey,
  amount: number,
  decimals: number
) {
  const connection = new Connection(RPC_ENDPOINT)
  
  // 1. Prepare tokens
  const input = new Token(inputToken, decimals)
  const output = new Token(outputToken, decimals)
  const inputAmount = new TokenAmount(input, amount * 10 ** decimals)

  // 2. Find best route
  const routes = await Liquidity.getRoutes({
    connection,
    inputMint: inputToken,
    outputMint: outputToken,
    inputAmount,
    slippage: 1 // 1% slippage
  })

  // 3. Execute swap
  const { transaction } = await Liquidity.makeSwapInstruction({
    route: routes[0], // Take first/best route
    userKeys: {
      owner: wallet.publicKey,
      payer: wallet.publicKey
    }
  })

  // Sign and send transaction
  return await connection.sendTransaction(transaction, [wallet])
}

export async function addLiquidity(
  wallet: Keypair,
  tokenA: PublicKey,
  tokenB: PublicKey,
  amountA: number,
  amountB: number,
  decimals: number
) {
  const connection = new Connection(RPC_ENDPOINT)
  
  // 1. Prepare tokens
  const tokenAInst = new Token(tokenA, decimals)
  const tokenBInst = new Token(tokenB, decimals)
  const amountAInst = new TokenAmount(tokenAInst, amountA * 10 ** decimals)
  const amountBInst = new TokenAmount(tokenBInst, amountB * 10 ** decimals)

  // 2. Find pool
  const poolInfo = await Liquidity.fetchInfo({
    connection,
    tokenA: tokenAInst,
    tokenB: tokenBInst
  })

  // 3. Add liquidity
  const { transaction, signers } = await Liquidity.makeAddLiquidityInstruction({
    poolInfo,
    userKeys: {
      owner: wallet.publicKey,
      payer: wallet.publicKey
    },
    amountInA: amountAInst,
    amountInB: amountBInst
  })

  // Sign and send
  return await connection.sendTransaction(transaction, [wallet, ...signers])
}
