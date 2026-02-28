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

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://omnifi-predection-market.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/credit', creditRouter);
app.use('/api/vault', vaultRouter);
app.use('/api/arbitrage', arbitrageRouter);

// Start BNB Testnet block listener for Custodial Deposits
startDepositListener();

// Initialize Arbitrage Bot Blockchain Connection
initBlockchain(); // Initialize but do not start scanning automatically


app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    service: "OmniFi Backend",
    timestamp: Date.now()
  });
});

// Self-ping to prevent Render cold start during demo
setInterval(async () => {
  try {
    await fetch("https://omnifi.onrender.com/health");
    console.log("Self ping success");
  } catch (err) {
    console.log("Self ping failed");
  }
}, 5 * 60 * 1000);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
