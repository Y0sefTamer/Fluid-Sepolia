import { getAddress, isAddress, parseEther, type Address } from 'viem'
import { sepolia } from 'viem/chains'

const FALLBACK_PROXY_ADDRESS: Address = '0x1874C9971f63Da905291ccdD7348D5811FD91F35'
const FALLBACK_RPC_URL = 'https://sepolia.gateway.tenderly.co'
const FALLBACK_FROM_BLOCK = 10_383_029
const FALLBACK_GITHUB_URL = 'https://github.com/Y0sefTamer/Fluid-Sepolia'

function resolveAddress(value: string | undefined): Address {
  if (value && isAddress(value)) {
    return getAddress(value)
  }
  return FALLBACK_PROXY_ADDRESS
}

function resolveFromBlock(value: string | undefined): bigint {
  if (!value) return BigInt(FALLBACK_FROM_BLOCK)
  try {
    const parsed = BigInt(value)
    return parsed > 0n ? parsed : BigInt(FALLBACK_FROM_BLOCK)
  } catch {
    return BigInt(FALLBACK_FROM_BLOCK)
  }
}

export const APP_NAME = 'Fluid Faucet'
export const CONTRACT_ADDRESS = resolveAddress(
  process.env.NEXT_PUBLIC_FLUID_CONTRACT_ADDRESS,
)
export const SEPOLIA = sepolia
export const SEPOLIA_CHAIN_ID = sepolia.id
export const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || FALLBACK_RPC_URL
export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''
export const ACTIVITY_FROM_BLOCK = resolveFromBlock(
  process.env.NEXT_PUBLIC_ACTIVITY_FROM_BLOCK,
)
export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL || FALLBACK_GITHUB_URL

export const EXPLORER_URL = SEPOLIA.blockExplorers.default.url
export const CONTRACT_URL = `${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`
export const GITHUB_REPO_LABEL = 'Y0sefTamer/Fluid-Sepolia'

export const MIN_DONATION = parseEther('0.001')
export const MIN_DONATION_LABEL = '0.001'

export function txUrl(hash: string) {
  return `${EXPLORER_URL}/tx/${hash}`
}

export function addressUrl(address: string) {
  return `${EXPLORER_URL}/address/${address}`
}
