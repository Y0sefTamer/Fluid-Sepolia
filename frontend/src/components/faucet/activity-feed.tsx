'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/field'
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  ClockIcon,
  CoinsIcon,
  DropletIcon,
  RefreshIcon,
  ShieldIcon,
  SparklesIcon,
} from '@/components/ui/icons'
import { CONTRACT_URL, txUrl } from '@/config/contract'
import { useActivity, type ActivityItem } from '@/hooks/use-activity'
import { formatCooldown, formatEth, formatRelativeTime, shortAddress } from '@/lib/format'

type Filter = 'all' | 'claims' | 'donations'

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'claims', label: 'Claims' },
  { key: 'donations', label: 'Donations' },
]

function titleFor(item: ActivityItem): { title: string; description: string } {
  switch (item.eventName) {
    case 'DonationReceived':
      return {
        title: 'Donation received',
        description: `from ${item.actor ? shortAddress(item.actor) : 'unknown'}`,
      }
    case 'WithdrawalMade':
      return {
        title: 'Claim sent',
        description: `to ${item.actor ? shortAddress(item.actor) : 'unknown'}`,
      }
    case 'CooldownTimeUpdated':
      return {
        title: 'Cooldown updated',
        description:
          item.oldValue !== undefined && item.newValue !== undefined
            ? `${formatCooldown(item.oldValue)} → ${formatCooldown(item.newValue)}`
            : 'Owner configuration change',
      }
    case 'WithdrawalAmountUpdated':
      return {
        title: 'Claim size updated',
        description:
          item.oldValue !== undefined && item.newValue !== undefined
            ? `${formatEth(item.oldValue)} → ${formatEth(item.newValue)} ETH`
            : 'Owner configuration change',
      }
    case 'Upgraded':
      return {
        title: 'Contract upgraded',
        description: item.implementation
          ? `implementation ${shortAddress(item.implementation)}`
          : 'New implementation',
      }
    case 'OwnershipTransferred':
      return {
        title: 'Ownership transferred',
        description:
          item.previousOwner && item.newOwner
            ? `${shortAddress(item.previousOwner)} → ${shortAddress(item.newOwner)}`
            : 'Owner changed',
      }
    default:
      return { title: 'Contract event', description: item.eventName }
  }
}

function iconFor(item: ActivityItem) {
  switch (item.kind) {
    case 'donation':
      return { Icon: CoinsIcon, className: 'border-positive/20 bg-positive/10 text-positive' }
    case 'withdrawal':
      return { Icon: DropletIcon, className: 'border-accent/20 bg-accent/10 text-accent' }
    case 'config':
      return { Icon: ClockIcon, className: 'border-warning/20 bg-warning/10 text-warning' }
    default:
      return { Icon: ShieldIcon, className: 'border-line/10 bg-line/5 text-muted' }
  }
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const { title, description } = titleFor(item)
  const { Icon, className } = iconFor(item)

  return (
    <a
      href={txUrl(item.txHash)}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-line/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${className}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-fg">{title}</p>
          {item.amount !== undefined ? (
            <span
              className={`shrink-0 font-mono text-xs font-semibold ${
                item.kind === 'donation' ? 'text-positive' : 'text-fg'
              }`}
            >
              {item.kind === 'donation' ? '+' : ''}
              {formatEth(item.amount)} ETH
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-muted">
          <span className="truncate">{description}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">
            {item.timestamp !== undefined
              ? formatRelativeTime(item.timestamp)
              : `Block ${item.blockNumber.toString()}`}
          </span>
        </div>
      </div>

      <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
    </a>
  )
}

export function ActivityFeed() {
  const [filter, setFilter] = useState<Filter>('all')
  const activity = useActivity()

  const items = useMemo(() => {
    const all = activity.data ?? []
    if (filter === 'claims') return all.filter((item) => item.kind === 'withdrawal')
    if (filter === 'donations') return all.filter((item) => item.kind === 'donation')
    return all
  }, [activity.data, filter])

  return (
    <section
      id="activity"
      aria-labelledby="activity-heading"
      className="card scroll-mt-24 overflow-hidden"
    >
      <div className="flex flex-col gap-4 border-b border-line/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="activity-heading"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Recent activity
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-positive/20 bg-positive/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-positive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
              Live
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Claims, donations and owner updates read from contract events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Filter activity"
            className="flex items-center gap-0.5 rounded-xl border border-line/10 bg-bg/30 p-0.5"
          >
            {FILTERS.map((option) => {
              const selected = filter === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFilter(option.key)}
                  aria-pressed={selected}
                  className={`rounded-lg px-2.5 py-1.5 text-[0.7rem] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    selected
                      ? 'bg-surface text-fg shadow-sm'
                      : 'text-muted hover:text-fg'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => void activity.refetch()}
            aria-label="Refresh activity"
            className="px-2.5"
          >
            <RefreshIcon
              className={activity.isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
            />
          </Button>
        </div>
      </div>

      <div className="p-2 sm:p-3">
        {activity.isLoading ? (
          <div className="space-y-1">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-3 px-2 py-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/5" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
        ) : activity.isError ? (
          <div className="m-2 flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <div>
                <p className="text-sm font-semibold text-fg">
                  Could not load contract events
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  The configured RPC may not allow historical logs. Set
                  NEXT_PUBLIC_SEPOLIA_RPC_URL to an endpoint that supports
                  eth_getLogs.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void activity.refetch()}
              className="shrink-0"
            >
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line/10 bg-line/5 text-muted">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-fg">
              {filter === 'all'
                ? 'No activity yet'
                : filter === 'claims'
                  ? 'No claims yet'
                  : 'No donations yet'}
            </p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">
              {filter === 'all'
                ? 'The faucet is quiet. Be the first to fund it and get things flowing.'
                : filter === 'claims'
                  ? 'Claims will appear here as soon as someone withdraws from the faucet.'
                  : 'Donations will appear here as soon as someone tops up the faucet.'}
            </p>
            {filter !== 'claims' ? (
              <a
                href="#fund"
                className="mt-3 text-xs font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Fund the faucet
              </a>
            ) : null}
          </div>
        ) : (
          <div className="space-y-0.5">
            {items.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line/10 px-5 py-3 text-[0.68rem] text-muted sm:px-6">
        <span>Showing up to 20 recent events from the deployment block.</span>
        <a
          href={`${CONTRACT_URL}#events`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex shrink-0 items-center gap-1 font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Etherscan
          <ArrowUpRightIcon className="h-3 w-3" />
        </a>
      </div>
    </section>
  )
}
