# Fluid Faucet — Frontend

A Next.js dApp for the already-deployed Fluid Sepolia faucet. It reads the live
state from the UUPS proxy and only uses functions, events and errors that exist in
the compiled `FluidSepoliaV1` ABI.

> Part of the [Fluid Sepolia project](../README.md). See the root README for the
> contract architecture, deployment, API, and security model.

- **Network:** Sepolia (`11155111`) only
- **Proxy (interacted with):** `0x1874C9971f63Da905291ccdD7348D5811FD91F35`
- **Implementation:** `0xe49b3E34747b25Ed5E681A762d6C77B49Fd8E64F`

No deployment or contract change is performed by this app.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS · wagmi v2 · viem ·
RainbowKit · TanStack Query · pnpm

## Getting started

Requirements: Node.js 20.9+ and pnpm (corepack is fine).

```bash
cd frontend
pnpm install
cp .env.example .env.local   # optional; sensible defaults are built in
pnpm dev
```

Open <http://localhost:3000>.

## Environment variables

All variables are public (`NEXT_PUBLIC_*`) and safe to expose to the browser.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FLUID_CONTRACT_ADDRESS` | README proxy address | Proxy address; validated and checksummed at startup |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | `https://sepolia.gateway.tenderly.co` | Reads + historical event scan |
| `NEXT_PUBLIC_ACTIVITY_FROM_BLOCK` | `10383029` | First block scanned for the activity feed |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | empty | Optional; without it only injected wallets are offered |
| `NEXT_PUBLIC_GITHUB_URL` | repo URL | Footer source link |

Do not put private keys, mnemonics or secret API keys in any `NEXT_PUBLIC_*`
variable.

## Scripts

```bash
pnpm dev        # next dev --webpack
pnpm build      # next build --webpack
pnpm start      # production server
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
pnpm sync-abi   # regenerate src/lib/abi/fluidSepolia.ts from out/FluidSepoliaV1.sol/FluidSepoliaV1.json
```

`pnpm sync-abi` expects the Foundry artifact in the repository root. Run
`forge build` there first if `out/` is missing. The generated file is committed so
the frontend builds without Foundry.

The webpack builder is used because Next 16's Turbopack tries to resolve optional
`@x402/*` modules that RainbowKit pulls in statically through the Base Account
connector. Those modules are not installed and are not used by this app; they are
aliased to empty modules in `next.config.ts`.

## Contract functions → UI

| Contract function | Where |
| --- | --- |
| `getContractBalance()` | Stats grid, claim card availability |
| `getWithdrawalAmount()` | Stats grid, claim button, owner console |
| `getCooldownTime()` | Stats grid, claim countdown, owner console |
| `getTotalDonated()` | Stats grid |
| `getLastWithdrawalTime(address)` | Claim card ("Last claim") |
| `getTimeUntilNextWithdrawal(address)` | Claim card eligibility + countdown |
| `getTotalDonations(address)` | Claim card + donate card ("Your donations") |
| `owner()` | Owner console visibility |
| `donate()` (payable) | Donate card |
| `withdraw()` | Claim card |
| `updateWithdrawalAmount(uint256)` | Owner console (amount form) |
| `updateCooldownTime(uint256)` | Owner console (cooldown form) |
| `transferOwnership(address)` | Owner console → advanced ownership actions |
| `renounceOwnership()` | Owner console → advanced ownership actions |
| Events: `DonationReceived`, `WithdrawalMade`, `WithdrawalAmountUpdated`, `CooldownTimeUpdated`, `Upgraded` | Activity feed |

`upgradeToAndCall(address,bytes)` is intentionally **not** exposed in the UI. Use
a dedicated multisig and audited tooling for upgrades.

## Write flow

Every write follows the same pipeline:

1. `useSimulateContract` validates the call.
2. `useWriteContract` asks the wallet to sign.
3. `useWaitForTransactionReceipt` waits for inclusion.
4. Queries are invalidated and toasts/Etherscan links are shown.

States covered: disconnected, wrong network, awaiting wallet confirmation,
pending on-chain, confirmed, failed, and user-rejected (treated as a neutral
cancellation). Custom errors are decoded in `src/lib/errors.ts`.

## Activity feed

Events are read with `eth_getLogs` from the deployment block to the latest block,
then parsed with the same ABI. The default public RPC supports this full range.
If you switch to an RPC that prunes history or caps `eth_getLogs` ranges, the feed
shows a clear error with a retry action.

## Project structure

```
src/
  app/                 layout, page, providers, global styles, favicon
  components/
    faucet/            hero, stats, claim, donate, activity, owner console
    layout/            header, footer, background, network banner, logo
    providers/         theme + toast providers
    ui/                buttons, fields, icons, copy button, tx feedback
  config/              contract/chain config + wagmi config
  hooks/               reads, writes, countdown, activity, tx effects
  lib/                 generated ABI, error map, formatting, cn
scripts/sync-abi.mjs   ABI generator
```

## Manual checks

- Connect a Sepolia wallet and claim once; confirm the countdown starts and the
  header/activity update without a page reload.
- Switch the wallet to another network; the wrong-network banner must appear and
  writes must stay disabled.
- Donate `0.001 ETH` (minimum), `0.001` minus one wei, and an invalid string.
- Connect with the owner wallet (`0xde1D…6116`) to reveal the owner console.
- Try the activity feed with a restrictive RPC to see the error state.
