'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { getAddress, isAddress, parseEther } from 'viem'
import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Field, TextInput } from '@/components/ui/field'
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  ShieldIcon,
} from '@/components/ui/icons'
import { TxFeedback, type TxPhase } from '@/components/ui/tx-feedback'
import { useContractOwner, useFaucetStats } from '@/hooks/use-faucet-stats'
import { useResetOnSuccess } from '@/hooks/use-reset-on-success'
import {
  useRenounceOwnership,
  useTransferOwnership,
  useUpdateCooldownTime,
  useUpdateWithdrawalAmount,
} from '@/hooks/use-owner-actions'
import { getFriendlyError, type FriendlyError } from '@/lib/errors'
import { formatCooldown, formatEth, shortAddress } from '@/lib/format'

const COOLDOWN_PRESETS = [
  { label: '1h', seconds: '3600' },
  { label: '6h', seconds: '21600' },
  { label: '12h', seconds: '43200' },
  { label: '24h', seconds: '86400' },
  { label: '7d', seconds: '604800' },
]

function SimulationError({ error }: { error: FriendlyError | null }) {
  if (!error) return null
  return (
    <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-muted">
      <AlertTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
      <span>
        <span className="font-semibold text-fg">{error.title}.</span> {error.message}
      </span>
    </div>
  )
}

function FormShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-line/10 bg-bg/30 p-4 sm:p-5">
      <p className="text-sm font-semibold text-fg">{title}</p>
      <p className="mt-0.5 text-xs text-muted">{description}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  )
}

function AmountForm() {
  const stats = useFaucetStats()
  const [value, setValue] = useState('')

  const parsed = useMemo(() => {
    if (!value.trim()) return undefined
    try {
      return parseEther(value.trim())
    } catch {
      return null
    }
  }, [value])

  const error = useMemo(() => {
    if (!value.trim()) return null
    if (parsed === null || parsed === undefined || parsed <= 0n) {
      return 'Enter a positive ETH amount.'
    }
    return null
  }, [parsed, value])

  const amountWei = parsed !== null && parsed !== undefined && parsed > 0n ? parsed : undefined
  const action = useUpdateWithdrawalAmount(amountWei)

  useResetOnSuccess(action.isSuccess, () => setValue(''))

  return (
    <FormShell
      title="Claim size"
      description="The amount sent to each wallet on withdraw()."
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">Current</span>
        <span className="font-mono font-medium text-fg">
          {stats.withdrawalAmount !== undefined
            ? `${formatEth(stats.withdrawalAmount)} ETH`
            : '—'}
        </span>
      </div>

      <Field label="New amount" htmlFor="owner-amount" hint="ETH" error={error}>
        <TextInput
          id="owner-amount"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder={
            stats.withdrawalAmount !== undefined
              ? formatEth(stats.withdrawalAmount)
              : '0.05'
          }
          value={value}
          invalid={!!error}
          onChange={(event) => setValue(event.target.value)}
          className="font-mono"
        />
      </Field>

      {amountWei ? (
        <p className="text-[0.7rem] text-muted">
          New claim size:{' '}
          <span className="font-mono text-fg">{formatEth(amountWei)} ETH</span>
        </p>
      ) : null}

      <Button
        size="md"
        fullWidth
        onClick={action.submit}
        disabled={!action.simulationReady || action.isPending || !!error}
        loading={action.isPending}
        loadingLabel="Updating…"
      >
        Update claim size
      </Button>

      <SimulationError error={action.simulationError} />
      <TxFeedback
        phase={action.phase as TxPhase}
        hash={action.hash}
        error={action.txError ? getFriendlyError(action.txError) : null}
        successTitle="Claim size updated"
        successMessage="The new amount applies to the next withdrawal."
      />
    </FormShell>
  )
}

