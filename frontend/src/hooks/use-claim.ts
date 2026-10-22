'use client'

import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import type { TxPhase } from '@/components/ui/tx-feedback'
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID, txUrl } from '@/config/contract'
import { useTxErrorToast, useTxSuccessToast } from '@/hooks/use-tx-effects'
import { fluidSepoliaAbi } from '@/lib/abi/fluidSepolia'
import { getFriendlyError } from '@/lib/errors'

export function useClaim() {
  const { address, chainId } = useAccount()
  const onSepolia = chainId === SEPOLIA_CHAIN_ID

  const simulation = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: fluidSepoliaAbi,
    functionName: 'withdraw',
    account: address,
    query: {
      enabled: !!address && onSepolia,
    },
  })

  const write = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash: write.data,
    query: { enabled: !!write.data },
  })

  useTxSuccessToast({
    hash: write.data,
    isSuccess: receipt.isSuccess,
    title: 'Claim confirmed',
    description: 'The faucet sent the claim amount to your wallet.',
  })
  useTxErrorToast(write.error ?? receipt.error)

  const claim = () => {
    if (!simulation.data) return
    write.writeContract(simulation.data.request)
  }

  let phase: TxPhase = 'idle'
  if (write.isPending) phase = 'awaiting'
  else if (write.data && receipt.isLoading) phase = 'pending'
  else if (receipt.isSuccess) phase = 'success'
  else if (write.error || receipt.error) phase = 'error'

  return {
    claim,
    phase,
    hash: write.data,
    isSimulating: simulation.isLoading,
    isSimulationError: simulation.isError,
    simulationError: simulation.error ? getFriendlyError(simulation.error) : null,
    simulationReady: !!simulation.data,
    isPending: write.isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    txError: write.error ?? receipt.error,
    canSimulate: !!address && onSepolia,
    explorerUrl: write.data ? txUrl(write.data) : undefined,
  }
}
