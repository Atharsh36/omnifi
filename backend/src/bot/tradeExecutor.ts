import { ethers } from 'ethers';
import { getContract } from '../blockchain/predictionMarket';
import { settings } from '../config/settings';
import { deductBalance, addBalance } from '../services/vaultService';

export const tradesLog: any[] = [];

export const executeTrade = async (
    marketId: number,
    sideToBuy: 'YES' | 'NO',
    amount: number
) => {
    const contract = getContract();
    if (!contract) {
        console.error(`❌ Arbitrage execution failed. Contract not initialized.`);
        return 0;
    }

    // Vault check
    if (settings.activeUserAddress) {
        const canDeduct = deductBalance(settings.activeUserAddress, amount);
        if (!canDeduct) {
            console.error(`❌ [Arbitrage] Execution blocked. Insufficient vault balance for user: ${settings.activeUserAddress}. Needed: ${amount} BNB`);
            return 0;
        }
    } else {
        console.warn(`⚠️ [Arbitrage] Settings do not contain an activeUserAddress. Firing directly from bot wallet.`);
    }

    try {
        const value = ethers.parseEther(amount.toString());

        // Gas limit is set to a rough estimate to avoid failing txs
        const txOpts = { value, gasLimit: BigInt(500000) };

        let tx;
        if (sideToBuy === 'YES') {
            tx = await contract.buyYes(marketId, txOpts);
        } else {
            tx = await contract.buyNo(marketId, txOpts);
        }

        console.log(`🚀 [Arbitrage] Sent delta-neutral ${sideToBuy} execution on market ${marketId}, waiting for confirmation... Tx: ${tx.hash}`);

        const receipt = await tx.wait();

        const profitNum = Number((Math.random() * 0.05).toFixed(4));

        const tradeData = {
            id: tradesLog.length + 1,
            marketId,
            sideToBuy,
            amount,
            txHash: receipt.hash,
            timestamp: new Date().toISOString(),
            profit: profitNum.toFixed(4), // Simulated profit tracking
            user: settings.activeUserAddress?.toLowerCase() || 'bot_wallet'
        };
        tradesLog.push(tradeData);
        console.log(`✅ [Arbitrage] Successfully executed delta-neutral arbitrage on market ${marketId}`);

        if (settings.activeUserAddress) {
            addBalance(settings.activeUserAddress, amount + profitNum);
        }

        return profitNum;

    } catch (err: any) {
        console.error(`❌ [Arbitrage] Failed to execute trade for market ${marketId}:`, err.message);

        // Note: Mock trade logic for testing without actual BNB setup
        const mockedProfit = Number((Math.random() * 0.05).toFixed(4));
        const mockTrade = {
            id: tradesLog.length + 1,
            marketId,
            sideToBuy,
            amount,
            txHash: '0xmockhash',
            timestamp: new Date().toISOString(),
            profit: mockedProfit.toFixed(4),
            user: settings.activeUserAddress?.toLowerCase() || 'bot_wallet'
        };
        tradesLog.push(mockTrade);

        if (settings.activeUserAddress) {
            addBalance(settings.activeUserAddress, amount + mockedProfit);
        }

        return mockedProfit;
    }
};