function CooldownForm() {
  const stats = useFaucetStats()
  const [value, setValue] = useState('')

  const seconds = useMemo(() => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    if (!/^\d+$/.test(trimmed)) return null
    return BigInt(trimmed)
  }, [value])

  const error = useMemo(() => {
    if (!value.trim()) return null
    if (seconds === null || seconds === undefined || seconds <= 0n) {
      return 'Enter a positive whole number of seconds.'
    }
    return null
  }, [seconds, value])

  const validSeconds =
    seconds !== null && seconds !== undefined && seconds > 0n ? seconds : undefined
  const action = useUpdateCooldownTime(validSeconds)

  useResetOnSuccess(action.isSuccess, () => setValue(''))

  return (
    <FormShell
      title="Cooldown"
      description="Seconds a wallet must wait between claims."
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">Current</span>
        <span className="font-mono font-medium text-fg">
          {stats.cooldown !== undefined ? formatCooldown(stats.cooldown) : '—'}
        </span>
      </div>

      <Field label="New cooldown" htmlFor="owner-cooldown" hint="seconds" error={error}>
        <TextInput
          id="owner-cooldown"
          inputMode="numeric"
          autoComplete="off"
          placeholder={stats.cooldown !== undefined ? stats.cooldown.toString() : '86400'}
          value={value}
          invalid={!!error}
          onChange={(event) => setValue(event.target.value)}
          className="font-mono"
        />
      </Field>

      <div className="flex flex-wrap gap-1.5">
        {COOLDOWN_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setValue(preset.seconds)}
            aria-pressed={value.trim() === preset.seconds}
            className={`rounded-lg border px-2.5 py-1 font-mono text-[0.68rem] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              value.trim() === preset.seconds
                ? 'border-accent/40 bg-accent/20 text-fg'
                : 'border-line/10 bg-bg/30 text-muted hover:border-accent/30 hover:text-fg'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {validSeconds ? (
        <p className="text-[0.7rem] text-muted">
          New cooldown:{' '}
          <span className="font-mono text-fg">{formatCooldown(validSeconds)}</span>
        </p>
      ) : null}

      <Button
        size="md"
        fullWidth
        onClick={action.submit}
        disabled={!action.simulationReady || action.isPending || !!error}
        loading={action.isPending}
        loadingLabel="Updating…"
      >
        Update cooldown
      </Button>

      <SimulationError error={action.simulationError} />
      <TxFeedback
        phase={action.phase as TxPhase}
        hash={action.hash}
        error={action.txError ? getFriendlyError(action.txError) : null}
        successTitle="Cooldown updated"
        successMessage="The new cooldown applies immediately to future claims."
      />
    </FormShell>
  )
}

function DangerZone() {
  const [newOwner, setNewOwner] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const target = useMemo(
    () => (isAddress(newOwner.trim()) ? getAddress(newOwner.trim()) : undefined),
    [newOwner],
  )
  const addressError =
    newOwner.trim().length > 0 && !target ? 'Enter a valid EVM address.' : null

  const transfer = useTransferOwnership(target)
  const renounce = useRenounceOwnership(confirmation === 'RENOUNCE')

  useResetOnSuccess(transfer.isSuccess, () => setNewOwner(''))
  useResetOnSuccess(renounce.isSuccess, () => setConfirmation(''))

  return (
    <details className="group rounded-2xl border border-danger/20 bg-danger/5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-5">
        <div>
          <p className="text-sm font-semibold text-fg">Advanced ownership actions</p>
          <p className="mt-0.5 text-xs text-muted">
            Transfer or renounce ownership. These actions cannot be undone.
          </p>
        </div>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" />
      </summary>

      <div className="space-y-5 border-t border-danger/20 px-4 py-4 sm:px-5">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-fg">Transfer ownership</p>
            <p className="mt-0.5 text-xs text-muted">
              The new owner gains control of claim size, cooldown and upgrades.
            </p>
          </div>
          <Field
            label="New owner address"
            htmlFor="owner-transfer"
            error={addressError}
          >
            <TextInput
              id="owner-transfer"
              autoComplete="off"
              spellCheck={false}
              placeholder="0x…"
              value={newOwner}
              invalid={!!addressError}
              onChange={(event) => setNewOwner(event.target.value)}
              className="font-mono text-xs sm:text-sm"
            />
          </Field>
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={transfer.submit}
            disabled={!transfer.simulationReady || transfer.isPending}
            loading={transfer.isPending}
            loadingLabel="Transferring…"
          >
            Transfer ownership
          </Button>
          <SimulationError error={transfer.simulationError} />
          <TxFeedback
            phase={transfer.phase as TxPhase}
            hash={transfer.hash}
            error={transfer.txError ? getFriendlyError(transfer.txError) : null}
            successTitle="Ownership transferred"
            successMessage="You are no longer the owner of this contract."
          />
        </div>

        <div className="space-y-3 border-t border-danger/20 pt-5">
          <div>
            <p className="text-sm font-semibold text-fg">Renounce ownership</p>
            <p className="mt-0.5 text-xs text-muted">
              This permanently removes the owner. Claim size, cooldown and upgrades
              can never be changed again. Type RENOUNCE to confirm.
            </p>
          </div>
          <Field label="Confirmation" htmlFor="owner-renounce">
            <TextInput
              id="owner-renounce"
              autoComplete="off"
              spellCheck={false}
              placeholder="RENOUNCE"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="font-mono uppercase tracking-widest"
            />
          </Field>
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={renounce.submit}
            disabled={confirmation !== 'RENOUNCE' || !renounce.simulationReady || renounce.isPending}
            loading={renounce.isPending}
            loadingLabel="Renouncing…"
          >
            Renounce ownership permanently
          </Button>
          <SimulationError error={renounce.simulationError} />
          <TxFeedback
            phase={renounce.phase as TxPhase}
            hash={renounce.hash}
            error={renounce.txError ? getFriendlyError(renounce.txError) : null}
            successTitle="Ownership renounced"
            successMessage="The contract no longer has an owner."
          />
        </div>

        <p className="flex items-start gap-1.5 border-t border-danger/20 pt-4 text-[0.7rem] leading-relaxed text-muted">
          <AlertTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
          Contract upgrades (upgradeToAndCall) are intentionally not exposed in this
          UI. Use a dedicated multisig and audited tooling for upgrades.
        </p>
      </div>
    </details>
  )
}

export function OwnerPanel() {
  const { address, isConnected } = useAccount()
  const { owner, isLoading } = useContractOwner()

  const isOwner =
    !!address && !!owner && address.toLowerCase() === owner.toLowerCase()

  if (!isConnected || isLoading || !isOwner || !owner) return null

  return (
    <section
      id="owner"
      aria-labelledby="owner-heading"
      className="card scroll-mt-24 overflow-hidden border-warning/20"
    >
      <div className="flex flex-col gap-4 border-b border-line/10 bg-warning/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-warning/20 bg-warning/10 text-warning">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="owner-heading"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Owner console
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-warning/20 bg-warning/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-warning">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Owner
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Connected as{' '}
              <span className="font-mono text-fg">{shortAddress(address)}</span>
            </p>
          </div>
        </div>
        <p className="max-w-xs text-[0.7rem] leading-relaxed text-muted">
          Changes apply immediately on Sepolia. Every action is simulated before
          your wallet is prompted.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
        <AmountForm />
        <CooldownForm />
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <DangerZone />
      </div>
    </section>
  )
}
