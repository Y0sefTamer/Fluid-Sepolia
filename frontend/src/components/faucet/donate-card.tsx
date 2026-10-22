'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useMemo, useState } from 'react'
import { parseEther } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'

import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import { Field, Skeleton, TextInput } from '@/components/ui/field'
import {
  AlertTriangleIcon,
  InfoIcon,
  SendIcon,
  WalletIcon,
} from '@/components/ui/icons'
import { TxFeedback } from '@/components/ui/tx-feedback'
import {
  MIN_DONATION,
  MIN_DONATION_LABEL,
  SEPOLIA_CHAIN_ID,
} from '@/config/contract'
import { useDonate } from '@/hooks/use-donate'
import { useUserFaucetState } from '@/hooks/use-faucet-stats'
import { useResetOnSuccess } from '@/hooks/use-reset-on-success'
import { getFriendlyError } from '@/lib/errors'
import { formatEth } from '@/lib/format'

const QUICK_AMOUNTS = ['0.005', '0.01', '0.05', '0.1']

export function DonateCard() {
  const [value, setValue] = useState('')
  const { address, isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const { pushToast } = useToast()
  const user = useUserFaucetState(address)

  const parsed = useMemo(() => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    try {
      return parseEther(trimmed)
    } catch {
      return null
    }
  }, [value])

  const validationError = useMemo(() => {
    if (!value.trim()) return null
    if (parsed === null || parsed === undefined || parsed <= 0n) {
      return 'Enter a valid ETH amount.'
    }
    if (parsed < MIN_DONATION) {
      return `Minimum donation is ${MIN_DONATION_LABEL} ETH.`
    }
    return null
  }, [parsed, value])

  const amountWei = parsed !== null && parsed !== undefined && parsed >= MIN_DONATION ? parsed : undefined
  const donate = useDonate(amountWei)
  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

  useResetOnSuccess(donate.isSuccess, () => setValue(''))

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
          <WalletIcon className="h-4 w-4" />
          Connect wallet to donate
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

    return (
      <Button
        fullWidth
        size="lg"
        onClick={donate.donate}
        disabled={!amountWei || !donate.simulationReady || donate.isPending}
        loading={donate.isPending}
        loadingLabel={donate.phase === 'awaiting' ? 'Confirm in wallet…' : 'Donating…'}
      >
        <SendIcon className="h-4 w-4" />
        {amountWei ? `Donate ${formatEth(amountWei)} ETH` : 'Donate ETH'}
      </Button>
    )
  }

  return (
    <section
      id="fund"
      aria-labelledby="donate-heading"
      className="card scroll-mt-24 p-5 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line/10 bg-line/5 text-accent">
          <SendIcon className="h-5 w-5" />
        </span>
        <div>
          <h2
            id="donate-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Fund the faucet
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Keep test ETH flowing for the next developer.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Field
          label="Donation amount"
          htmlFor="donation-amount"
          hint={`Min ${MIN_DONATION_LABEL} ETH`}
          error={validationError}
        >
          <div className="relative">
            <TextInput
              id="donation-amount"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              placeholder="0.00"
              value={value}
              invalid={!!validationError}
              aria-describedby="donation-amount-hint"
              onChange={(event) => setValue(event.target.value)}
              className="pr-14 font-mono text-base"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">
              ETH
            </span>
          </div>
        </Field>
        <p id="donation-amount-hint" className="sr-only">
          Enter an ETH amount of at least {MIN_DONATION_LABEL}.
        </p>

        <div className="flex flex-wrap gap-1.5" aria-label="Quick donation amounts">
          {QUICK_AMOUNTS.map((amount) => {
            const selected = value.trim() === amount
            return (
              <button
                key={amount}
                type="button"
                onClick={() => setValue(amount)}
                aria-pressed={selected}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-[0.7rem] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selected
                    ? 'border-accent/40 bg-accent/20 text-fg'
                    : 'border-line/10 bg-bg/30 text-muted hover:border-accent/30 hover:text-fg'
                }`}
              >
                {amount}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line/10 bg-bg/30 px-3.5 py-2.5 text-xs">
          <span className="text-muted">Your all-time donations</span>
          {user.isLoading && address ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span className="font-mono font-medium text-fg">
              {address ? `${formatEth(user.totalDonated ?? 0n)} ETH` : '—'}
            </span>
          )}
        </div>

        {renderAction()}

        {donate.simulationError && !wrongNetwork && isConnected ? (
          <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-muted">
            <AlertTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
            <span>
              <span className="font-semibold text-fg">
                {donate.simulationError.title}.
              </span>{' '}
              {donate.simulationError.message}
            </span>
          </div>
        ) : null}

        <TxFeedback
          phase={donate.phase}
          hash={donate.hash}
          error={donate.txError ? getFriendlyError(donate.txError) : null}
          successTitle="Donation confirmed"
          successMessage="The faucet balance has been topped up. Thank you."
        />

        <p className="flex items-start gap-1.5 text-[0.7rem] leading-relaxed text-muted">
          <InfoIcon className="mt-0.5 h-3 w-3 shrink-0" />
          Donations are non-refundable and go directly into the faucet contract.
        </p>
      </div>
    </section>
  )
}
