# 🌊 Fluid Sepolia Faucet (Upgradeable Smart Contract)

A community-driven, decentralized Sepolia ETH faucet built using Foundry and the UUPS Proxy architectural pattern.

## 📌 Project Overview
Getting Sepolia ETH can be frustrating for new developers. Fluid Sepolia solves this by allowing developers with excess testnet ETH to fund the contract, while securely distributing fixed amounts to beginners needing it for testing.

## 🏗️ Architecture
This project uses the **UUPS (Universal Upgradeable Proxy Standard)** pattern by OpenZeppelin to allow future logic upgrades without changing the contract address or losing state/funds.
- **Proxy Contract:** Holds the state, balances, and is the main interaction point.
- **Logic Contract (Implementation):** Contains the rules (`donate`, `withdraw`, `cooldowns`).
- **Layout Contract:** Isolates state variables to prevent storage collisions during upgrades.

## 🚀 Contract Details (Sepolia Testnet)
- **Proxy Address (Interact Here):** `0x1874C9971f63Da905291ccdD7348D5811FD91F35`
- **Logic/Implementation Address:** `0xe49b3E34747b25Ed5E681A762d6C77B49Fd8E64F`
- **Network:** Sepolia Testnet (Chain ID: `11155111`)

## 💻 For Front-end Developers
To integrate this smart contract into your dApp, you will need:
1. The **Proxy Address** mentioned above.
2. The **Logic Contract ABI** (Found in `out/FluidSepoliaV1.sol/FluidSepoliaV1.json`).

**Code Example (ethers.js / viem):**
```javascript
// ALWAYS point to the Proxy address, but use the Logic ABI
const contract = new ethers.Contract(PROXY_ADDRESS, LOGIC_ABI, providerOrSigner);
```


## ⚙️ Main Functions
donate(): Public payable function to fund the faucet (Minimum 0.001 ETH).

withdraw(): Allows users to claim 0.05 Sepolia ETH.

getTimeUntilNextWithdrawal(address _user): View function returning the remaining seconds until a user can withdraw again (Ideal for UI countdown timers).


## 🛠️ Local Development (Foundry)
To run this project locally:

Clone the repository:

```
git clone <your-repo-link>
cd FluidSepolia
```
Install dependencies:
```
make install
```
Run tests:
```
make test
```
