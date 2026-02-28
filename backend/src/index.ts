import express from 'express';
import dotenv from 'dotenv';
import creditRouter from './routes/credit';
import vaultRouter from './routes/vault';
import cors from 'cors';
import { startDepositListener } from './services/vaultService';
import arbitrageRouter from './routes/arbitrage';
import { initBlockchain } from './blockchain/predictionMarket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/credit', creditRouter);
app.use('/api/vault', vaultRouter);
app.use('/api/arbitrage', arbitrageRouter);

// Start BNB Testnet block listener for Custodial Deposits
startDepositListener();

// Initialize Arbitrage Bot Blockchain Connection
initBlockchain(); // Initialize but do not start scanning automatically


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
