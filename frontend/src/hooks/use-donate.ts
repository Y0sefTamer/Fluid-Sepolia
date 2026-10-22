'use client'

import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import type { TxPhase } from '@/components/ui/tx-feedback'
import {
  CONTRACT_ADDRESS,
  MIN_DONATION,
  SEPOLIA_CHAIN_ID,
  txUrl,
} from '@/config/contract'
import { useTxErrorToast, useTxSuccessToast } from '@/hooks/use-tx-effects'
import { fluidSepoliaAbi } from '@/lib/abi/fluidSepolia'
import { getFriendlyError } from '@/lib/errors'

export function useDonate(amountWei: bigint | undefined) {
  const { address, chainId } = useAccount()
  const onSepolia = chainId === SEPOLIA_CHAIN_ID
  const validAmount = amountWei !== undefined && amountWei >= MIN_DONATION

  const simulation = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: fluidSepoliaAbi,
    functionName: 'donate',
    account: address,
    value: amountWei,
    query: {
      enabled: !!address && onSepolia && validAmount,
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
    title: 'Donation confirmed',
    description: 'Thank you for keeping the faucet funded for the next developer.',
  })
  useTxErrorToast(write.error ?? receipt.error)

  const donate = () => {
    if (!simulation.data) return
    write.writeContract(simulation.data.request)
  }

  let phase: TxPhase = 'idle'
  if (write.isPending) phase = 'awaiting'
  else if (write.data && receipt.isLoading) phase = 'pending'
  else if (receipt.isSuccess) phase = 'success'
  else if (write.error || receipt.error) phase = 'error'

  return {
    donate,
    phase,
    hash: write.data,
    isSimulating: simulation.isLoading,
    isSimulationError: simulation.isError,
    simulationError: simulation.error ? getFriendlyError(simulation.error) : null,
    simulationReady: !!simulation.data,
    isPending: write.isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    txError: write.error ?? receipt.error,
    canSimulate: !!address && onSepolia && validAmount,
    explorerUrl: write.data ? txUrl(write.data) : undefined,
  }
}
