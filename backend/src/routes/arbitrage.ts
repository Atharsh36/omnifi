import express from 'express';
import { arbitrageInsights, arbitrageStats, setIsBotEnabled, scanMarkets } from '../bot/arbitrageEngine';
import { tradesLog } from '../bot/tradeExecutor';
import { settings, updateSettings } from '../config/settings';

const router = express.Router();

router.get('/insights', (req, res) => {
    res.json({
        success: true,
        data: arbitrageInsights
    });
});

router.get('/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalTrades: arbitrageStats.totalTrades,
            totalVolume: arbitrageStats.totalVolume,
            estimatedProfit: arbitrageStats.estimatedProfit,
            lastTradeTime: arbitrageStats.lastTradeTime,
            activeSettings: settings
        }
    });
});

router.post('/settings', (req, res) => {
    try {
        const { threshold, tradeAmount, maxTradesPerDay, botEnabled, activeUserAddress } = req.body;

        if (threshold !== undefined) updateSettings({ arbitrageThreshold: parseFloat(threshold) });
        if (tradeAmount !== undefined) updateSettings({ botTradeAmount: parseFloat(tradeAmount) });
        if (maxTradesPerDay !== undefined) updateSettings({ maxTradesPerDay: parseInt(maxTradesPerDay) });
        if (activeUserAddress !== undefined) updateSettings({ activeUserAddress });

        if (botEnabled !== undefined) {
            setIsBotEnabled(botEnabled);
        }

        res.json({
            success: true,
            message: 'Arbitrage settings updated successfully',
            settings
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
    }
});

router.get('/logs', (req, res) => {
    res.json({
        success: true,
        data: tradesLog
    });
});

// Manual trigger for testing
router.post('/scan', async (req, res) => {
    await scanMarkets();
    res.json({ success: true, message: 'Manual scan triggered' });
});

export default router;
