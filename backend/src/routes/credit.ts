import { Router } from 'express';
import { WalletAnalyzer } from '../services/walletAnalyzer';
import { CreditEngine } from '../services/creditEngine';
import { RiskEngineService } from '../blockchain/riskEngine';

const router = Router();
const walletAnalyzer = new WalletAnalyzer();
const creditEngine = new CreditEngine();
const riskEngine = new RiskEngineService();

router.get('/score/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const analysis = await walletAnalyzer.analyze(address);
    const score = creditEngine.calculateScore(analysis);
    
    res.json({ address, score, analysis });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate credit score' });
  }
});

router.post('/update/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const analysis = await walletAnalyzer.analyze(address);
    const score = creditEngine.calculateScore(analysis);
    
    await riskEngine.updateScore(address, score);
    
    res.json({ success: true, address, score });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update credit score' });
  }
});

export default router;
