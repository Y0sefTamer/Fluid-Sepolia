import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'

import {
  APP_NAME,
  RPC_URL,
  SEPOLIA,
  SEPOLIA_CHAIN_ID,
  WALLETCONNECT_PROJECT_ID,
} from './contract'

const projectId = WALLETCONNECT_PROJECT_ID || 'fluid-faucet-local-dev'

const wallets = WALLETCONNECT_PROJECT_ID
  ? [
      {
        groupName: 'Recommended',
        wallets: [injectedWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet],
      },
    ]
  : [
      {
        groupName: 'Recommended',
        wallets: [injectedWallet, metaMaskWallet, coinbaseWallet],
      },
    ]

const connectors = connectorsForWallets(wallets, {
  appName: APP_NAME,
  projectId,
})

export const wagmiConfig = createConfig({
  chains: [SEPOLIA],
  connectors,
  transports: {
    [SEPOLIA_CHAIN_ID]: http(RPC_URL, { batch: true, retryCount: 2 }),
  },
  ssr: true,
})
