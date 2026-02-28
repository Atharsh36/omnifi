import { Router } from 'express';
import { getOrCreateVault, getDepositBalance, deductBalance, addBalance, withdrawBalance } from '../services/vaultService';

const router = Router();

router.post('/get-or-create-vault', async (req, res) => {
    try {
        const { userAddress } = req.body;
        if (!userAddress) {
            return res.status(400).json({ error: 'userAddress is required' });
        }
        const vaultAddress = await getOrCreateVault(userAddress);
        res.json({ vaultAddress });
    } catch (error) {
        console.error("Error creating vault:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/balance/:userAddress', (req, res) => {
    try {
        const { userAddress } = req.params;
        const balance = getDepositBalance(userAddress);
        res.json({ balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/deduct', (req, res) => {
    try {
        const { userAddress, amount } = req.body;
        if (!userAddress || typeof amount !== 'number') {
            return res.status(400).json({ error: 'invalid payload' });
        }
        const success = deductBalance(userAddress, amount);
        if (!success) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        res.json({ success: true, balance: getDepositBalance(userAddress) });
    } catch (error) {
        console.error("Error deducting balance:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/add-balance', (req, res) => {
    try {
        const { userAddress, amount } = req.body;
        if (!userAddress || typeof amount !== 'number') {
            return res.status(400).json({ error: 'invalid payload' });
        }
        const success = addBalance(userAddress, amount);
        if (!success) {
            return res.status(400).json({ error: 'Vault not found' });
        }
        res.json({ success: true, balance: getDepositBalance(userAddress) });
    } catch (error) {
        console.error("Error adding balance:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/withdraw', async (req, res) => {
    try {
        const { userAddress, amount } = req.body;
        if (!userAddress || typeof amount !== 'number') {
            return res.status(400).json({ error: 'invalid payload' });
        }

        const result = await withdrawBalance(userAddress, amount);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({ success: true, balance: getDepositBalance(userAddress), txHash: result.hash });
    } catch (error) {
        console.error("Error processing withdrawal:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
