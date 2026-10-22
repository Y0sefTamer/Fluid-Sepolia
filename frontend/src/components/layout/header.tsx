import { ConnectWalletButton } from '@/components/layout/connect-wallet-button'
import { Logo } from '@/components/layout/logo'
import { NetworkBadge } from '@/components/layout/network-badge'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <NetworkBadge />
          </div>
          <ThemeToggle />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
