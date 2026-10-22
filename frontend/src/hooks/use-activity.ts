'use client'

import { useQuery } from '@tanstack/react-query'
import { parseEventLogs, type Address, type Hash, type PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

import {
  ACTIVITY_FROM_BLOCK,
  CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
} from '@/config/contract'
import { fluidSepoliaAbi } from '@/lib/abi/fluidSepolia'

export type ActivityKind = 'donation' | 'withdrawal' | 'config' | 'system'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  eventName: string
  actor?: Address
  amount?: bigint
  oldValue?: bigint
  newValue?: bigint
  implementation?: Address
  previousOwner?: Address
  newOwner?: Address
  txHash: Hash
  blockNumber: bigint
  logIndex: number
  timestamp?: bigint
}

const MAX_ITEMS = 20

async function fetchActivity(client: PublicClient): Promise<ActivityItem[]> {
  const logs = await client.getLogs({
    address: CONTRACT_ADDRESS,
    fromBlock: ACTIVITY_FROM_BLOCK,
    toBlock: 'latest',
  })

  const parsed = parseEventLogs({
    abi: fluidSepoliaAbi,
    logs,
    strict: false,
  })

  const items: ActivityItem[] = []

  for (const log of parsed) {
    if (!log.blockNumber || !log.transactionHash) continue

    const base = {
      id: `${log.transactionHash}-${log.logIndex}`,
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      eventName: log.eventName,
    }

    switch (log.eventName) {
      case 'DonationReceived':
        items.push({
          ...base,
          kind: 'donation',
          actor: log.args.donor,
          amount: log.args.amount,
        })
        break
      case 'WithdrawalMade':
        items.push({
          ...base,
          kind: 'withdrawal',
          actor: log.args.recipient,
          amount: log.args.amount,
        })
        break
      case 'CooldownTimeUpdated':
        items.push({
          ...base,
          kind: 'config',
          oldValue: log.args.oldCooldownTime,
          newValue: log.args.newCooldownTime,
        })
        break
      case 'WithdrawalAmountUpdated':
        items.push({
          ...base,
          kind: 'config',
          oldValue: log.args.oldWithdrawalAmount,
          newValue: log.args.newWithdrawalAmount,
        })
        break
      case 'Upgraded':
        items.push({
          ...base,
          kind: 'system',
          implementation: log.args.implementation,
        })
        break
      case 'OwnershipTransferred':
        items.push({
          ...base,
          kind: 'system',
          previousOwner: log.args.previousOwner,
          newOwner: log.args.newOwner,
        })
        break
      default:
        break
    }
  }

  items.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) return b.logIndex - a.logIndex
    return a.blockNumber > b.blockNumber ? -1 : 1
  })

  const latest = items.slice(0, MAX_ITEMS)
  const blockNumbers = [...new Set(latest.map((item) => item.blockNumber.toString()))]

  const blockResults = await Promise.allSettled(
    blockNumbers.map((blockNumber) =>
      client.getBlock({ blockNumber: BigInt(blockNumber) }),
    ),
  )

  const timestamps = new Map<string, bigint>()
  blockResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      timestamps.set(blockNumbers[index], result.value.timestamp)
    }
  })

  return latest.map((item) => ({
    ...item,
    timestamp: timestamps.get(item.blockNumber.toString()),
  }))
}

export function useActivity() {
  const client = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })

  return useQuery({
    queryKey: ['faucet-activity', CONTRACT_ADDRESS, ACTIVITY_FROM_BLOCK.toString()],
    queryFn: () => {
      if (!client) throw new Error('No Sepolia RPC client available')
      return fetchActivity(client)
    },
    enabled: !!client,
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  })
}
