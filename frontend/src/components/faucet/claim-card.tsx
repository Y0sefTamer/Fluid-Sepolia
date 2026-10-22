'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSwitchChain } from 'wagmi'

import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  DropletIcon,
  InfoIcon,
} from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/field'
import { TxFeedback } from '@/components/ui/tx-feedback'
import { SEPOLIA_CHAIN_ID } from '@/config/contract'
import { useClaim } from '@/hooks/use-claim'
import { useCountdown } from '@/hooks/use-countdown'
import { useFaucetStats, useUserFaucetState } from '@/hooks/use-faucet-stats'
import { getFriendlyError } from '@/lib/errors'
import { formatCooldown, formatCountdown, formatEth } from '@/lib/format'

function formatDate(timestamp: bigint) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(Number(timestamp) * 1_000))
}

export function ClaimCard() {
  const { address, isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const { pushToast } = useToast()

  const stats = useFaucetStats()
  const user = useUserFaucetState(address)
  const claim = useClaim()

  const remaining = useCountdown(user.secondsRemaining, user.dataUpdatedAt, () => {
    void user.refetch()
    void stats.refetch()
  })

  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID
  const claimAmount = stats.withdrawalAmount
  const balanceInsufficient =
    stats.balance !== undefined &&
    claimAmount !== undefined &&
    stats.balance < claimAmount
  const cooldownActive = remaining !== null && remaining > 0
  const neverClaimed = user.lastWithdrawalAt === 0n

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

  function renderAction() {
    if (!isConnected) {
      return (
        <Button fullWidth size="lg" onClick={() => openConnectModal?.()}>
          Connect wallet to claim
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      )
    }

    if (wrongNetwork) {
      return (
        <Button
          fullWidth
          size="lg"
          onClick={handleSwitch}
          loading={isSwitching}
          loadingLabel="Switching…"
        >
          Switch to Sepolia
        </Button>
      )
    }

    if (stats.isLoading || (user.isLoading && !user.isError)) {
      return (
        <Button fullWidth size="lg" loading loadingLabel="Checking eligibility…">
          Checking eligibility
        </Button>
      )
    }

    if (balanceInsufficient) {
      return (
        <a
          href="#fund"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-6 text-sm font-semibold text-warning transition hover:bg-warning/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <AlertTriangleIcon className="h-4 w-4" />
          Faucet needs funding — top it up
        </a>
      )
    }

    if (cooldownActive) {
      return (
        <Button fullWidth size="lg" disabled>
          <ClockIcon className="h-4 w-4" />
          Claim in {formatCountdown(remaining ?? 0)}
        </Button>
      )
    }

    if (claim.isSuccess) {
      return (
        <Button fullWidth size="lg" disabled>
          <CheckIcon className="h-4 w-4" />
          Claimed
        </Button>
      )
    }

    return (
      <Button
        fullWidth
        size="lg"
        onClick={claim.claim}
        disabled={!claim.simulationReady || claim.isPending}
        loading={claim.isPending}
        loadingLabel={claim.phase === 'awaiting' ? 'Confirm in wallet…' : 'Claiming…'}
      >
        <DropletIcon className="h-4 w-4" />
        {claimAmount !== undefined
          ? `Claim ${formatEth(claimAmount)} ETH`
          : 'Claim ETH'}
      </Button>
    )
  }

  const status = !isConnected
    ? { label: 'Wallet not connected', tone: 'muted' as const }
    : wrongNetwork
      ? { label: 'Wrong network', tone: 'warning' as const }
      : balanceInsufficient
        ? { label: 'Faucet empty', tone: 'danger' as const }
        : cooldownActive
          ? { label: 'Cooldown active', tone: 'warning' as const }
          : neverClaimed
            ? { label: 'Ready — first claim', tone: 'positive' as const }
            : { label: 'Ready to claim', tone: 'positive' as const }

  const toneClasses = {
    muted: 'border-line/10 bg-line/5 text-muted',
    warning: 'border-warning/20 bg-warning/10 text-warning',
    danger: 'border-danger/20 bg-danger/10 text-danger',
    positive: 'border-positive/20 bg-positive/10 text-positive',
  }

  return (
    <section
      aria-labelledby="claim-heading"
      className="gradient-border card relative h-full overflow-hidden p-5 sm:p-7"
    >
      <div
        aria-hidden
        className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <DropletIcon className="h-5 w-5" />
          </span>
          <div>
            <h2
              id="claim-heading"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Claim test ETH
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Straight from the faucet to your wallet.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${toneClasses[status.tone]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status.label}
        </span>
      </div>

      <div className="relative mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
            You receive
          </p>
          {claimAmount !== undefined ? (
            <p className="mt-1 flex items-baseline gap-2 font-mono text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {formatEth(claimAmount)}
              <span className="text-sm font-medium text-muted">ETH</span>
            </p>
          ) : stats.isLoading ? (
            <Skeleton className="mt-2 h-11 w-40" />
          ) : (
            <p className="mt-1 font-mono text-4xl font-semibold text-fg">—</p>
          )}
        </div>

        {claim.isSuccess ? (
          <span className="flex h-11 w-11 animate-check-pop items-center justify-center rounded-full border border-positive/30 bg-positive/20 text-positive">
            <CheckIcon className="h-5 w-5" />
          </span>
        ) : null}
      </div>

      <dl className="relative mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-line/10 py-5 text-sm">
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Cooldown
          </dt>
          <dd className="mt-1 font-mono text-sm text-fg">
            {stats.cooldown !== undefined ? (
              formatCooldown(stats.cooldown)
            ) : stats.isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Next claim
          </dt>
          <dd className="mt-1 font-mono text-sm text-fg">
            {!isConnected
              ? '—'
              : cooldownActive
                ? formatCountdown(remaining ?? 0)
                : 'Available now'}
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Last claim
          </dt>
          <dd className="mt-1 font-mono text-sm text-fg">
            {!isConnected
              ? '—'
              : user.isLoading
                ? '…'
                : user.lastWithdrawalAt && user.lastWithdrawalAt > 0n
                  ? formatDate(user.lastWithdrawalAt)
                  : 'Never'}
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Your donations
          </dt>
          <dd className="mt-1 font-mono text-sm text-fg">
            {!isConnected
              ? '—'
              : user.isLoading
                ? '…'
                : `${formatEth(user.totalDonated ?? 0n)} ETH`}
          </dd>
        </div>
      </dl>

      <div className="relative mt-5 space-y-3">
        {renderAction()}

        {claim.simulationError && !wrongNetwork && isConnected && !cooldownActive ? (
          <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-muted">
            <AlertTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
            <span>
              <span className="font-semibold text-fg">
                {claim.simulationError.title}.
              </span>{' '}
              {claim.simulationError.message}
            </span>
          </div>
        ) : null}

        <TxFeedback
          phase={claim.phase}
          hash={claim.hash}
          error={claim.txError ? getFriendlyError(claim.txError) : null}
          successTitle="Claim confirmed"
          successMessage="The claim amount was sent to your wallet. Your cooldown starts now."
        />

        <p className="flex items-start gap-1.5 text-[0.7rem] leading-relaxed text-muted">
          <InfoIcon className="mt-0.5 h-3 w-3 shrink-0" />
          You pay the network gas fee. The faucet sends the claim directly to your
          address — no signature or approval needed.
        </p>
      </div>
    </section>
  )
}
