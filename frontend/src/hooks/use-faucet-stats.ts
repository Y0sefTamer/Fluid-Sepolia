'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient, useReadContract } from 'wagmi'

import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from '@/config/contract'
import { fluidSepoliaAbi } from '@/lib/abi/fluidSepolia'

type CallResult =
  | { status: 'success'; result: unknown }
  | { status: 'failure'; error: Error }
  | undefined

function toBigInt(result: CallResult): bigint | undefined {
  return result?.status === 'success' && typeof result.result === 'bigint'
    ? result.result
    : undefined
}

export function useFaucetStats() {
  const client = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })

  const query = useQuery({
    queryKey: ['fluid', 'stats', CONTRACT_ADDRESS],
    enabled: !!client,
    refetchInterval: 15_000,
    staleTime: 5_000,
    queryFn: async () => {
      if (!client) throw new Error('No Sepolia RPC client available')

      const [balance, amount, cooldown, donated] = await client.multicall({
        allowFailure: true,
        contracts: [
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getContractBalance',
          },
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getWithdrawalAmount',
          },
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getCooldownTime',
          },
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getTotalDonated',
          },
        ],
      })

      return {
        balance: toBigInt(balance),
        withdrawalAmount: toBigInt(amount),
        cooldown: toBigInt(cooldown),
        totalDonated: toBigInt(donated),
      }
    },
  })

  return {
    balance: query.data?.balance,
    withdrawalAmount: query.data?.withdrawalAmount,
    cooldown: query.data?.cooldown,
    totalDonated: query.data?.totalDonated,
    dataUpdatedAt: query.dataUpdatedAt,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}

export function useUserFaucetState(user: `0x${string}` | undefined) {
  const client = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })

  const query = useQuery({
    queryKey: ['fluid', 'user', CONTRACT_ADDRESS, user ?? 'disconnected'],
    enabled: !!client && !!user,
    refetchInterval: 20_000,
    queryFn: async () => {
      if (!client || !user) throw new Error('Wallet not connected')

      const [lastWithdrawal, remaining, donated] = await client.multicall({
        allowFailure: true,
        contracts: [
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getLastWithdrawalTime',
            args: [user],
          },
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getTimeUntilNextWithdrawal',
            args: [user],
          },
          {
            address: CONTRACT_ADDRESS,
            abi: fluidSepoliaAbi,
            functionName: 'getTotalDonations',
            args: [user],
          },
        ],
      })

      return {
        lastWithdrawalAt: toBigInt(lastWithdrawal),
        secondsRemaining: toBigInt(remaining),
        totalDonated: toBigInt(donated),
      }
    },
  })

  return {
    lastWithdrawalAt: query.data?.lastWithdrawalAt,
    secondsRemaining: query.data?.secondsRemaining,
    totalDonated: query.data?.totalDonated,
    dataUpdatedAt: query.dataUpdatedAt,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}

export function useContractOwner() {
  const query = useReadContract({
    address: CONTRACT_ADDRESS,
    chainId: SEPOLIA_CHAIN_ID,
    abi: fluidSepoliaAbi,
    functionName: 'owner',
    query: {
      refetchInterval: 60_000,
      staleTime: 30_000,
    },
  })

  return {
    owner: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
