'use client'

import type { ComponentType, SVGProps } from 'react'

import { Button } from '@/components/ui/button'
import {
  ClockIcon,
  CoinsIcon,
  DropletIcon,
  RefreshIcon,
  SparklesIcon,
} from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/field'
import { useFaucetStats } from '@/hooks/use-faucet-stats'
import { formatCooldown, formatEth } from '@/lib/format'

interface StatCardProps {
  label: string
  value?: string
  sublabel: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  loading: boolean
}

function StatCard({ label, value, sublabel, icon: Icon, loading }: StatCardProps) {
  return (
    <div className="card card-hover p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line/10 bg-line/5 text-accent">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-3">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="stat-value">{value ?? '—'}</p>
        )}
      </div>
      <p className="mt-1.5 text-[0.72rem] text-muted">{sublabel}</p>
    </div>
  )
}

export function StatsGrid() {
  const stats = useFaucetStats()
  const loading = stats.isLoading

  const claimsLeft =
    stats.balance !== undefined &&
    stats.withdrawalAmount !== undefined &&
    stats.withdrawalAmount > 0n
      ? stats.balance / stats.withdrawalAmount
      : undefined

  const claimsLabel =
    claimsLeft === undefined
      ? 'Available to distribute'
      : claimsLeft === 0n
        ? 'Faucet needs funding'
        : `≈ ${claimsLeft > 999n ? '999+' : claimsLeft.toString()} claim${claimsLeft === 1n ? '' : 's'} available`

  return (
    <section aria-labelledby="stats-heading" className="pb-14 lg:pb-20">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2
            id="stats-heading"
            className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted"
          >
            Faucet at a glance
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void stats.refetch()}
          aria-label="Refresh faucet stats"
          className="text-muted"
        >
          <RefreshIcon className={stats.isFetching ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Faucet balance"
          value={stats.balance !== undefined ? `${formatEth(stats.balance)} ETH` : undefined}
          sublabel={claimsLabel}
          icon={DropletIcon}
          loading={loading}
        />
        <StatCard
          label="Claim size"
          value={
            stats.withdrawalAmount !== undefined
              ? `${formatEth(stats.withdrawalAmount)} ETH`
              : undefined
          }
          sublabel="Per wallet, per cooldown"
          icon={CoinsIcon}
          loading={loading}
        />
        <StatCard
          label="Cooldown"
          value={stats.cooldown !== undefined ? formatCooldown(stats.cooldown) : undefined}
          sublabel="Between claims"
          icon={ClockIcon}
          loading={loading}
        />
        <StatCard
          label="Total donated"
          value={
            stats.totalDonated !== undefined
              ? `${formatEth(stats.totalDonated)} ETH`
              : undefined
          }
          sublabel="All-time contributions"
          icon={SparklesIcon}
          loading={loading}
        />
      </div>

      {stats.isError ? (
        <div
          role="alert"
          className="mt-3 flex flex-col gap-2 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            Could not read faucet stats from the RPC. Check your connection or try
            again.
          </span>
          <Button variant="secondary" size="sm" onClick={() => void stats.refetch()}>
            Retry
          </Button>
        </div>
      ) : null}
    </section>
  )
}
