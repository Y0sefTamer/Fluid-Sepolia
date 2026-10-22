'use client'

import { useAccount } from 'wagmi'

import { SEPOLIA_CHAIN_ID } from '@/config/contract'
import { cn } from '@/lib/cn'

export function NetworkBadge() {
  const { chainId, isConnected } = useAccount()
  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

  return (
    <span
      title={wrongNetwork ? 'Switch your wallet to Sepolia' : 'Sepolia testnet'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide',
        wrongNetwork
          ? 'border-warning/30 bg-warning/10 text-warning'
          : 'border-line/10 bg-surface/60 text-muted',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          wrongNetwork ? 'bg-warning' : 'bg-positive',
        )}
      />
      {wrongNetwork ? 'Wrong network' : 'Sepolia'}
    </span>
  )
}
