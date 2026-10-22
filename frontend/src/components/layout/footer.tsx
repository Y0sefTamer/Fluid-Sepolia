import { CopyButton } from '@/components/ui/copy-button'
import { ArrowUpRightIcon, GithubIcon, LogoMark } from '@/components/ui/icons'
import {
  CONTRACT_ADDRESS,
  CONTRACT_URL,
  GITHUB_REPO_LABEL,
  GITHUB_URL,
  SEPOLIA_CHAIN_ID,
} from '@/config/contract'

export function Footer() {
  return (
    <footer className="border-t border-line/10 bg-surface/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8 rounded-xl" />
              <span className="font-display text-base font-semibold tracking-tight">
                fluid<span className="text-accent">.</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A community-funded Sepolia faucet. Claim test ETH, or keep it topped
              up for the next developer.
            </p>
            <p className="mt-4 text-xs text-muted">
              Sepolia testnet only. Test ETH has no real value and cannot be
              bridged to mainnet.
            </p>
          </div>

          <div className="w-full space-y-4 md:max-w-md">
            <div className="rounded-2xl border border-line/10 bg-surface/60 p-4 backdrop-blur">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
                Proxy contract
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <code className="min-w-0 flex-1 break-all font-mono text-xs text-fg sm:text-[0.8rem]">
                  {CONTRACT_ADDRESS}
                </code>
                <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" iconOnly />
                <a
                  href={CONTRACT_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="View contract on Etherscan"
                  title="View on Etherscan"
                  className="inline-flex items-center rounded-lg p-1.5 text-muted transition hover:bg-line/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <ArrowUpRightIcon className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-2 text-[0.7rem] text-muted">
                Always interact through the proxy. Chain ID {SEPOLIA_CHAIN_ID}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <GithubIcon className="h-4 w-4" />
                {GITHUB_REPO_LABEL}
              </a>
              <span className="text-muted/60">·</span>
              <span className="text-muted">Built with Foundry + Next.js</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line/10 pt-5 text-[0.7rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Fluid Faucet</span>
          <span className="font-mono">chain {SEPOLIA_CHAIN_ID} · UUPS proxy</span>
        </div>
      </div>
    </footer>
  )
}
