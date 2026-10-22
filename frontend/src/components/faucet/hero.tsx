import { ArrowRightIcon, ClockIcon, DropletIcon, SendIcon, SparklesIcon, WalletIcon } from '@/components/ui/icons'

const STEPS = [
  {
    icon: WalletIcon,
    title: 'Connect a Sepolia wallet',
    body: 'Any EVM wallet works. The app reads your claim status directly from the proxy contract.',
  },
  {
    icon: DropletIcon,
    title: 'Claim when the cooldown clears',
    body: 'One claim per wallet per cooldown. The button unlocks automatically when your timer ends.',
  },
  {
    icon: SendIcon,
    title: 'Pay it forward',
    body: 'Donate 0.001 ETH or more so the faucet stays alive for the next developer.',
  },
]

export function Hero() {
  return (
    <section className="relative grid items-center gap-10 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-20">
      <div>
        <span className="eyebrow">
          <SparklesIcon className="h-3.5 w-3.5 text-accent" />
          Community faucet · Sepolia
        </span>

        <h1 className="mt-5 max-w-xl text-balance font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.65rem]">
          Testnet ETH,
          <br />
          <span className="text-accent">without the wait.</span>
        </h1>

        <p className="mt-5 max-w-lg text-balance text-sm leading-relaxed text-muted sm:text-base">
          Fluid is a community-funded Sepolia faucet. Claim test ETH in one click,
          or top it up so the next developer can keep shipping.
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <a
            href="#claim"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-gradient px-6 text-sm font-semibold text-accent-fg shadow-glow transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Claim your ETH
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <a
            href="#fund"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line/10 bg-surface/70 px-6 text-sm font-semibold text-fg backdrop-blur transition hover:border-accent/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Fund the faucet
          </a>
        </div>

        <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-accent" />
            No sign-up
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-accent" />
            On-chain rules
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Community funded
          </li>
        </ul>
      </div>

      <div className="gradient-border card relative overflow-hidden p-6 sm:p-7">
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-sm font-semibold tracking-tight">
            How it works
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-positive/20 bg-positive/10 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-positive">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
            Live
          </span>
        </div>

        <ol className="mt-6 space-y-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex gap-3.5">
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[0.95rem] top-9 h-[calc(100%-0.25rem)] w-px bg-gradient-to-b from-line/20 to-transparent"
                />
              ) : null}
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                <step.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-line/10 bg-bg/40 px-3 py-2.5 text-[0.7rem] text-muted">
          <ClockIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
          Cooldown and claim size are read live from the contract.
        </div>
      </div>
    </section>
  )
}
