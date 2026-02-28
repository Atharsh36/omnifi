# OmniFi - Web3 Super App on BNB Chain

🚀 A full-stack decentralized finance platform combining Prediction Markets, Token Launchpad, and Smart-Collateral BNPL Credit System.

## 🌟 Features

### 🔮 Prediction Markets
- Trade on real-world and crypto events (Yes/No markets)
- Use wallet funds or platform credit
- Real-time odds calculation
- AI-driven insights and arbitrage detection

### 🚀 Token Launchpad
- Launch tokens with progressive liquidity unlock (PLU)
- Automated liquidity pool creation
- Milestone-based unlocking
- Project contribution tracking

### 💳 Smart-Collateral BNPL Credit
- Deposit BNB as collateral
- Borrow against collateral (150% ratio)
- AI-powered credit scoring
- Health factor monitoring
- Automatic liquidation protection

### 📊 Unified Dashboard
- Real-time portfolio tracking
- Credit score analytics
- Transaction history
- Multi-module overview

## 🏗️ Architecture

```
omnifi/
├── contracts/          # Solidity smart contracts
│   ├── CollateralVault.sol
│   ├── RiskEngine.sol
│   ├── PredictionMarket.sol
│   ├── Launchpad.sol
│   └── OmniAMM.sol
├── frontend/           # Next.js + TypeScript UI
│   ├── app/           # Pages (prediction, launchpad, bnpl, dashboard)
│   ├── components/    # React components
│   └── hooks/         # Custom blockchain hooks
└── backend/           # Node.js + TypeScript API
    └── src/
        ├── routes/    # API endpoints
        ├── services/  # Business logic
        └── blockchain/ # Contract interactions
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MetaMask wallet
- BNB Testnet tokens ([Get from faucet](https://testnet.bnbchain.org/faucet-smart))

### 1. Deploy Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile

# Deploy to BNB Testnet
npx hardhat run scripts/deploy.ts --network bnbTestnet

# Save the deployed contract addresses
```

### 2. Configure Frontend

```bash
cd frontend
npm install

# Update lib/contracts.ts with deployed addresses
# Update contract ABIs in lib/abi/

npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Start Backend

```bash
cd backend
npm install

# Configure .env file:
# - Add your private key
# - Add deployed contract addresses
# - Set RPC_URL for BNB Testnet

npm run dev
```

Backend runs on `http://localhost:3001`

## 📝 Smart Contract Details

### CollateralVault
- Manages user collateral deposits
- Handles borrowing with 150% collateral ratio
- Liquidation at 120% threshold
- Integrates with RiskEngine for credit scores

### RiskEngine
- Stores on-chain credit scores (0-1000)
- Provides credit multipliers
- Authorized backend updates

### PredictionMarket
- Create Yes/No prediction markets
- Pool-based odds calculation
- Automated payout distribution
- Time-locked resolution

### Launchpad
- Token sale management
- Progressive liquidity unlock
- Contribution tracking
- Refund mechanism

### OmniAMM
- Simple constant product AMM
- Liquidity pool management
- Token swapping

## 🎨 Frontend Features

- **Dark Theme UI**: Modern, responsive design
- **Wallet Integration**: MetaMask connection
- **Real-time Updates**: Live data from blockchain
- **Multi-page Navigation**: Seamless routing
- **Interactive Charts**: Visual data representation

### Navigation Component (Navbar.tsx)
- **Fixed Header**: Sticky navigation with scroll-based transparency effects
- **Glassmorphism Design**: Backdrop blur with semi-transparent background
- **Active Route Highlighting**: Visual indicator for current page with glowing dot
- **Animated Logo**: Gradient logo with hover scale effects and glow shadows
- **Responsive Layout**: Pill-shaped navigation group with smooth transitions
- **Dynamic Styling**: Changes appearance on scroll (background opacity, padding, border)
- **Route Detection**: Uses Next.js usePathname for active state management

## 🤖 Backend Services

### Wallet Analyzer
- Analyzes on-chain wallet activity
- Calculates transaction patterns
- Determines wallet age and risk level

### Credit Engine
- AI-powered credit scoring algorithm
- Factors: balance, tx count, wallet age, risk
- Score range: 300-1000
- Dynamic credit multipliers

### Arbitrage Bot
- Monitors prediction market opportunities
- Detects price inefficiencies
- Automated trade execution

## 🔐 Security Features

- Collateral ratio enforcement
- Liquidation protection
- Access control on contracts
- Private key management
- Input validation

## 🧪 Testing

```bash
# Test contracts
cd contracts
npx hardhat test

# Test coverage
npx hardhat coverage
```

## 📊 Credit Scoring Algorithm

```
Base Score: 300
+ Balance Factor (0-200 points)
+ Transaction Count (0-200 points)
+ Wallet Age (0-200 points)
+ Risk Level (0-100 points)
= Total Score (300-1000)
```

**Credit Multipliers:**
- Score ≥ 800: 1.5x borrowing power
- Score ≥ 600: 1.25x borrowing power
- Score ≥ 400: 1.1x borrowing power
- Score < 400: 1.0x borrowing power

## 🌐 Network Configuration

**BNB Smart Chain Testnet:**
- Chain ID: 97
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545
- Explorer: https://testnet.bscscan.com

## 📱 Usage Flow

1. **Connect Wallet** → MetaMask on BNB Testnet
2. **Deposit Collateral** → BNPL Credit page
3. **Get Credit Score** → Backend analyzes wallet
4. **Borrow Funds** → Use credit across platform
5. **Trade Predictions** → Use wallet or credit
6. **Invest in Launchpad** → Support new projects
7. **Monitor Dashboard** → Track all activities

## 🛠️ Tech Stack

- **Blockchain**: Solidity 0.8.20, Hardhat
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Web3**: ethers.js v6
- **Network**: BNB Smart Chain Testnet

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## ⚠️ Disclaimer

This is a testnet demonstration project. Do not use with real funds on mainnet without proper audits.
