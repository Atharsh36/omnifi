# OmniFi Deployment Guide

## Step-by-Step Deployment

### 1. Setup Environment

#### Install Dependencies
```bash
# Contracts
cd contracts
npm install

# Frontend
cd ../frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Hardhat for BNB Testnet

Edit `contracts/hardhat.config.ts`:

```typescript
networks: {
  bnbTestnet: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    chainId: 97,
    accounts: ["YOUR_PRIVATE_KEY_HERE"]
  }
}
```

### 3. Get BNB Testnet Tokens

1. Visit: https://testnet.bnbchain.org/faucet-smart
2. Enter your wallet address
3. Receive test BNB

### 4. Deploy Contracts

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network bnbTestnet
```

**Save the output addresses:**
- RiskEngine: 0x...
- CollateralVault: 0x...
- PredictionMarket: 0x...
- OmniAMM: 0x...
- Launchpad: 0x...

### 5. Update Frontend Configuration

Edit `frontend/lib/contracts.ts`:

```typescript
export const contracts = {
  CollateralVault: "0xYOUR_VAULT_ADDRESS",
  RiskEngine: "0xYOUR_RISK_ENGINE_ADDRESS",
  PredictionMarket: "0xYOUR_PREDICTION_ADDRESS",
  Launchpad: "0xYOUR_LAUNCHPAD_ADDRESS",
  OmniAMM: "0xYOUR_AMM_ADDRESS"
};
```

### 6. Export Contract ABIs

After deployment, copy ABIs:

```bash
# From contracts/artifacts/contracts/
cp CollateralVault.sol/CollateralVault.json ../frontend/lib/abi/
cp RiskEngine.sol/RiskEngine.json ../frontend/lib/abi/
cp PredictionMarket.sol/PredictionMarket.json ../frontend/lib/abi/
cp Launchpad.sol/Launchpad.json ../frontend/lib/abi/
cp OmniAMM.sol/OmniAMM.json ../frontend/lib/abi/
```

### 7. Configure Backend

Edit `backend/.env`:

```env
PORT=3001
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
PRIVATE_KEY=your_private_key_here
RISK_ENGINE_ADDRESS=0xYOUR_RISK_ENGINE_ADDRESS
COLLATERAL_VAULT_ADDRESS=0xYOUR_VAULT_ADDRESS
PREDICTION_MARKET_ADDRESS=0xYOUR_PREDICTION_ADDRESS
LAUNCHPAD_ADDRESS=0xYOUR_LAUNCHPAD_ADDRESS
```

### 8. Authorize Backend in RiskEngine

```bash
cd contracts
npx hardhat console --network bnbTestnet
```

```javascript
const RiskEngine = await ethers.getContractAt("RiskEngine", "0xYOUR_RISK_ENGINE_ADDRESS");
await RiskEngine.authorize("YOUR_BACKEND_WALLET_ADDRESS");
```

### 9. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 10. Access Application

Open browser: http://localhost:3000

### 11. Connect MetaMask

1. Click "Connect Wallet"
2. Approve connection
3. Switch to BNB Testnet (Chain ID: 97)

### 12. Test Features

#### Test BNPL Credit:
1. Go to Credit page
2. Deposit 1 BNB as collateral
3. Borrow 0.5 BNB
4. Check health factor

#### Test Prediction Markets:
1. Go to Predictions page
2. Select a market
3. Buy YES or NO position
4. Monitor odds changes

#### Test Launchpad:
1. Go to Launchpad page
2. View active projects
3. Contribute to a project
4. Track progress

#### Test Dashboard:
1. Go to Dashboard
2. View portfolio overview
3. Check credit score
4. Review activity history

## Troubleshooting

### MetaMask Connection Issues
- Ensure BNB Testnet is added to MetaMask
- Check you have test BNB
- Clear MetaMask cache if needed

### Contract Interaction Errors
- Verify contract addresses are correct
- Check you have sufficient BNB for gas
- Ensure contracts are deployed on correct network

### Backend API Errors
- Verify .env configuration
- Check RPC_URL is accessible
- Ensure private key has BNB for gas

### Frontend Build Errors
- Run `npm install` again
- Clear .next folder: `rm -rf .next`
- Check Node.js version (v18+)

## Production Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Heroku)
```bash
cd backend
# Follow platform-specific deployment guide
```

### Contracts (Mainnet)
⚠️ **DO NOT deploy to mainnet without:**
- Professional security audit
- Comprehensive testing
- Insurance coverage
- Legal compliance review

## Monitoring

### Check Contract Status
```bash
npx hardhat verify --network bnbTestnet DEPLOYED_ADDRESS
```

### View on Explorer
https://testnet.bscscan.com/address/YOUR_CONTRACT_ADDRESS

### Monitor Backend Logs
```bash
cd backend
npm run dev | tee logs.txt
```

## Maintenance

### Update Credit Scores
```bash
cd contracts
npx hardhat run scripts/updateCreditScore.ts --network bnbTestnet
```

### Seed Markets
```bash
cd contracts
npx hardhat run scripts/seedMarkets.ts --network bnbTestnet
```

## Support

For issues, check:
1. Contract deployment logs
2. Browser console errors
3. Backend API logs
4. MetaMask transaction history
