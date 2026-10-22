'use client'

import { useAccount, useSwitchChain } from 'wagmi'

import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import { AlertTriangleIcon } from '@/components/ui/icons'
import { SEPOLIA_CHAIN_ID } from '@/config/contract'
import { getFriendlyError } from '@/lib/errors'

export function WrongNetworkBanner() {
  const { isConnected, chainId } = useAccount()
  const { switchChainAsync, isPending } = useSwitchChain()
  const { pushToast } = useToast()

  if (!isConnected || chainId === SEPOLIA_CHAIN_ID) return null

  async function handleSwitch() {
    try {
      await switchChainAsync({ chainId: SEPOLIA_CHAIN_ID })
    } catch (error) {
      const friendly = getFriendlyError(error)
      pushToast({
        title: friendly.title,
        description: friendly.message,
        variant: friendly.kind === 'rejected' ? 'info' : 'error',
      })
    }
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-6xl px-4 sm:px-6">
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-semibold text-fg">You are on the wrong network</p>
            <p className="mt-0.5 text-xs text-muted">
              Fluid only works on Sepolia. Switch your wallet to continue.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleSwitch}
          loading={isPending}
          loadingLabel="Switching…"
          className="shrink-0"
        >
          Switch to Sepolia
        </Button>
      </div>
    </div>
  )
}
