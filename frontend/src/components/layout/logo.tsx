import Link from 'next/link'

import { LogoMark } from '@/components/ui/icons'

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Fluid faucet home"
      className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <LogoMark className="h-9 w-9 rounded-xl shadow-glow transition duration-300 group-hover:scale-105" />
      <span className="flex items-baseline gap-1.5">
        <span className="font-display text-lg font-semibold tracking-tight text-fg">
          fluid<span className="text-accent">.</span>
        </span>
        <span className="hidden rounded-full border border-line/10 bg-surface/60 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted sm:inline">
          faucet
        </span>
      </span>
    </Link>
  )
}
