import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fluid — Community Sepolia ETH Faucet',
  description:
    'Claim test ETH on Sepolia in one click, or donate to keep the faucet funded for the next developer.',
  applicationName: 'Fluid Faucet',
  keywords: ['Sepolia', 'faucet', 'testnet', 'Ethereum', 'ETH'],
  openGraph: {
    title: 'Fluid — Community Sepolia ETH Faucet',
    description:
      'A community-funded Sepolia faucet: claim test ETH every 24 hours or top it up for other builders.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Fluid — Community Sepolia ETH Faucet',
    description:
      'A community-funded Sepolia faucet: claim test ETH every 24 hours or top it up for other builders.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050d0e' },
    { media: '(prefers-color-scheme: light)', color: '#f6f9f8' },
  ],
  colorScheme: 'dark light',
}

const themeScript = `(function(){try{var stored=localStorage.getItem('fluid-theme');var dark=stored?stored==='dark':true;document.documentElement.classList.toggle('dark',dark);}catch(e){document.documentElement.classList.add('dark');}})();`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-accent px-4 py-2 font-semibold text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
