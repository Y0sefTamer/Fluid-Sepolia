import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CheckIcon,
  InfoIcon,
  SpinnerIcon,
} from '@/components/ui/icons'
import { txUrl } from '@/config/contract'
import type { FriendlyError } from '@/lib/errors'
import { cn } from '@/lib/cn'

export type TxPhase = 'idle' | 'awaiting' | 'pending' | 'success' | 'error'

interface TxFeedbackProps {
  phase: TxPhase
  hash?: `0x${string}`
  error?: FriendlyError | null
  successTitle?: string
  successMessage?: string
  pendingTitle?: string
  className?: string
}

export function TxFeedback({
  phase,
  hash,
  error,
  successTitle = 'Confirmed on Sepolia',
  successMessage = 'The transaction was included in a block.',
  pendingTitle = 'Waiting for confirmation',
  className,
}: TxFeedbackProps) {
  if (phase === 'idle') return null

  const tone =
    phase === 'success'
      ? 'border-positive/20 bg-positive/10'
      : phase === 'error'
        ? error?.kind === 'rejected'
          ? 'border-line/10 bg-line/5'
          : 'border-danger/20 bg-danger/10'
        : 'border-accent/20 bg-accent/5'

  const iconTone =
    phase === 'success'
      ? 'text-positive'
      : phase === 'error'
        ? error?.kind === 'rejected'
          ? 'text-muted'
          : 'text-danger'
        : 'text-accent'

  const Icon =
    phase === 'success'
      ? CheckIcon
      : phase === 'error'
        ? error?.kind === 'rejected'
          ? InfoIcon
          : AlertTriangleIcon
        : SpinnerIcon

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs',
        tone,
        className,
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          iconTone,
          phase === 'awaiting' || phase === 'pending' ? 'animate-spin' : '',
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-fg">
          {phase === 'awaiting'
            ? 'Confirm in your wallet'
            : phase === 'pending'
              ? pendingTitle
              : phase === 'success'
                ? successTitle
                : (error?.title ?? 'Transaction failed')}
        </p>
        <p className="mt-0.5 leading-relaxed text-muted">
          {phase === 'awaiting'
            ? 'Your wallet is waiting for your approval. Nothing has been sent yet.'
            : phase === 'pending'
              ? 'The transaction is in the mempool. This usually takes a few seconds.'
              : phase === 'success'
                ? successMessage
                : (error?.message ?? 'Please try again.')}
        </p>
        {hash ? (
          <a
            href={txUrl(hash)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1.5 inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline"
          >
            View transaction
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  )
}
