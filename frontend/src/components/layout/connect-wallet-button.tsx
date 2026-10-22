'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { ChevronDownIcon, WalletIcon } from '@/components/ui/icons'

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        if (!mounted) {
          return (
            <div
              aria-hidden
              className="h-10 w-[8.5rem] animate-pulse rounded-xl bg-line/10"
            />
          )
        }

        const connected = Boolean(account && chain)

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent-gradient px-3.5 text-sm font-semibold text-accent-fg shadow-glow transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-4"
            >
              <WalletIcon className="h-4 w-4" />
              <span className="sm:hidden">Connect</span>
              <span className="hidden sm:inline">Connect wallet</span>
            </button>
          )
        }

        return (
          <button
            type="button"
            onClick={openAccountModal}
            aria-haspopup="dialog"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line/10 bg-surface/70 px-2.5 text-xs font-semibold text-fg backdrop-blur transition hover:border-accent/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-3"
          >
            <span
              className={
                chain?.unsupported
                  ? 'h-2 w-2 rounded-full bg-warning'
                  : 'h-2 w-2 rounded-full bg-positive'
              }
            />
            <span className="max-w-[7.5rem] truncate font-mono">
              {account?.displayName}
            </span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
