'use client'

import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import type { TxPhase } from '@/components/ui/tx-feedback'
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID, txUrl } from '@/config/contract'
import { useTxErrorToast, useTxSuccessToast } from '@/hooks/use-tx-effects'
import { fluidSepoliaAbi } from '@/lib/abi/fluidSepolia'
import { getFriendlyError } from '@/lib/errors'

function toPhase(
  writePending: boolean,
  hash: `0x${string}` | undefined,
  receiptLoading: boolean,
  receiptSuccess: boolean,
  hasError: boolean,
): TxPhase {
  if (writePending) return 'awaiting'
  if (hash && receiptLoading) return 'pending'
  if (receiptSuccess) return 'success'
  if (hasError) return 'error'
  return 'idle'
}

export function useUpdateWithdrawalAmount(amountWei: bigint | undefined) {
  const { address, chainId } = useAccount()
  const onSepolia = chainId === SEPOLIA_CHAIN_ID
  const validAmount = amountWei !== undefined && amountWei > 0n

  const simulation = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: fluidSepoliaAbi,
    functionName: 'updateWithdrawalAmount',
    args: validAmount ? [amountWei] : undefined,
    account: address,
    query: { enabled: !!address && onSepolia && validAmount },
  })

  const write = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash: write.data,
    query: { enabled: !!write.data },
  })

  useTxSuccessToast({
    hash: write.data,
    isSuccess: receipt.isSuccess,
    title: 'Withdrawal amount updated',
  })
  useTxErrorToast(write.error ?? receipt.error)

  const submit = () => {
    if (!simulation.data) return
    write.writeContract(simulation.data.request)
  }

  return {
    submit,
    phase: toPhase(
      write.isPending,
      write.data,
      receipt.isLoading,
      receipt.isSuccess,
      !!write.error || !!receipt.error,
    ),
    hash: write.data,
    isSimulating: simulation.isLoading,
    simulationError: simulation.error ? getFriendlyError(simulation.error) : null,
    simulationReady: !!simulation.data,
    isPending: write.isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    txError: write.error ?? receipt.error,
    explorerUrl: write.data ? txUrl(write.data) : undefined,
  }
}

export function useUpdateCooldownTime(seconds: bigint | undefined) {
  const { address, chainId } = useAccount()
  const onSepolia = chainId === SEPOLIA_CHAIN_ID
  const validSeconds = seconds !== undefined && seconds > 0n

  const simulation = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: fluidSepoliaAbi,
    functionName: 'updateCooldownTime',
    args: validSeconds ? [seconds] : undefined,
    account: address,
    query: { enabled: !!address && onSepolia && validSeconds },
  })

  const write = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash: write.data,
    query: { enabled: !!write.data },
  })

  useTxSuccessToast({
    hash: write.data,
    isSuccess: receipt.isSuccess,
    title: 'Cooldown updated',
  })
  useTxErrorToast(write.error ?? receipt.error)

  const submit = () => {
    if (!simulation.data) return
    write.writeContract(simulation.data.request)
  }

  return {
    submit,
    phase: toPhase(
      write.isPending,
      write.data,
      receipt.isLoading,
      receipt.isSuccess,
      !!write.error || !!receipt.error,
    ),
    hash: write.data,
    isSimulating: simulation.isLoading,
    simulationError: simulation.error ? getFriendlyError(simulation.error) : null,
    simulationReady: !!simulation.data,
    isPending: write.isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    txError: write.error ?? receipt.error,
    explorerUrl: write.data ? txUrl(write.data) : undefined,
  }
}

export function useTransferOwnership(newOwner: `0x${string}` | undefined) {
  const { address, chainId } = useAccount()
  const onSepolia = chainId === SEPOLIA_CHAIN_ID

  const simulation = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: fluidSepoliaAbi,
    functionName: 'transferOwnership',
    args: newOwner ? [newOwner] : undefined,
    account: address,
    query: { enabled: !!address && onSepolia && !!newOwner },
  })

  const write = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash: write.data,
    query: { enabled: !!write.data },
  })

  useTxSuccessToast({
    hash: write.data,
    isSuccess: receipt.isSuccess,
    title: 'Ownership transferred',
  })
  useTxErrorToast(write.error ?? receipt.error)

  const submit = () => {
    if (!simulation.data) return
    write.writeContract(simulation.data.request)
  }

  return {
    submit,
    phase: toPhase(
      write.isPending,
      write.data,
      receipt.isLoading,
      receipt.isSuccess,
      !!write.error || !!receipt.error,
    ),
    hash: write.data,
    isSimulating: simulation.isLoading,
    simulationError: simulation.error ? getFriendlyError(simulation.error) : null,
    simulationReady: !!simulation.data,
    isPending: write.isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    txError: write.error ?? receipt.error,
    explorerUrl: write.data ? txUrl(write.data) : undefined,
  }
}

export function useRenounceOwnership(confirmed: boolean) {
  const { address, chainId } = useAccount()
  const onSepolia = chainId === SEPOLIA_CHAIN_ID

  const simulation = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: fluidSepoliaAbi,
    functionName: 'renounceOwnership',
    account: address,
    query: { enabled: !!address && onSepolia && confirmed },
  })

  const write = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash: write.data,
    query: { enabled: !!write.data },
  })

  useTxSuccessToast({
    hash: write.data,
    isSuccess: receipt.isSuccess,
    title: 'Ownership renounced',
    description: 'The contract now has no owner and can no longer be configured.',
  })
  useTxErrorToast(write.error ?? receipt.error)

  const submit = () => {
    if (!simulation.data) return
    write.writeContract(simulation.data.request)
  }

  return {
    submit,
    phase: toPhase(
      write.isPending,
      write.data,
      receipt.isLoading,
      receipt.isSuccess,
      !!write.error || !!receipt.error,
    ),
    hash: write.data,
    isSimulating: simulation.isLoading,
    simulationError: simulation.error ? getFriendlyError(simulation.error) : null,
    simulationReady: !!simulation.data,
    isPending: write.isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    txError: write.error ?? receipt.error,
    explorerUrl: write.data ? txUrl(write.data) : undefined,
  }
}
