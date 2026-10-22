'use client'

import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'

import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider, useTheme } from '@/components/providers/theme-provider'
import { APP_NAME } from '@/config/contract'
import { wagmiConfig } from '@/config/wagmi'

function RainbowKit({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const accentColor = theme === 'dark' ? '#2DD4BF' : '#0F8F84'
  const accentColorForeground = theme === 'dark' ? '#03110E' : '#FFFFFF'

  const rainbowTheme =
    theme === 'dark'
      ? darkTheme({
          accentColor,
          accentColorForeground,
          borderRadius: 'large',
          overlayBlur: 'small',
        })
      : lightTheme({
          accentColor,
          accentColorForeground,
          borderRadius: 'large',
          overlayBlur: 'small',
        })

  return (
    <RainbowKitProvider theme={rainbowTheme} modalSize="compact" appInfo={{ appName: APP_NAME }}>
      {children}
    </RainbowKitProvider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKit>
            <ToastProvider>{children}</ToastProvider>
          </RainbowKit>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
