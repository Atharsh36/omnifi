# 🔮 OmniFi Prediction Market — BNB Chain

🚀 A full-stack decentralized **Prediction Market platform** built on **BNB Smart Chain Testnet** with an integrated **AI Arbitrage Trading Agent**.

Trade the future using YES/NO markets and earn rewards when you are right.

---

# 🌟 Features

## 🔮 Prediction Markets
- Trade real-world and crypto events (YES / NO markets)
- Pool-based automated odds calculation
- On-chain transparent reward distribution
- Low-fee trading on BNB Chain
- Real-time market updates
- Portfolio & PnL tracking

## 🤖 AI Arbitrage Agent
- Monitors market price inefficiencies
- Detects arbitrage opportunities
- Executes automated trades
- Provides AI trading insights
- Customizable risk & trading settings

## 📊 Portfolio Dashboard
- Wallet balance & deposit balance
- Active positions tracking
- Win / Loss statistics
- Profit & Loss (PnL)
- Claimable rewards
- Transaction history

---

# 🏗️ Architecture

omnifi/
├── contracts/          # Solidity smart contracts  
│   └── PredictionMarket.sol  
├── frontend/           # Next.js + TypeScript UI  
│   ├── app/  
│   ├── components/  
│   └── hooks/  
└── backend/            # Node.js + TypeScript Arbitrage Bot  
    └── src/  
        ├── routes/  
        ├── services/  
        └── blockchain/  

---

# 🚀 Quick Start

## Prerequisites
- Node.js v18+
- MetaMask wallet
- BNB Testnet tokens (faucet)

---

# ⛓ 1️⃣ Deploy Smart Contracts

cd contracts  
npm install  
npx hardhat compile  

Deploy to BNB Testnet:

npx hardhat run scripts/deploy.ts --network bnbTestnet  

Save deployed contract address.

---

# 🖥 2️⃣ Configure Frontend

cd frontend  
npm install  

Create `.env.local`:

NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545  
NEXT_PUBLIC_CONTRACT_ADDRESS=PASTE_DEPLOYED_ADDRESS  

Run frontend:

npm run dev  

Frontend runs at:  
http://localhost:3000  

---

# 🤖 3️⃣ Start AI Arbitrage Bot

cd backend  
npm install  

Create `.env`:

RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545  
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY  
CONTRACT_ADDRESS=PASTE_DEPLOYED_ADDRESS  

BOT_TRADE_AMOUNT=0.001  
ARBITRAGE_THRESHOLD=0.05  

Run bot:

npm run start  

The bot will:
- Scan markets every 30 seconds
- Detect arbitrage opportunities
- Execute automated trades

---

# 📝 Smart Contract Details

## PredictionMarket.sol
Core features:
- Create YES/NO markets
- Pool-based betting
- Automated payout distribution
- Time-locked market resolution

Core Functions:
- createMarket()
- buyYes()
- buyNo()
- resolveMarket()
- claim()

---

# 📊 How Prediction Markets Work

1. Users bet BNB on YES or NO  
2. Funds go into liquidity pools  
3. Market resolves  
4. Winners share the total pool  

Payout Formula:

Payout = (User Bet / Total Winning Bets) × Total Pool

---

# 🤖 Backend Services

## Arbitrage Bot
- Fetches on-chain market prices
- Simulates external market prices
- Detects price gaps
- Executes buyYes / buyNo trades
- Provides analytics API

---

# 🌐 Network Configuration

BNB Smart Chain Testnet  
Chain ID: 97  
RPC: https://data-seed-prebsc-1-s1.binance.org:8545  
Explorer: https://testnet.bscscan.com  

---

# 🛠️ Tech Stack

Blockchain:
- Solidity
- Hardhat

Frontend:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- ethers.js

Backend:
- Node.js
- Express
- TypeScript

Network:
- BNB Smart Chain Testnet

---

# 🧪 Testing

cd contracts  
npx hardhat test  

---

# 👨‍💻 Hackathon Project
Built for BNB Chain Hackathon 🚀

---

# 📄 License
MIT License

---

# ⚠️ Disclaimer
This is a testnet demonstration project.  
Do NOT use real funds on mainnet without proper audits.
