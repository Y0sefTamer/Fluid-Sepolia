import {
  BaseError,
  ContractFunctionRevertedError,
  InsufficientFundsError,
  UserRejectedRequestError,
} from 'viem'

export type FriendlyErrorKind = 'rejected' | 'reverted' | 'wallet' | 'unknown'

export interface FriendlyError {
  title: string
  message: string
  kind: FriendlyErrorKind
}

export const CUSTOM_ERROR_MESSAGES: Record<string, string> = {
  FluidSepoliaV1_CooldownNotPassed:
    'Your cooldown is still active. Wait for the timer to finish before claiming again.',
  FluidSepoliaV1_DonationMustBeGreaterThanThisAmount:
    'Donations must be at least 0.001 ETH.',
  FluidSepoliaV1_InsufficientDonationAmount:
    'The faucet does not have enough ETH for this claim right now. Try again after someone funds it.',
  FluidSepoliaV1_OnlyOwnerCanUpdateCooldownTime:
    'Only the contract owner can change the cooldown.',
  OwnableUnauthorizedAccount: 'Only the contract owner can perform this action.',
  OwnableInvalidOwner: 'That is not a valid owner address.',
  ERC1967InvalidImplementation: 'The upgrade target is not a valid implementation.',
  ERC1967NonPayable: 'This upgrade call cannot receive ETH.',
  UUPSUnauthorizedCallContext: 'Upgrades must be routed through the proxy.',
  UUPSUnsupportedProxiableUUID: 'The target contract is not UUPS compatible.',
  InvalidInitialization: 'This contract has already been initialized.',
  NotInitializing: 'The contract is not in an initializing state.',
}

const REJECTION_PATTERN = /user rejected|user denied|rejected the request|denied transaction/i

function findInCauseChain<T extends Error>(
  error: BaseError,
  predicate: (cause: unknown) => cause is T,
): T | null {
  let match: T | null = null
  error.walk((cause) => {
    if (predicate(cause)) {
      match = cause
      return true
    }
    return false
  })
  return match
}

function describeRevert(name: string | undefined, reason: string | undefined): FriendlyError | null {
  if (name && CUSTOM_ERROR_MESSAGES[name]) {
    return {
      title: 'Transaction reverted',
      message: CUSTOM_ERROR_MESSAGES[name],
      kind: 'reverted',
    }
  }

  if (reason) {
    return { title: 'Transaction reverted', message: reason, kind: 'reverted' }
  }

  return null
}

export function getFriendlyError(error: unknown): FriendlyError {
  if (!error) {
    return {
      title: 'Something went wrong',
      message: 'An unknown error occurred. Please try again.',
      kind: 'unknown',
    }
  }

  if (error instanceof BaseError) {
    const rejection = findInCauseChain(
      error,
      (cause): cause is UserRejectedRequestError =>
        cause instanceof UserRejectedRequestError,
    )
    if (rejection) {
      return {
        title: 'Transaction cancelled',
        message: 'You rejected the request in your wallet. Nothing was sent.',
        kind: 'rejected',
      }
    }

    const revert = findInCauseChain(
      error,
      (cause): cause is ContractFunctionRevertedError =>
        cause instanceof ContractFunctionRevertedError,
    )
    if (revert instanceof ContractFunctionRevertedError) {
      const described = describeRevert(revert.data?.errorName, revert.reason)
      if (described) return described
    }

    const insufficientFunds = findInCauseChain(
      error,
      (cause): cause is InsufficientFundsError =>
        cause instanceof InsufficientFundsError,
    )
    if (insufficientFunds) {
      return {
        title: 'Insufficient funds',
        message:
          'Your wallet does not have enough Sepolia ETH to cover the amount and gas.',
        kind: 'wallet',
      }
    }

    if (REJECTION_PATTERN.test(error.message)) {
      return {
        title: 'Transaction cancelled',
        message: 'You rejected the request in your wallet. Nothing was sent.',
        kind: 'rejected',
      }
    }

    const matchedName = Object.keys(CUSTOM_ERROR_MESSAGES).find((name) =>
      error.message.includes(name),
    )
    if (matchedName) {
      return {
        title: 'Transaction reverted',
        message: CUSTOM_ERROR_MESSAGES[matchedName],
        kind: 'reverted',
      }
    }

    return {
      title: 'Transaction failed',
      message: error.shortMessage || 'The request could not be completed.',
      kind: 'unknown',
    }
  }

  if (error instanceof Error) {
    if (REJECTION_PATTERN.test(error.message)) {
      return {
        title: 'Transaction cancelled',
        message: 'You rejected the request in your wallet. Nothing was sent.',
        kind: 'rejected',
      }
    }

    const matchedName = Object.keys(CUSTOM_ERROR_MESSAGES).find((name) =>
      error.message.includes(name),
    )
    if (matchedName) {
      return {
        title: 'Transaction reverted',
        message: CUSTOM_ERROR_MESSAGES[matchedName],
        kind: 'reverted',
      }
    }

    return {
      title: 'Something went wrong',
      message: error.message,
      kind: 'unknown',
    }
  }

  return {
    title: 'Something went wrong',
    message: 'An unknown error occurred. Please try again.',
    kind: 'unknown',
  }
}
